import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MenuContainer from '../components/MenuContainer';
import HeartButton from '../components/HeartButton';
import StylizedModal from '../components/StylizedModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import AlbumCover from '../components/AlbumCover';

const convertPaceToMinutes = (pace) => {
  if (!pace) return null;
  const duration = moment.duration('00:'+pace); //mmss
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  return minutes + seconds / 60;
};

const calculateBPM = (distance, stride, paceInMinutes) => {
  if (!distance || !stride || !paceInMinutes) return null;
  const steps = distance * 63360 / stride;
  return Math.round(steps / paceInMinutes);
};

const Dashboard = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [runData, setRunData] = useState(null);
  const [targetBPM, setTargetBPM] = useState(null);
  const [playlist, setPlaylist] = useState(null);

  const handlePress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const fetchUserData = async (userId) => { // This should probably be fetched only once at the beginning
    try {
      const response = await axios.get(`http://localhost:3000/getUser?userId=${userId}`);
      setUserData(response.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
    }
  };

  const getStoredRunData = async () => {
    try {
      const storedRunData = await AsyncStorage.getItem('runData');
      if (storedRunData) {
        setRunData(JSON.parse(storedRunData));
      }
    } catch (error) {
      console.error('Error retrieving run data from AsyncStorage:', error);
    }
  };

  async function startPlayback(uris, deviceId = null, contextUri = null, offset = null, positionMs = 0) {
    let accessToken = await AsyncStorage.getItem('authToken');
    const body = {};
    if (contextUri) {
      body.context_uri = contextUri;
    }
    if (uris) {
      body.uris = uris;
    }
    if (offset) {
      body.offset = offset;
    }
    if (positionMs) {
      body.position_ms = positionMs;
    }
    const deviceQueryParam = deviceId ? `?device_id=${deviceId}` : '';
    const response = await axios.put(`https://api.spotify.com/v1/me/player/play${deviceQueryParam}`, body, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
    });
    console.log('Playback started successfully:', response.data);
  }

  const handlePlayPress = async () => {
    if(playlist){
      const uris = playlist.map(trackId => `spotify:track:${trackId}`);
      console.log(uris);
      await startPlayback(uris);
    }
  };

  const handleHomePress = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  };

  const handleProfilePress = async () => {
    if (runData !== null) {
      const newData = {};
      await AsyncStorage.setItem('runData', JSON.stringify(newData));
    }
  };

  /*const getImage = async (id) => {
    let accessToken = await AsyncStorage.getItem('authToken');
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response);
  };*/

  const handleFFPress = async () => {
    // DO SOMETHING
  };

  const handleRevPress = async () => {
    // DO SOMETHING
  }

  useEffect(() => {
    const getUserId = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        await fetchUserData(userId);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    getStoredRunData();
  });

  useEffect(() => {
    const newPaceInMinutes = convertPaceToMinutes(runData?.targetPace);
    const newBPM = calculateBPM(runData?.targetDistance, userData?.stride, newPaceInMinutes);
    setTargetBPM(newBPM);
  }, [runData, userData]);

  return (
    <View style={styles.container}>
      <View style={styles.paceStats}>
        <View style={styles.targetContainer}>
          <Text style={styles.targetPaceHeader}>Target Pace</Text>
          <Text style={styles.targetPaceStats}>{runData?.targetPace || 'N/A'}</Text>
        </View>
        <View style={styles.targetContainer}>
          <Text style={styles.currentPaceHeader}>Target BPM</Text>
          <Text style={styles.currentPaceStats}>{targetBPM || 'N/A'}</Text>
        </View>
      </View>
      { (runData && runData?.isRunning === true) ?
        (
          <View style={styles.albumCoverContainer}>
            <AlbumCover source={require('../assets/images/example.png')}/>
          </View>
        ) :
        (
          <View style={styles.heartButtonContainer}>
            <HeartButton onPress={handlePress}/>
          </View>
        )
      }

      <StylizedModal
        isVisible={modalVisible}
        hideModal={closeModal}
        modifyPlaylist={setPlaylist}
        content="Start Run"
      />

      <View style={styles.menu}>
        <MenuContainer onHomePress={handleHomePress} onPlayPress={handlePlayPress} onProfilePress={handleProfilePress} onFFPress={handleFFPress}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1, // This ensures the container fills the screen
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    position: 'relative',
    paddingTop: 100,
  },
  paceStats: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the child horizontally
    alignItems: 'center', // Center the child vertically
    marginTop: 50, // Space from the top
    paddingHorizontal: 20, // Padding around the text for better spacing
    zIndex: 1, // Ensure it's above other components if needed
  },
  targetContainer: {
    display: 'flex',
    alignItems: 'center', // Center the content horizontally
    justifyContent: 'center', // Center the content vertically
    gap: 10,
    width: 130,
    height: 100,
  },
  targetPaceHeader: {
    fontSize: 15,
    marginBottom: 5,
    fontFamily: 'Poppins-Regular',
    color: '#F2F2F2', // Text color
    textShadowColor: '#FFF', // Shadow color
    textShadowOffset: { width: 0, height: 0 }, // No horizontal or vertical offset
    textShadowRadius: 14, // The blur radius of the shadow
  },
  targetPaceStats: {
    fontSize: 40,
    fontFamily: 'Poppins-Bold',
    color: '#F2F2F2', // Text color
    textShadowColor: '#FFF', // Shadow color
    textShadowOffset: { width: 0, height: 0 }, // No horizontal or vertical offset
    textShadowRadius: 14, // The blur radius of the shadow
  },
  currentPaceHeader: {
    color: '#FE73A1',
    fontSize: 15,
    marginBottom: 5,
    fontFamily: 'Poppins-Regular',
    textShadowColor: '#E22A67', // Shadow color
    textShadowOffset: { width: 0, height: 0 }, // No offset for shadow
    textShadowRadius: 23.6, // Blur radius
  },
  currentPaceStats: {
    color: '#FE73A1',
    fontSize: 40,
    fontFamily: 'Poppins-Bold',
    textShadowColor: '#E22A67', // Shadow color
    textShadowOffset: { width: 0, height: 0 }, // No offset for shadow
    textShadowRadius: 23.6, // Blur radius
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  heartButtonContainer: {
    flex: 1, 
    alignItems: 'center',
    marginTop: 40
  },
  albumCoverContainer: {
    flex: 1, 
    alignItems: 'center',
    marginTop: 40
  },
});

export default Dashboard;
