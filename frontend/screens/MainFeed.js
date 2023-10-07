import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity,TextInput, Modal, Button, Image, ScrollView, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import Autocomplete from 'react-native-autocomplete-input';
import axios from "axios"



export default function MainFeed({navigation}){
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [potentialUsers, setPotentialUsers] = useState([]);
  const [people, setPeople] = useState([
    { name: 'shaun', key: '1', email: "test@gmail.com", gender: "male", hobbies: "rocks" },
    { name: 'shaun', key: '1', email: "second@gmail.com", gender: "male", hobbies: "rocks" },
    { name: 'shaun', key: '1', email: "third@gmail.com", gender: "male", hobbies: "rocks" },
    { name: 'shaun', key: '1', email: "fourth@gmail.com", gender: "male", hobbies: "rocks" },
    { name: 'shaun', key: '1', email: "test@gmail.com", gender: "male", hobbies: "rocks" },
    { name: 'shaun', key: '1', email: "test@gmail.com", gender: "male", hobbies: "rocks" },
    { name: 'shaun', key: '1', email: "test@gmail.com", gender: "male", hobbies: "rocks" },
    { name: 'shaun', key: '1', email: "test@gmail.com", gender: "male", hobbies: "rocks" },
    { name: 'shaun', key: '1', email: "test@gmail.com", gender: "male", hobbies: "rocks" },
    { name: 'shaun', key: '1', email: "test@gmail.com", gender: "male", hobbies: "rocks" },
    { name: 'shaun', key: '1', email: "test@gmail.com", gender: "male", hobbies: "rocks" },
    { name: 'shaun', key: '1', email: "test@gmail.com", gender: "male", hobbies: "rocks" },
    { name: 'shaun', key: '1', email: "test@gmail.com", gender: "male", hobbies: "rocks" },
    { name: 'shaun', key: '1', email: "test@gmail.com", gender: "male", hobbies: "rocks" },

  ])

  const FeedItem = ({ user }) => (
    <View style={styles.feedItem}>
      <Image
        source={require('./testImage.png')} // Replace with the actual image source
        resizeMode="cover"
        style={styles.userImage}
      />
      <Text style={styles.itemName}>{user.username}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Gender: {user.gender}</Text>
      <Text>Year: {user.year}</Text>
      <Text>Hobbies: {user.hobbies}</Text>
      {/* Add other user information as needed */}
    </View>
  );

  
  // Function to handle the search button press not yet finished.. need to get info from database
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  /*
  useEffect(() => {
    // Fetch potential users from your database and set them as suggestions
    axios
      .get(`http://localhost:3000/api/users/potential/${searchTerm}`)
      .then((response) => {
        setPotentialUsers(response.data.users);
      })
      .catch((error) => {
        console.log('Error occurred while fetching potential users:', error);
      });
  }, [searchTerm]);
  */

  const handleSearchButtonPress = () => {
    console.log(searchTerm)
      axios.get(`http://localhost:3000/api/users/search/${searchTerm}`).then((response) => {
        console.log(response.data.users)
        console.log("updated")
        setSearchResult(response.data.users);
        toggleModal();
       return response.data.users;
      }).catch(error => {
        console.log("Error occured while searching:", error)
      })

    }

    /*
    plan to use once we get the data from the database.. then we use the userProfile class
    to display the information
    
   const handleUserSelect = (user) => {
    navigation.navigate('userProfile', { user });
   };
   */

  const renderModel = () => {
  const modalStyles = {
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      flex: 1,
      justifyContent: 'center',
    },
    closeButtonContainer: {
      marginTop: 20,
    },
  };
  
  if (isModalVisible && searchResult && searchResult.length > 0) {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
      >
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            <View>
              <Image
                source={require('./testImage.png')}
                resizeMode="cover"
                style={{
                  height: 155,
                  width: 155,
                  borderRadius: 999,
                  marginTop: -90,
                }}
              />
              {searchResult.map((user, index) => (
                <View key={index}>
                  <Text>Name: {user.username}</Text>
                  <Text>Email: {user.email}</Text>
                  <Text>Gender:</Text>
                  <Text>Year:</Text>
                  <Text>Hobbies:</Text>
                  <Text>etc:</Text>
                </View>
              ))}
            </View>
            <View style={modalStyles.closeButtonContainer}>
              <Button title="Close" onPress={toggleModal} />
            </View>
          </View>
        </View>
      </Modal>
    );
  } else {
    return null;
  }
};  
    return(
        <View style={styles.container}>
        <View style={styles.topBar}>
        <TextInput
          style={styles.input}
          placeholder="Search for a user"
          onChangeText={(text) => setSearchTerm(text)}
          value={searchTerm}
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchButtonPress}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>

        </View>
        
        {/* testing */}
        
      
      {renderModel()}
      <FlatList
  data={people} // Replace with your data array
  renderItem={({ item }) => <FeedItem user={item} />}
  keyExtractor={(item) => item.key} // Replace with a unique key extractor
  contentContainerStyle={{ flexGrow: 1 }}
/>
    </View>
  );
}
    


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedItem: {
    flex: 1, // Take up the entire available space
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    width: '100%', // Adjust the width as needed to make it smaller
    height: 40, // Adjust the height as needed
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: 'gold', // Change the background color as desired
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'gray', // Change the text color as desired
    fontSize: 13,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
  },

  });
  