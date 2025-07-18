import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, Alert } from 'react-native';
import axios from 'axios';
import InputField from '../components/InputField';
import Button from '../components/Button'; // Import the custom button
import AsyncStorage from '@react-native-async-storage/async-storage';

const AboutYou = ({ navigation }) => {
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (!gender || !height) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/createUser', {
        gender,
        height,
      });
      const userId = response.data.data.insertedId;
      await AsyncStorage.setItem('userId', userId);
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert('Error', 'Failed to submit data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/blob-tl.png')} style={styles.blobTL} />
      <Image source={require('../assets/images/blob-br.png')} style={styles.blobBR} />

      <Text style={styles.title}>About You</Text>

      <InputField
        placeholder="Enter Gender"
        value={gender}
        onChangeText={(text) => setGender(text)}
      />

      <InputField
        placeholder="Enter Height (in)"
        keyboardType="numeric"
        value={height}
        onChangeText={(text) => setHeight(text)}
      />

      <Button onPress={handlePress}>
        <Text style={styles.submitText}>{loading ? 'Submitting...' : 'Submit'}</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  blobTL: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 300,
    height: 300,
  },
  blobBR: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 400,
    height: 400,
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    marginBottom: 45,
  },
  submitText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
});

export default AboutYou;
