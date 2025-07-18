import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View, StyleSheet, Text } from 'react-native';

const MenuSvg = () => {
  return (
    <View style={styles.container}>
      <Svg width="430" height="269" viewBox="0 0 430 269" fill="none">
        <Path
          d="M249.3 123.838C263.566 129.087 278.098 134.678 293.299 134.678H432.098C449.218 134.678 463.098 148.557 463.098 165.678V238.159C463.098 255.28 449.218 269.159 432.098 269.159H0C-17.1208 269.159 -31 255.28 -31 238.159V165.678C-31 148.557 -17.1208 134.678 0 134.678H138.701C153.902 134.678 168.434 129.087 182.7 123.838C192.91 120.082 204.169 118 216 118C227.831 118 239.09 120.082 249.3 123.838Z"
          fill="#1F060E"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#ED447C', // Pink shadow color (deep pink)
    shadowOffset: { width: 0, height: 0 }, // No offset for equal glow on all sides
    shadowOpacity: 1, // Full opacity for strong glow
    shadowRadius: 40, // The blur radius of the glow
    elevation: 20, // Android shadow equivalent (to support Android)
  },
});

export default MenuSvg;
