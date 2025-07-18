import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import Dashboard from './src/screens/Dashboard';
import AboutYou from './src/screens/AboutYou';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Login: 'login',
      Dashboard: 'dashboard', // Updated to 'dashboard' to match second sample
      AboutYou: 'about-you',  // Added screen for deep linking
    },
  },
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="AboutYou" component={AboutYou} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
