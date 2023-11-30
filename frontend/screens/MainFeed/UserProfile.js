
import { StyleSheet, Text, View, Pressable, ScrollView, Image} from 'react-native';
import React, {useState, useEffect, useRef, useContext} from 'react';
import { Avatar } from '@rneui/themed';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import themeContext from '../../theme/themeContext';
import AwaitRateModal from './AwaitRateModal';
import RateModal from './RateModal';


export default function userProfile(props) {
  const [userPhotos, setUserPhotos] = useState([]);
  const carouselRef = useRef(null);

  const [awaitModalVisible, setAwaitModalVisible] = useState(false);
  const [rateModalVisible, setRateModalVisible] = useState(false);


  const openAwaitModal = () => {
    setAwaitModalVisible(true);
  };

  const openRateModal = () => {
    setRateModalVisible(true);
    

  }

  const rateOrAwaitDecision = async() => {
    const permissionStatus = await isPermitted();
    if(permissionStatus) {
      openRateModal();
    }
    else {
      openAwaitModal();
    }    
  }

  const closeAwaitModal = () => {
    setAwaitModalVisible(false);
  };

  const closeRateModal = () => {
    setRateModalVisible(false);
  };

  

  const selectedUser = props.user
  const selectedUsername = props.user.username
  console.log("SELECTED: ", selectedUsername)
  const theme = useContext(themeContext)


  const isPermitted = async() => {
    try {
      const tokenVal = await SecureStore.getItemAsync('token');
      const response = await axios.get(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/isPermitted', {
      params :{
      token: tokenVal,
      selectedUser: selectedUsername,
      }
    });
    
      return response.data.hasPermission;
    }
    catch (error) {
      console.error('Error:', error);
      return false; 
    }
     
  }

  const goForward = () => {
    carouselRef.current.snapToNext();
  };

  // console.log("Backgroundtheme", theme.background);
  // console.log("djkflsa",theme.color )

  useEffect(() => {
    getUserPhotos()
  }, []);

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
                  

          {selectedUser.ratings && selectedUser.ratings.length > 0 ? (
          selectedUser.ratings.map((rating, index) => (
            <View key={index}>
              <Text style={[styles.title, { color: theme.color }]}>
                {'\n'}Rating by a user
              </Text>
              <Text style={[styles.subtitle, { color: theme.color }]}>
                Usual bedtime: {rating.bedtime}
              </Text>
              <Text style={[styles.subtitle, { color: theme.color }]}>
                Guest frequency: {rating.guest}
              </Text>
              <Text style={[styles.subtitle, { color: theme.color }]}>
                General cleanliness: {rating.clean}
              </Text>
              <Text style={[styles.subtitle, { color: theme.color }]}>
                Noise level: {rating.noise}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.title}>No ratings</Text>
          )}
          


          <Text style={[styles.subtitle,{color:theme.color}]}> {}</Text>

          <Pressable style={modalStyles.closeButton} onPress={rateOrAwaitDecision}>
          <Text style={modalStyles.closeButtonText}>Rate User</Text>
          </Pressable>
          <RateModal visible={rateModalVisible} user={selectedUser.username} onClose={closeRateModal}/>
          <AwaitRateModal visible={awaitModalVisible} currentUser={props.currentUser} username={selectedUser.username} onClose={closeAwaitModal} />
        </ScrollView>
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
    width: 'auto',
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
