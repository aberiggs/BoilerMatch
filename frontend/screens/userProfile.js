import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import React from 'react';
import { Avatar } from '@rneui/themed';

export default function userProfile(props) {
  
  const selectedUser = props.user

  return (
    <View style={modalStyles.modalContainer}>
      <View style={modalStyles.modalContent}>
        <ScrollView style={styles.scrollView}>
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
        {/* Add more user information as needed */}
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
  },
  modalContent: {
    flex: 'column', 
    width: '90%',
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
  
