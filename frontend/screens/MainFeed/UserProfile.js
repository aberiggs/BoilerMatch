
import { StyleSheet, Text, View, Pressable, ScrollView, Image} from 'react-native';
import React, {useState, useEffect, useRef, useContext} from 'react';
import { Avatar } from '@rneui/themed';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import themeContext from '../../theme/themeContext';

export default function userProfile(props) {
  const [userPhotos, setUserPhotos] = useState([]);
  const carouselRef = useRef(null);

  const selectedUser = props.user
  const theme = useContext(themeContext)

  const goForward = () => {
    carouselRef.current.snapToNext();
  };

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

    <View style={[modalStyles.modalContainer, {backgroundColor:theme.backgroundColor}]}>
      <View style={[modalStyles.modalContent, {backgroundColor:theme.backgroundColor}]}>
        <ScrollView style={[{width: '70%'}, {backgroundColor:theme.backgroundColor}]}>
          <Avatar
            size='xlarge'
            rounded
            source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + selectedUser.username + '.jpg'}}
            containerStyle={{backgroundColor: 'grey', margin: 10, alignSelf: 'center'}}
            activeOpacity={0.8}
          />

          <Text style={styles.subtitle}>Name: {selectedUser.information.firstName} {selectedUser.information.lastName}</Text>
          <Text style={styles.subtitle}>Gender: {selectedUser.information.gender}</Text>
          <Text style={styles.subtitle}>Grad Year: {selectedUser.information.graduation}</Text>
          <Text style={styles.subtitle}>Major: {selectedUser.information.major}</Text>


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

          <Text style={styles.title}>{'\n'}Information</Text>
          <Text style={styles.subtitle}>Year for Roommate: {selectedUser.information.yearForRoommate}</Text>
          <Text style={styles.subtitle}>Sleeping Habits: {selectedUser.information.sleepingHabits}</Text>
          <Text style={styles.subtitle}>Political Views: {selectedUser.information.politicalViews}</Text>
          <Text style={styles.subtitle}>Drinking Habits: {selectedUser.information.drinkingHabits}</Text>
          <Text style={styles.subtitle}>Pets: {selectedUser.information.pets}</Text>
          

          <Text style={styles.title}>{'\n'}Housing Information</Text>
          <Text style={styles.subtitle}>Housing: {selectedUser.housingInformation.housing}</Text>
          <Text style={styles.subtitle}>Confirmed Housing Situation: {selectedUser.housingInformation.confirmedHousingSituation}</Text>
          <Text style={styles.subtitle}>Number Of Roommates: {selectedUser.housingInformation.numRoommates}</Text>
          <Text style={styles.subtitle}>UnknownHousingSituation: {selectedUser.housingInformation.unknownHousingSituation}</Text>

          <Text style={styles.title}>{'\n'}Preferences</Text>
          <Text style={styles.subtitle}>Gender: {selectedUser.preferences.gender}</Text>
          <Text style={styles.subtitle}>Bedtime: {selectedUser.preferences.bedtime}</Text>
          <Text style={styles.subtitle}>Guests: {selectedUser.preferences.guests}</Text>
          <Text style={styles.subtitle}>Clean: {selectedUser.preferences.clean}</Text>
          <Text style={styles.subtitle}>Noise: {selectedUser.preferences.noise}</Text>

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
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10
    
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
