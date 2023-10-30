import { StyleSheet, Text, View, Pressable, ScrollView, Image} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import { Avatar } from '@rneui/themed';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';


const carouselItems = [
  {
      title:"Item 1",
      text: "Text 1",
  },
  {
      title:"Item 2",
      text: "Text 2",
  },
  {
      title:"Item 3",
      text: "Text 3",
  },
  {
      title:"Item 4",
      text: "Text 4",
  },
  {
      title:"Item 5",
      text: "Text 5",
  },
]

export default function userProfile(props) {
  const [entries, setEntries] = useState([]);
  const carouselRef = useRef(null);

  const goForward = () => {
    carouselRef.current.snapToNext();
  };

  useEffect(() => {
    setEntries(ENTRIES1);
  }, []);
  
  const selectedUser = props.user

  const ENTRIES1 = [
    {
      title: 'Beautiful and dramatic Antelope Canyon',
      subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
      illustration: 'https://i.imgur.com/UYiroysl.jpg',
    },
    {
      title: 'Earlier this morning, NYC',
      subtitle: 'Lorem ipsum dolor sit amet',
      illustration: 'https://i.imgur.com/UPrs1EWl.jpg',
    },
    {
      title: 'White Pocket Sunset',
      subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
      illustration: 'https://i.imgur.com/MABUbpDl.jpg',
    },
    {
      title: 'Acrocorinth, Greece',
      subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
      illustration: 'https://i.imgur.com/KZsmUi2l.jpg',
    },
    {
      title: 'The lone tree, majestic landscape of New Zealand',
      subtitle: 'Lorem ipsum dolor sit amet',
      illustration: 'https://i.imgur.com/2nCt3Sbl.jpg',
    },
  ];

  _renderItem = ({item, index}, parallaxProps) => {
    return (

        <View style={sliderStyle.item}>
                <ParallaxImage
                    source={{ uri: item.illustration}}
                    containerStyle={sliderStyle.imageContainer}
                    style={sliderStyle.image}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
          </View>
    );
}

  return (
    <View style={modalStyles.modalContainer}>
      <View style={modalStyles.modalContent}>
        <ScrollView style={{width: '90%'}}>
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
              data={entries}
              sliderWidth={400}
              itemWidth={300}
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
      width: 300,
      height: 200,
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
