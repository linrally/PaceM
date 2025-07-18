import React from 'react';
import { TouchableOpacity, StyleSheet, Image, View, Text } from 'react-native';

const HeartButton = ({ onPress }) => {
    return (
        <TouchableOpacity
            style={styles.buttonContainer}
            onPress={onPress}
        >
            <Image
                source={require('../assets/images/heart.png')}
                style={styles.image}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        width: 250,
        height: 250,
    },
    image: {
        width: 250,
        height: 250,
    },
});

export default HeartButton;
