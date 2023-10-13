import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity,TextInput, Modal, Button, Image, Pressable, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import Autocomplete from 'react-native-autocomplete-input';
import axios from "axios"
import Icon from 'react-native-vector-icons/FontAwesome';

import { RefreshControl } from 'react-native';
import * as SecureStore from 'expo-secure-store';



export default function MainFeed({navigation}){
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  //for dropdown
  const [searchResults, setSearchResults] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [liked, setLiked] = useState(false);
  //variables for onClick on the mainFeed
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isNewSearch, setIsNewSearch] = useState(false);
  const [newSearch, setNewSearch] = useState([]);
  

  
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
  //dummy data
  const [people, setPeople] = useState([
    { name: 'shaun', key: '1', email: "test@gmail.com", gender: "male", hobbies: "rocks",liked: false, isActive: true },
    { name: 'shaun', key: '2', email: "second@gmail.com", gender: "male", hobbies: "trees",liked: false,isActive: true },
    { name: 'shaun', key: '3', email: "third@gmail.com", gender: "female", hobbies: "grass",liked: false,isActive: true },
    { name: 'shaun', key: '4', email: "fourth@gmail.com", gender: "male", hobbies: "sky",liked: false,isActive: true },
    { name: 'shaun', key: '5', email: "fifth@gmail.com", gender: "male", hobbies: "water",liked: false,isActive: true },
    { name: 'shaun', key: '6', email: "six@gmail.com", gender: "female", hobbies: "sun",liked: false,isActive: true },
    { name: 'shaun', key: '7', email: "seven@gmail.com", gender: "male", hobbies: "dirt",liked: false,isActive: true },
    { name: 'shaun', key: '8', email: "8@gmail.com", gender: "male", hobbies: "slime",liked: false,isActive: true },
    { name: 'shaun', key: '9', email: "9@gmail.com", gender: "female", hobbies: "metal",liked: false,isActive: true },
    { name: 'shaun', key: '10', email: "10@gmail.com", gender: "male", hobbies: "cotton",liked: false,isActive: true },
    { name: 'shaun', key: '11', email: "11@gmail.com", gender: "female", hobbies: "lava",liked: false,isActive: true },
    { name: 'shaun', key: '12', email: "12@gmail.com", gender: "female", hobbies: "bird",liked: false,isActive: false },
    { name: 'shaun', key: '13', email: "13@gmail.com", gender: "female", hobbies: "ant",liked: false,isActive: true },
    { name: 'shaun', key: '14', email: "14@gmail.com", gender: "male", hobbies: "racoon",liked: false,isActive: true },

  ])
  const handleLikePress = (itemKey) => {
    // Find the feed item with the specified key
    const updatedPeople = people.map((person) => {
      if (person.key === itemKey) {
        // Toggle the liked state
        return { ...person, liked: !person.liked };
      }
      return person;
    });
  
    // Update the state with the modified feed items
    setPeople(updatedPeople);
  };

  const handleUserItemClick = (user) => {
    setSelectedUser(user);
    setIsUserModalVisible(true);
  };
  const handleCloseUserModal = () => {
  setIsUserModalVisible(false);
};


const onRefresh = async() => {
  // Perform the data fetching or refreshing logic here
  // For example, you can make an API request to fetch new data
  // Don't forget to set the refreshing state to false when the data is fetched
  setRefreshing(true);
  //console.log("here")
  handleRefreshFeed();
  // ... Fetch data ...

  setRefreshing(false);
};
  

  const FeedItem = ({ user, onLikePress }) => (
    <View style={styles.feedItem}>
      <Image
        source={require('./troy.jpeg')} // Replace with the actual image source
        resizeMode="cover"
        style={{
          height: 320, // Adjust the height as needed
          width: "100%",  // Adjust the width as needed
          alignSelf: 'center',
          justifyContent: 'center',
        }}
        
      />
      <Text style={{justifyContent: 'center',}}>{user.username}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Gender: {user.gender}</Text>
      <Text>Year: {user.year}</Text>
      <Text>Hobbies: {user.hobbies}</Text>
      {/* Add other user information as needed */}
      <TouchableOpacity onPress={() => onLikePress(user.key)}>
      <Icon
        name={user.liked ? 'heart' : 'heart-o'} // Use 'heart' for filled heart and 'heart-o' for outline heart
        color={user.liked ? 'red' : 'gray'}
        size={30}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleUserItemClick(user)}>
      <Text style={styles.hyperlink}>More Info</Text>
    </TouchableOpacity>
    </View>
  );

  
  // Function to handle the search button press not yet finished.. need to get info from database
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const toggleNewSearch = () => {
    setIsNewSearch(!isNewSearch);
  };
  

  const toggleUser = () => {
    setUserNotFound(!userNotFound);
  };
  const fetchUsers = async (text) => {
    
      // Make an API request to your database to search for users with similar names
      axios.get(`http://localhost:3000/api/user/search/${text}`).then((response) => {
        //if (response.data.users.length == 0) setIsDropdownVisible(false)
        
        if (response.data.users.length > 0) {
      // Update the search results state variable with the response data
        //console.log(response.data.users)
        setSearchResults(response.data.users.map(user => user));
        //console.log(searchResults)
        //console.log(response.data.users.map(user => user._id));
      }
      
      setIsDropdownVisible(response.data.users.length > 0)
      //console.log(isDropdownVisible);
    }).catch(error => {
      console.log("Error occured while searching:", error)
    });
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
   // console.log(searchTerm)
      axios.get(`http://localhost:3000/api/user/search/${searchTerm}`).then((response) => {
        if (response.data.users.length > 0) {
          console.log(response.data.users)
          setSearchResult(response.data.users);
          console.log(searchResult.length)
          toggleModal();
          setUserNotFound(false);
        }
       //return response.data.users;
      }).catch(error => {
        console.log("Error occured while searching:", error)
        setSearchResult([])
        setUserNotFound(true);
      });
      console.log(searchResult)
    };
    useEffect(() => {
      if (selectedUser) {
        setSearchResult([selectedUser]);
      } else {
        setSearchResult([]);
      }
    }, [selectedUser]);
    
    const handleSearchListButtonPress = (value,index) => {
           setSelectedUser(value);
           //console.log(searchResult)
           //console.log(searchResult.length)
           //console.log("here")
           toggleModal()
           //console.log(isModalVisible)
           //setUserNotFound(false);
          
         //return response.data.users;
       // console.log(searchResult)
      };
      
    
        // const likeUser = async () => {
    //   const tokenVal = await SecureStore.getItemAsync('token')

    //   if (!tokenVal) {
    //       return
    //   }

    //   const response = await axios.post('http://localhost:3000/api/user/verifylanding', {
    //     token: tokenVal,
    //   }).catch((error) => {
    //     if (error.response) {
    //       return error.response.data
    //     }

    //     return
    //   })

    // }

    const handleRefreshFeed = async() => {
      const tokenVal = await SecureStore.getItemAsync('token')
      console.log(tokenVal)
      const response = await axios.post(`http://localhost:3000/api/user/refreshfeed`, {
        token: tokenVal
      }
      ).catch(error => {
        console.log("Error occured while searching:", error)
      })
      console.log(response.data.users)
        console.log("updated")
        setDisplayedUsers(response.data.users)
      return response.data.users;
    }
    const pressablefunc = () => {
      console.log("i was pressed")
    };

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

  
  

    
  
  if (isModalVisible && searchResult) {
   
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
                  height: 270,
                  width: 270,
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
  }  else if (userNotFound) {
    console.log("here")
    console.log(isModalVisible)
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={userNotFound}
      >
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            <Text>User not found</Text>
            <View style={modalStyles.closeButtonContainer}>
              <Button title="Close" onPress={toggleUser} />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
   else {
    return null;
  }
};  
    return(
      
        <View style={styles.container}>
        <View style={styles.topBar}>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleSearchButtonPress}
        >
          <Text style={styles.searchButtonText}>Filter</Text>
        </TouchableOpacity>
        <View style ={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for a user"
        
          //onChangeText={(text) => setSearchTerm(text)}
         onChangeText={(text) => {
          setSearchTerm(text); // Update the search term state
          fetchUsers(text);
          setIsDropdownVisible(!!text); // Fetch data from the database based on the search term
        }}
          //value={searchTerm}
          autoCapitalize="none"
         />
        
        {isDropdownVisible && (
    <View style={styles.dropdownContainer}>
    <FlatList
    data={searchResults}
    keyExtractor={(item) => item._id}
    renderItem={({item,index }) => (
      <TouchableOpacity
        //value={searchTerm}
        onPress={() => handleSearchListButtonPress(item,index)}
        //activeOpacity={0.7} // You can adjust this value
        underlayColor="gray">
          <View style={styles.dropdownItemContainer}>
          <Text style={styles.dropdownItem}>{item.username}</Text>
          </View>
      </TouchableOpacity>
      
    )}
    
    //style={styles.dropdownList} // Apply a fixed height
   
  />
  </View>
  )}
  </View>
  
  

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchButtonPress}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
        </View>

        
        {selectedUser && (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isUserModalVisible}
      >
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            <View>
          <Image
                source={require('./testImage.png')}
                resizeMode="cover"
                style={{
                  height: 270,
                  width: 270,
                  borderRadius: 999,
                  marginTop: -90,
                }}
              />
            <Text>Name: {selectedUser.username}</Text>
            <Text>Email: {selectedUser.email}</Text>
            <Text>Gender: {selectedUser.gender}</Text>
            <Text>Year: {selectedUser.year}</Text>
            <Text>Hobbies: {selectedUser.hobbies}</Text>
            {/* Add more user information as needed */}
            <Text>This is where we would add more information</Text>
            </View>
            <View style={modalStyles.closeButtonContainer}>
              <Button title="Close" onPress={handleCloseUserModal} />
            </View>
          </View>
        </View>
      </Modal>
    )}
    
      
      
      <View style={styles.flatListContainer}>
    <FlatList
      data={displayedUsers} // Replace with your data array
      renderItem={({ item }) => <FeedItem user={item} onLikePress={handleLikePress}/>}
      keyExtractor={(item) => item.key} // Replace with a unique key extractor
      horizontal={false}
      contentContainerStyle={styles.flatListContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
    {renderModel()}
  </View>
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
  searchContainer: {
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowRadius: 2,
  },
  dropdownItem: {
    padding: 10,
  },
  feedItem: {
   // Take up the entire available space
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownList: {
    maxHeight: 200, // Set the maximum height for the dropdown
  },
  dropdownItemContainer: {
    borderColor: 'gray', // Border color
    borderWidth: .5,      // Border width
    borderRadius: .5,     // Border radius
     // Padding around the text
    marginRight: 10,   // Margin between items
  },
  dropdownContainer: {
    backgroundColor: 'white',
    width: '100%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowRadius: 2,
    top: 46,
    position: 'absolute',
    zIndex: 90,
    },
  inputContainer: {
    flex : 1,
    position: 'relative',
    minHeight: 0,
  }
  ,
  input: { // Adjust the width as needed to make it smaller
    height: 40, // Adjust the height as needed
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  hyperlink: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
  searchButton: {
    backgroundColor: 'gold', // Change the background color as desired
    padding: 10,
    borderRadius: 5,
  },
  filterButton: {
    margin: 5,
    backgroundColor: 'blue', // Change the background color as desired
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
    padding: 20,
    zIndex: 1,
  },
  flatListContainer: {
    flex: 1, // Take up the remaining available space
    width: '100%', // Take up the entire width
    paddingHorizontal: 10, // Add padding to the sides
    zIndex: 0,
  },
  flatListContent: {
    flexGrow: 1, // Ensure the content can grow within the container
  },
  

  });
  