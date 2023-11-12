
import { StyleSheet, Text, View, Pressable, ScrollView, Image, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useRef, useContext} from 'react';
import { Avatar } from '@rneui/themed';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import themeContext from '../../theme/themeContext';
import { Ionicons,FontAwesome} from '@expo/vector-icons';

export default function userProfile(props) {
  const [userPhotos, setUserPhotos] = useState([]);
  const carouselRef = useRef(null);
  const [viewingSelf, setViewingSelf] = useState(false)
  const selectedUser = props.user
  const theme = useContext(themeContext)
  const [userLiked, setUserLiked] = useState(false)
  const [userBookmarked, setUserBookmarked] = useState(false)
  const [userDisliked, setUserDisliked] = useState(false)
  const goForward = () => {
    carouselRef.current.snapToNext();
  };


  useEffect(() => {
    getInteractionWithUser()
  }, [props.visible]);

  useEffect(() => {
    getUserPhotos()
  }, []);
  
  const getInteractionWithUser = async() => {

    console.log(selectedUser)
    const tokenVal = await SecureStore.getItemAsync('token');
    response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getInteractionWithUser', {
      token: tokenVal,
      userShown: selectedUser.username

    }
    ).catch(error => {
      console.log("Error occurred while getting users:", error)
    })
    console.log("HII")
    console.log(response.data)
    setViewingSelf(response.data.viewingSelf)

    interaction = response.data.interaction
    if (interaction != null){
    setUserLiked(interaction.liked_or_disliked =="liked" || false)
    
    setUserDisliked(interaction.liked_or_disliked =="disliked" || false)

    setUserBookmarked(interaction.bookmarked || false)
  }
  }
  /* Gets the URI's for all user photos */
  const getUserPhotos = async () => {
    console.log(selectedUser)
    //setIsLoading(true)
    const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/otherphotos', {
      username: selectedUser.username,
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
    //setIsLoading(false)
  }

  _renderItem = ({item, index}, parallaxProps) => {
    const photoUri = 'https://boilermatch.blob.core.windows.net/otherphotos/' + item
    return (
      <View style={sliderStyle.item}>
        <ParallaxImage
            source={{ uri: photoUri}}
            containerStyle={sliderStyle.imageContainer}
            style={sliderStyle.image}
            parallaxFactor={0}
            {...parallaxProps}
        />
      </View>
    );
}

  return (

    <View style={[modalStyles.modalContainer,{backgroundColor:theme.background}]}>
      <View style={modalStyles.modalContent}>
        <ScrollView style={{width: '70%'}}>
          <Avatar
            size='xlarge'
            rounded
            source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + selectedUser.username + '.jpg'}}
            containerStyle={{backgroundColor: 'grey', margin: 10, alignSelf: 'center'}}
            activeOpacity={0.8}
          />

          <Text style={[styles.subtitle,{color:theme.color}]}>Name: {selectedUser.information.firstName} {selectedUser.information.lastName}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Gender: {selectedUser.information.gender}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Grad Year: {selectedUser.information.graduation}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Major: {selectedUser.information.major}</Text>


          <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Carousel
              ref={carouselRef}
              data={userPhotos}
              sliderWidth={400}
              itemWidth={270}
              hasParallaxImages={true}
              renderItem={this._renderItem}
            />
          </View>

          <Text style={[styles.title,{color:theme.color}]}>{'\n'}Information</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Year for Roommate: {selectedUser.information.yearForRoommate}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Sleeping Habits: {selectedUser.information.sleepingHabits}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Political Views: {selectedUser.information.politicalViews}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Drinking Habits: {selectedUser.information.drinkingHabits}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Pets: {selectedUser.information.pets}</Text>
          

          <Text style={[styles.title,{color:theme.color}]}>{'\n'}Housing Information</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Housing: {selectedUser.housingInformation.housing}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Confirmed Housing Situation: {selectedUser.housingInformation.confirmedHousingSituation}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Number Of Roommates: {selectedUser.housingInformation.numRoommates}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>UnknownHousingSituation: {selectedUser.housingInformation.unknownHousingSituation}</Text>

          <Text style={[styles.title,{color:theme.color}]}>{'\n'}Preferences</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Gender: {selectedUser.preferences.gender}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Bedtime: {selectedUser.preferences.bedtime}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Guests: {selectedUser.preferences.guests}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Clean: {selectedUser.preferences.clean}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Noise: {selectedUser.preferences.noise}</Text>

        </ScrollView>
        { !viewingSelf ? (
        <View style={modalStyles.iconRow}>
        <TouchableOpacity style={modalStyles.iconContainer} onPress={() =>{setUserLiked(!userLiked); setUserDisliked(false); props.handleLikePress(selectedUser)}}>
          <Ionicons
            name={userLiked ? 'heart' : 'heart-outline'} 
            color={userLiked ? 'red' : 'gray'}
            size={40}
          />
        </TouchableOpacity>
        <TouchableOpacity style={modalStyles.iconContainer} onPress={() => {setUserBookmarked(!userBookmarked); props.handleBookmarkPressed(selectedUser)}}>
          <Ionicons
            name={userBookmarked ? 'bookmark' : 'bookmark-outline'} 
            color={userBookmarked ? 'gold' : 'gray'}
            size={40}
          />
        </TouchableOpacity>

        <TouchableOpacity style={modalStyles.iconContainer} onPress={() => {setUserDisliked(!userDisliked); setUserLiked(false); props.handleDislikePress(selectedUser)}}>
          <Ionicons
            name={userDisliked ? 'heart-dislike' : 'heart-dislike-outline'} 
            color={userDisliked? 'red' : 'gray'}
            size={40}
          />
        </TouchableOpacity>
      </View>
        ):(<></>)}

        <View style={modalStyles.closeButtonContainer}>
          <Pressable style={modalStyles.closeButton} onPress={props.closeModal}>
            <Text style={modalStyles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    backgroundColor: "white"
  },
  modalContent: {
    flex: 'column', 
    width: '100%',
    height: '90%', 
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: "space-between",
    width: "60%"
  },
  iconContainer: {
    paddingHorizontal: 5
  },
  closeButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    height: '8%',
  },
  closeButton: {
    backgroundColor: "gold",
    borderRadius: 6,
    justifyContent: 'center',
    width: '60%',
    alignSelf: 'center',
    padding: 10
  },
  closeButtonText: {
    fontSize: 20,
    alignSelf: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'left',
    marginVertical: 1,
  },
})

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'left',
    marginVertical: 1,
  },
  });
  
  const sliderStyle = StyleSheet.create({
    item: {
      width: '100%',
      height: 360,
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
