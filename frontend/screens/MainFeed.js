import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import Search from './Search';
import { StyleSheet, Text, View,TouchableOpacity,TextInput, Modal, Button, Image } from 'react-native';
import axios from "axios"


export default function MainFeed({navigation}){
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  
  // Function to handle the search button press not yet finished.. need to get info from database
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

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
        justifyContent: 'center', // Center content vertically
        alignItems: 'center',     // Center content horizontally
        backgroundColor: 'white', // Semi-transparent background
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        //borderRadius: 10, // Add rounded corners to the content
      },
      closeButtonContainer: {
        marginTop: 20,
      },
    };

    if (isModalVisible){
      return (
        <Modal
       animationType="slide" // How the modal will appear (e.g., slide, fade)
       transparent={false}     // Make the modal background transparent
       visible={isModalVisible}
     >
       <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          

          
          {searchResult && (
            <View>
          <Image
          //Once we get the data we can replace the hard coded image
           source={require('./testImage.png')}
           resizeMode="cover"
           style={{
            height: 155,
            width: 155,
            borderRadius: 999,
            marginTop: -90
           }}
           />
              {searchResult.map((user,index) => (
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
          )}
          <View style={modalStyles.closeButtonContainer}><Button title="Close" onPress={toggleModal} /></View>
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
          
        <Text>No one wants to room with you Sprocket</Text>
      <View style={styles.inputGroup}>
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
          {/* You can use your search icon here */}
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {renderModel()}
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
  inputGroup: {
    width: 250,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    center: 10,
  },
  input: {
    width: 10, // Adjust the width as needed to make it smaller
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
  });
  