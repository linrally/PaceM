import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Button = ({ onPress, children }) => {
    return (
        <TouchableOpacity
            style={styles.buttonContainer}
            onPress={onPress}
        >
            <LinearGradient
                colors={['#E14176F2', '#9B091E']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {children}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        width: 230,
        height: 52,
        borderRadius: 30,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Button;
