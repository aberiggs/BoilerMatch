import React, { useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
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
      <Text style={[styles.title, { color: theme.textColor }]}>Welcome to Boiler Match</Text>
      <Image
        source={require('../assets/purdue-pete-logo.png')} // Change the path accordingly
        style={styles.logo}
      />
      <Text style={[styles.subtitle, { color: theme.textColor }]}>
        Let's find a roommate!
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

        <Text onPress={handleRegister} style={styles.registerText}>Create a new account</Text>
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
    fontSize: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    width: '60%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor:"gold"
  },
  buttonText: {
    fontSize: 18,
    alignSelf: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  logo: {
    width: "80%", 
    height: "40%", 
    marginBottom: 20,
  },
  registerText: {
    fontSize: 15,
    color: "#5C5C5C",
    marginTop: 20
  }
});
