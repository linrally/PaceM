import requests
import base64
import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime
from sklearn.metrics.pairwise import cosine_similarity
import random as rnd
import time
from dotenv import load_dotenv
import os
import sys 

load_dotenv()
CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')

client_credentials = f"{CLIENT_ID}:{CLIENT_SECRET}"
client_credentials_base64 = base64.b64encode(client_credentials.encode())

token_url = 'https://accounts.spotify.com/api/token'
headers = {
    'Authorization': f'Basic {client_credentials_base64.decode()}'
}
data = {
    'grant_type': 'client_credentials'
}
response = requests.post(token_url, data=data, headers=headers)

if response.status_code == 200:
    access_token = response.json()['access_token']
else:
    exit()

song_names = []

def get_trending_playlist_data(playlist_id, access_token):
    sp = spotipy.Spotify(auth=access_token)

    playlist_tracks = sp.playlist_tracks(playlist_id, fields='items(track(id, name, artists, album(id, name)))')

    music_data = []
    for track_info in playlist_tracks['items']:
        track = track_info['track']
        track_name = track['name']
        artists = ', '.join([artist['name'] for artist in track['artists']])
        album_name = track['album']['name']
        album_id = track['album']['id']
        track_id = track['id']

        audio_features = sp.audio_features(track_id)[0] if track_id != 'Not available' else None

        try:
            album_info = sp.album(album_id) if album_id != 'Not available' else None
            release_date = album_info['release_date'] if album_info else None
        except:
            release_date = None

        try:
            track_info = sp.track(track_id) if track_id != 'Not available' else None
            popularity = track_info['popularity'] if track_info else None
        except:
            popularity = None

        track_data = {
            'Track Name': track_name,
            'Artists': artists,
            'Album Name': album_name,
            'Album ID': album_id,
            'Track ID': track_id,
            'Popularity': popularity,
            'Release Date': release_date,
            'Duration (ms)': audio_features['duration_ms'] if audio_features else None,
            'Explicit': track_info.get('explicit', None),
            'External URLs': track_info.get('external_urls', {}).get('spotify', None),
            'Danceability': audio_features['danceability'] if audio_features else None,
            'Energy': audio_features['energy'] if audio_features else None,
            'Key': audio_features['key'] if audio_features else None,
            'Loudness': audio_features['loudness'] if audio_features else None,
            'Mode': audio_features['mode'] if audio_features else None,
            'Speechiness': audio_features['speechiness'] if audio_features else None,
            'Acousticness': audio_features['acousticness'] if audio_features else None,
            'Instrumentalness': audio_features['instrumentalness'] if audio_features else None,
            'Liveness': audio_features['liveness'] if audio_features else None,
            'Valence': audio_features['valence'] if audio_features else None,
            'Tempo': audio_features['tempo'] if audio_features else None,
        }

        music_data.append(track_data)

    df = pd.DataFrame(music_data)


    return df

playlist_id = sys.argv[1]

music_df = get_trending_playlist_data(playlist_id, access_token)
song_names = music_df['Track Name'].tolist()
song_ids = music_df['Track ID'].tolist()
#print(song_ids)
# Display the DataFrame
# print(music_df)
# print(song_names)

data = music_df

def calculate_weighted_popularity(release_date):
    release_date = datetime.strptime(release_date, '%Y-%m-%d')
    time_span = datetime.now() - release_date
    weight = 1 / (time_span.days + 1)
    return weight

scaler = MinMaxScaler()
music_features = music_df[['Danceability', 'Energy', 'Key', 
                           'Loudness', 'Mode', 'Speechiness', 'Acousticness',
                           'Instrumentalness', 'Liveness', 'Valence', 'Tempo', 'Duration (ms)']].values
music_features_scaled = scaler.fit_transform(music_features)

def content_based_recommendations(input_song_name, tempo, num_recommendations=5):
    if input_song_name not in music_df['Track Name'].values:
        print(f"'{input_song_name}' not found in the dataset. Please enter a valid song name.")
        return

    input_song_index = music_df[music_df['Track Name'] == input_song_name].index[0]
    similarity_scores = cosine_similarity([music_features_scaled[input_song_index]], music_features_scaled)
    similar_song_indices = similarity_scores.argsort()[0][::-1][1:num_recommendations + 1]
    tempo_lower = tempo - 5
    tempo_upper = tempo + 5
    tempo_values = music_df['Tempo'].values[similar_song_indices]
    within_tempo_mask = (tempo_values >= tempo_lower) & (tempo_values <= tempo_upper)
    within_tempo_indices = similar_song_indices[within_tempo_mask]

    if len(within_tempo_indices) == 0:
        return pd.DataFrame()

    # Get the top N recommendations based on content-based filtering
# Corrected column list with the missing comma added
    content_based_recommendations = music_df.iloc[within_tempo_indices][
        ['Track Name', 'Track ID', 'Artists', 'Album Name', 'Release Date', 'Popularity', 'Tempo', 'Duration (ms)']].head(num_recommendations)


    return content_based_recommendations

def hybrid_recommendations(input_song_name, tempo, num_recommendations=5, alpha=0.5):
    if input_song_name not in music_df['Track Name'].values:
        return

    content_based_rec = content_based_recommendations(input_song_name, tempo, num_recommendations)

    popularity_score = music_df.loc[music_df['Track Name'] == input_song_name, 'Popularity'].values[0]

    weighted_popularity_score = popularity_score * calculate_weighted_popularity(music_df.loc[music_df['Track Name'] == input_song_name, 'Release Date'].values[0])

    input_song_data = {
        'Track Name': [input_song_name],
        'Track ID': [music_df.loc[music_df['Track Name'] == input_song_name, 'Track ID'].values[0]],
        'Artists': [music_df.loc[music_df['Track Name'] == input_song_name, 'Artists'].values[0]],
        'Album Name': [music_df.loc[music_df['Track Name'] == input_song_name, 'Album Name'].values[0]],
        'Release Date': [music_df.loc[music_df['Track Name'] == input_song_name, 'Release Date'].values[0]],
        'Tempo': [music_df.loc[music_df['Track Name'] == input_song_name, 'Tempo'].values[0]],
        'Duration (ms)': [music_df.loc[music_df['Track Name'] == input_song_name, 'Duration (ms)'].values[0]],
        'Popularity': [weighted_popularity_score]
    }
    input_song_df = pd.DataFrame(input_song_data)

    hybrid_recommendations = pd.concat([content_based_rec, input_song_df], ignore_index=True)

    hybrid_recommendations = hybrid_recommendations.sort_values(by='Popularity', ascending=False)

    hybrid_recommendations = hybrid_recommendations[hybrid_recommendations['Track Name'] != input_song_name]

    return hybrid_recommendations

input_song_name = rnd.choice(music_df['Track Name'].values)
tempo_input = 100 
recommendations = hybrid_recommendations(input_song_name, tempo_input, num_recommendations=5)
recommended_songs_dict_list = []
if not recommendations.empty:
    # Iterate over the recommendations and create a dictionary for each song
    for _, row in recommendations.iterrows():
        song_info = {
            'Song Name': row['Track Name'],
            'Song ID': row['Track ID'],
            'Tempo': row['Tempo']
        }
        recommended_songs_dict_list.append(song_info)


res = {
    'recs': recommended_songs_dict_list,
} 

print(res)

# #print(f"Hybrid recommended songs for '{input_song_name}':")
# #print(recommendations.to_string(index=False))
# durationinms = 6000000

# # Initialize song_names as an empty list
# song_names = []
# recommended_songs_list = []
# recommended_songsid_list = []

# while durationinms > -1000:
#     # Randomly select an input song from the playlist
#     input_song_name = rnd.choice(music_df['Track Name'].values)

#     # Get recommendations based on the input song and desired tempo
#     recommendations = hybrid_recommendations(input_song_name, tempo_input, num_recommendations=5)
    
#     # If recommendations are empty, continue to next iteration
#     if recommendations.empty:
#         continue

#     # Filter out songs that are already in the list
#     recommendations = recommendations[~recommendations['Track Name'].isin(song_names)]

#     # If there are no new recommendations, continue to the next iteration
#     if recommendations.empty:
#         continue

#     # Add the new tracks to the recommended songs list
#     new_recs = recommendations['Track Name'].tolist()
#     new_recs_ids = recommendations['Track ID'].tolist()
#     recommended_songs_list.extend(new_recs)
#     recommended_songsid_list.extend(new_recs_ids)

#     # Update the list of existing song names
#     song_names.extend(new_recs)

#     # Update durationinms by subtracting the duration of the added songs
#     total_duration_added = recommendations['Duration (ms)'].sum()
#     durationinms -= total_duration_added

# print(recommended_songs_list)
# print(recommended_songsid_list)



