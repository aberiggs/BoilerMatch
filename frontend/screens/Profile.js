import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from 'react-native-elements';
import axios from 'axios'

import * as SecureStore from 'expo-secure-store';


export default function Profile({navigation}){
  const [profilePic, setProfilePic] = useState('https://boilermatch.blob.core.windows.net/pfp/sprocket710.jpg')
  const [profilePicExists, setProfilePicExists] = useState(false)
  const [discoverability, setDiscoverability] = useState(false)
  
  useEffect(() => {
    if (!profilePicExists) {
      checkPfpExist()
    }
  },[]);

  useEffect(()=> {
    getDiscoverability()
  },[])
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
    }, [profilePic]);

    if (!result.canceled) {
      const imageToUpload = result.assets[0].uri;
      sendImage(imageToUpload)
    }
  };

  const toggleDiscoverability = async () => {
    const tokenVal = await SecureStore.getItemAsync('token')
      console.log(tokenVal)
      const response = await axios.post(`http://localhost:3000/api/user/updateDiscoverability`, {
        token: tokenVal
      }
      ).catch(error => {
        console.log("Error occured while searching:", error)
      })
      
      setDiscoverability(response.data.userUpdated.discoverable)
    }
  const getDiscoverability = async () => {
    const tokenVal = await SecureStore.getItemAsync('token')
      console.log(tokenVal)
      const response = await axios.post(`http://localhost:3000/api/user/getDiscoverability`, {
        token: tokenVal
      }
      ).catch(error => {
        console.log("Error occured while searching:", error)
      })
        console.log("updated")
      setDiscoverability(response.data.discoverability)
      return response.data.user;
    }


  const navigateToManagePreferences = () => {
    navigation.navigate('ManagePreferences');
  };

  const navigateToManagePreferenceRankings = () => {
    navigation.navigate('ManagePreferenceRankings');
  };

  
  const sendImage = async (imageToUpload) => {

    if (!imageToUpload) {
      // Image is null for some reason
      return
    }
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
    setProfilePicExists(true)
  }



    const navigateToManageInformation = () => {
      navigation.navigate('ManageInformation')
    }
    
    const navigateToManageHousingInformation = () => {
      navigation.navigate('ManageHousingInformation')
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
        <Avatar
          size="xlarge"
          rounded
          source={{uri: profilePic}}
          onPress={() => pickImage()}
          activeOpacity={0.8}>
        </Avatar>
      )
    } else {
      return (
        <Avatar
          size="xlarge"
          title="Hi"
          rounded
          onPress={() => pickImage()}
          activeOpacity={0.8}>
        </Avatar>
      )
    }
  }

  return(
      <View style={styles.container}>
        <View style={{flex: 'column', width: "90%", alignItems: 'center'}}>
              <ProfilePic />
          <Text>Username</Text>
          <Text> This is your profile page</Text>
          
          <Pressable style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}> Logout </Text>
          </Pressable>

        <TouchableOpacity style={styles.button} onPress={navigateToManageInformation}>
        <Text style={styles.buttonText}> Manage Information</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={navigateToManageHousingInformation}>
        <Text style={styles.buttonText}> Manage Housing Info</Text>
        </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={navigateToManagePreferences}>
          <Text style={styles.buttonText}> Manage Preferences</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={navigateToManagePreferenceRankings}>
          <Text style={styles.buttonText}> Manage Preference Rank</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={toggleDiscoverability}>
          <Text style={styles.buttonText}>{discoverability ? 'Go Private' : 'Go Public!'}</Text>
          </TouchableOpacity>
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
    button: {
      width: "40%",
      height: 40,
      backgroundColor: "gold",
      borderRadius: 6,
      justifyContent: 'center',
      margin:20,
    },
    buttonText: {
      fontSize: 15,
      alignSelf: "center"
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

