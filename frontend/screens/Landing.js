import React, { useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import themeContext from '../theme/themeContext';

export default function Landing({ navigation }) {
  const theme = useContext(themeContext);

  useEffect(() => {
    handleRemember();
  }, []);

  const handleRemember = async () => {
    const tokenVal = await SecureStore.getItemAsync('token');
    const usernameVal = await SecureStore.getItemAsync('username');

    if (!tokenVal || !usernameVal) {
      return;
    }

    const response = await axios
      .post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/verifylanding', {
        token: tokenVal,
      })
      .catch((error) => {
        if (error.response) {
          return error.response.data;
        }
        return;
      });

    if (response?.data?.success) {
      navigation.navigate('MainTabNavigator');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };
  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]}>Welcome to Boiler Match!</Text>
      <Text style={[styles.subtitle, { color: theme.textColor }]}>
        Let's find a roommate
      </Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.primaryColor }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.secondaryColor }]}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    width: '60%',
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});
