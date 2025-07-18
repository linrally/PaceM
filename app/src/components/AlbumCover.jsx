import React from 'react';
import { StyleSheet, Image } from 'react-native';

const AlbumCover = (source) => {
    return (
        <Image
            source={source}
            style={styles.image}
        />
    );
};

const styles = StyleSheet.create({
    image: {
        maxWidth: 250,
        maxHeight: 250,
        width: '100%',
        height: '100%',
        borderRadius: 20, 
    },
});

export default AlbumCover;
