  import React, {useState} from 'react';
  import { View, Text, StyleSheet, Modal, Alert } from 'react-native';
  import Button from './Button';
  import InputField from './InputField';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import moment from 'moment';
  import axios from 'axios';

  const StylizedModal = ({ isVisible, hideModal, content, modifyPlaylist }) => {
    const [targetPace, setTargetPace] = useState('');
    const [targetDistance, setTargetDistance] = useState('');

    const calculateExpireTime = (pace) => {
      const paceDuration = moment.duration(pace);
      const currentTime = moment();
      const expireTime = currentTime.add(30, 'minutes').add(paceDuration);
      return expireTime;
    };

    async function getOnePlaylist() {
      let accessToken = await AsyncStorage.getItem('authToken');
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        }
      });
      const data = await response.json();
      return data.items[0].id;
    }

    const generatePlaylist = async () => {
      const pid = await getOnePlaylist();
      console.log(`Found playlist ${pid}`);
      /*const response = await axios.get('http://localhost:3000/recs', {
        params: {
          pid: pid,
        },
      });
      return response.data.recs;*/
      return ['11dFghVXANMlKmJXsNCbNl', '7ouMYWpwJ422jRcDASZB7P', '2takcwOaAZWiXQijPHIx7B'];
    }

    const handleSubmit = async () => {
      if (!targetPace || !targetDistance) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      else if( !moment(targetPace, 'mm:ss', true).isValid()){
        Alert.alert('Error', `The time ${targetPace} is not valid.`);
        return;
      }
      const expireTime = calculateExpireTime(targetPace);
      const runData = {
        targetPace,
        targetDistance,
        expireTime: expireTime.toISOString(),
        isRunning: true,
      };
      await AsyncStorage.setItem('runData', JSON.stringify(runData));
      const list = await generatePlaylist();
      modifyPlaylist(list);
      hideModal();
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={hideModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{content}</Text>
            <InputField
              placeholder="Enter Target Distance (mi)"
              keyboardType="numeric"
              value={targetDistance}
              onChangeText={(text) => setTargetDistance(text)}
            />
            <InputField
              placeholder="Enter Target Pace (mm:ss)"
              keyboardType="numeric"
              value={targetPace}
              onChangeText={(text) => setTargetPace(text)}
            />
            <Button onPress={handleSubmit}>
              <Text style={styles.submitText}>{'Submit'}</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    },
    modalContent: {
      backgroundColor: '#000',
      padding: 20,
      borderRadius: 50,
      borderWidth: 7,
      alignItems: 'center',
      width: '80%',
    },
    modalText: {
      fontSize: 18,
      color: '#fff',
      fontFamily: 'Poppins-Bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    submitText: {
      fontSize: 18,
      color: '#fff',
      fontFamily: 'Poppins-Bold',
    },
  });

  export default StylizedModal;
