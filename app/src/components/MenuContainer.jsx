import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MenuSvg from './MenuSvg';

const MenuWithButtons = ({onHomePress, onRevPress, onPlayPress, onFFPress, onProfilePress}) => {
  return (
    <View style={styles.container}>
      {/* Background image for the menu */}
      <View style={styles.backgroundImage}>
        <MenuSvg />
      </View>

      <View style={styles.buttonContainer}>
        {/* Button 1 - Home */}
        <TouchableOpacity
          onPress={onHomePress}
          style={styles.button}>
          <Image
            source={require('../assets/Home.png')}
            style={styles.smallButtonImage} // Use smaller style for Home icon
          />
        </TouchableOpacity>

        {/* Button 2 - Left Play */}
        <TouchableOpacity
          onPress={onRevPress}
>
          <Image
            source={require('../assets/LeftPlay.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>

        {/* Button 3 - Center Ball */}
        <TouchableOpacity
          onPress={onPlayPress}
          >
          <Image
            source={require('../assets/CenterIconBackground.png')}
            style={styles.largeButtonImage}
          />
        </TouchableOpacity>

        {/* Button 4 - Right Play */}
        <TouchableOpacity
          onPress={onFFPress}
>
          <Image
            source={require('../assets/RightPlay.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>

        {/* Button 5 - Profile */}
        <TouchableOpacity
          onPress={onProfilePress}
          style={styles.button}>
          <Image
            source={require('../assets/Profile.png')}
            style={styles.smallButtonImage} // Use smaller style for Profile icon
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', // Center items vertically
    alignItems: 'center', // Center items horizontally
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '124.405px',
    fill: '#1F060E',
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.42,
    shadowRadius: 113,

    // Elevation for Android (shadow)
    elevation: 20,
  },
  buttonContainer: {
    width: '100%',
    height: '100px',
    bottom: 10,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '20px',
    paddingRight: '20px',
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    marginLeft: 20,
    marginRight: 20,
  },
  buttonImage: {
    width: 60,
    height: 60, // Default size for buttons
    resizeMode: 'contain',
  },
  smallButtonImage: {
    width: 30, // Smaller size for Home and Profile
    height: 30,
    resizeMode: 'contain',
  },
  largeButtonImage: {
    width: 140, // Smaller size for Home and Profile
    height: 140,
    resizeMode: 'contain',
    margin: 0,
  },
});

export default MenuWithButtons;
