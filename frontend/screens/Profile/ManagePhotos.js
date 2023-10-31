import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image, ScrollView, Modal, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Icon } from 'react-native-vector-icons/Feather';
import axios from 'axios'

import Carousel, {ParallaxImage} from 'react-native-snap-carousel';

import * as SecureStore from 'expo-secure-store';

export default function ManagePhotos({navigation}) { 
    const [userPhotos, setUserPhotos] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getUserPhotos()
    },[])

    /* Gets the URI's for all user photos */
    const getUserPhotos = async () => {
      const username = await SecureStore.getItemAsync('username')
      const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/otherphotos', {
        username: username
      }
      ).catch(error => {
        console.log("Error occurred while fetching other photos", error)
        console.log(error.data)
      })

      if (!response || !response.data || !response.data.photos) {
        console.log("No response data")
        return;
      }

      const photos = response.data.photos
      setUserPhotos(photos)
      setIsLoading(false)
    }

    /* Opens image picker for the user to pick an image to upload, and upon choosing it, sends the image to the backend */
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          aspect: [3, 4],
          quality: 0,
        });
    
        if (!result.canceled) {
          const imageToUpload = result.assets[0].uri;
          setIsLoading(true)
          await sendImage(imageToUpload)
          await getUserPhotos()
        }
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
        const tokenVal = await SecureStore.getItemAsync('token')
        formData.append('token', tokenVal)
        // TODO: Errors need to be caught here (server down/no connection, etc.)
        const apiAddr = process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/otherphotos/upload/' + tokenVal
        await axios.post(apiAddr, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).catch(err => {
            if (err.response) {
              return err.response.data;
            }
        });
    }
    

    const deletePhoto = () => {

    }

    const CarouselDisplay = () => {
        if (!userPhotos) return
        else if (userPhotos.length === 0) {
            // No items to display
            return (
                <Text>Nothing to display</Text>
            )
        } else {
            return (
                <View>
                    <Carousel
                    data={userPhotos}
                    sliderWidth={400}
                    itemWidth={300}
                    hasParallaxImages={true}
                    renderItem={this._renderItem}
                    />
                </View>
            )
        }
    }

    _renderItem = ({item, index}, parallaxProps) => {
      const photoUri = 'https://boilermatch.blob.core.windows.net/otherphotos/' + item
        return (
          <View style={sliderStyle.item}>
            <ParallaxImage
                source={{ uri: photoUri }}
                containerStyle={sliderStyle.imageContainer}
                style={sliderStyle.image}
                parallaxFactor={0}
                {...parallaxProps}
            />
          </View>
        );
    }


      return (
        // TODO: Make modal for when userPhotos is null, or initialize it showing to true and change its state once we fetch images :)
        <View style={styles.container}>
          <Modal animationType='fade' visible={isLoading}>
            <SafeAreaView style={styles.container}>
            <Text style={{fontSize: 35, alignSelf: 'center'}}>Loading...</Text>
            </SafeAreaView>
          </Modal>

          <View style={{height: 400}}>
              <CarouselDisplay />
          </View>
          <Pressable style={styles.button} onPress={() => pickImage()}>
              <Text style={styles.buttonText}>Add New Photo</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Back</Text>
          </Pressable>
        </View>
    )
    
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: 25,
      marginVertical: 14,
    },
    button: {
      width: "50%",
      height: 50,
      backgroundColor: "gold",
      borderRadius: 6,
      justifyContent: 'center',
      margin:10,
      
    },
    buttonText: {
      fontSize: 15,
      alignSelf: "center",
      textAlign:"center",
    },
});
  
const sliderStyle = StyleSheet.create({
    item: {
      width: '100%',
      height: '100%',
    },
    imageContainer: {
      flex: 1,
      marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
      backgroundColor: 'white',
      borderRadius: 8,
    },
    image: {
      ...StyleSheet.absoluteFillObject,
      resizeMode: 'cover',
    },
  })
