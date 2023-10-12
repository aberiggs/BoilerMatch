import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'

import * as SecureStore from 'expo-secure-store';


export default function Profile({navigation}){
  const [imageToUpload, setImageToUpload] = useState(null);
  const [profilePic, setProfilePic] = useState('https://boilermatch.blob.core.windows.net/pfp/sprocket710.jpg')
  const [profilePicExists, setProfilePicExists] = useState(false)

  useEffect(() => {
    if (!profilePicExists) {
      checkPfpExist()
    }
  },[]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
    }, [profilePic]);

    if (!result.canceled) {
      setImageToUpload(result.assets[0].uri);
      console.log("does it run")
      await sendImage();
    }
  };

  const sendImage = async () => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageToUpload,
      type: 'image/jpeg',
      name: 'testImage.jpg',
    });

    // TODO: Errors need to be caught here (server down/no connection, etc.)
    await axios.post('http://localhost:3000/api/user/pfp/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).catch(err => {
        if (err.response) {
          return err.response.data;
        }
    });

    setProfilePic(imageToUpload)
    setImageToUpload(null)
    setProfilePicExists(true)
  }

  const checkPfpExist = async () => {
    const response = await axios.get(profilePic).catch((error) => {
      return error.response
    })
    setProfilePicExists(response.status === 200)
  }
  
   const handleLogout = async () => {
        await SecureStore.deleteItemAsync('token')
        await SecureStore.deleteItemAsync('username')
        navigation.navigate("Landing")
    }

  const ProfilePic = () => {
    if (profilePicExists) {
      return (
        <Image source={{uri: profilePic}} style={{width: 100, height: 100, borderRadius: 50}}/>
      )
    } else {
      return (
        <Text style={styles.title}>No PFP</Text>
      )
    }
  }

  return(
      <View style={styles.container}>
        <View style={{flex: 'column', width: "90%", alignItems: 'center'}}>
          <Pressable style={{width: 100, height: 100, borderRadius: 50}} onPress={pickImage}>
              <ProfilePic />
          </Pressable>
          <Text>Username</Text>
          <Text> This is your profile page</Text>

          
          
          <Pressable style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}> Logout </Text>
          </Pressable>
        </View>
      </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
      width: "40%",
      height: 50,
      backgroundColor: "gold",
      borderRadius: 6,
      justifyContent: 'center',
    },

    buttonText: {
      fontSize: 20,
      alignSelf: "center"
    },
    otherText: {
      fontSize: 16,
      paddingLeft: 5
    },
    inputFieldBox: {   
      flexDirection: 'row',
      height: 40,
      width: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: 10,
      marginBottom: 10,
      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 5,        
    },
    inputField: {
      width: "100%",
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: 25,
      marginBottom: 30,
    },
    subtitle: {
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'left',
      marginBottom: 8,
    },
    errorMes: {
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingHorizontal: 10,
      marginBottom: 8,
      color: 'red',
      marginHorizontal: 'auto'
    }
  });

