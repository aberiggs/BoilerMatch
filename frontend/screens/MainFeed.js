import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View,TouchableOpacity,TextInput, Modal, Button, Image, Pressable, ScrollView, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import Autocomplete from 'react-native-autocomplete-input';
import axios from "axios"
import Icon from 'react-native-vector-icons/FontAwesome';
import { Avatar } from '@rneui/themed';
import { RefreshControl } from 'react-native';
import * as SecureStore from 'expo-secure-store';



export default function MainFeed({navigation}){
  const [usersLiked, setUsersLiked] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  //for dropdown
  const [searchResults, setSearchResults] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [liked, setLiked] = useState(false);
  const [showOnlyUsersLikedBy, setShowOnlyUsersLikedBy] = useState(false)
  //variables for onClick on the mainFeed
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isNewSearch, setIsNewSearch] = useState(false);
  const [newSearch, setNewSearch] = useState([]);
  

  
  useEffect(() => {
    handleRefreshFeed()
   
  },[showOnlyUsersLikedBy]);
  

  
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
      alignItems: 'center'
    },
    closeButtonContainer: {
      marginTop: 20,
    },
  };
  
  const handleLikePress = async(user) => {
    // Find the feed item with the specified key
    console.log(user)
    const tokenVal = await SecureStore.getItemAsync('token')
      const response = await axios.post(`http://localhost:3000/api/user/likeuser`, {
        token: tokenVal,
        userShown: user,
      }
      ).catch(error => {
        console.log("Error occured while searching:", error)
      })
      let liked = true
      if(response.data.user_added == null){
        liked = true
      }
      else{
        liked = !response.data.user_added.liked
      }
      setUsersLiked((usersLiked) => ({
        ...usersLiked,
        [user]: liked,
      })
      )
  };
  
  const handleUserItemClick = (user) => {
    setSelectedUser(user);
    setIsUserModalVisible(true);
  };
  const handleCloseUserModal = () => {
  setIsUserModalVisible(false);
};


const onRefresh = async() => {
  setRefreshing(true);
  //console.log("here")
  setUsersLiked({})
  handleRefreshFeed();
  // ... Fetch data ...

  setRefreshing(false);
};
  
const checkPfpExist = async(username) => {
  const pfpUrl = 'https://boilermatch.blob.core.windows.net/pfp/' + username + '.jpg'
  const response = await axios.get(pfpUrl).catch((error) => {
    return false
  })
  return true
}

  const FeedItem = ({ user, onLikePress }) => (
    <View style={styles.feedItem}>
      <Image
        source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + user.username + '.jpg'}} // Replace with the actual image source
        resizeMode="cover"
        style={{
          height: 320, // Adjust the height as needed
          width: "100%",  // Adjust the width as needed
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: "grey",
          borderRadius: 10,
          marginBottom: 10
        }}
        
      />
      <Text style={{justifyContent: 'center',}}>{user.username}</Text>
      <Text style={styles.subtitle}>Name: {user.information.firstName} {user.information.lastName}</Text>
      <Text style={styles.subtitle}>Gender: {user.information.gender}</Text>
      <Text style={styles.subtitle}>Grad Year: {user.information.graduation}</Text>
      <Text style={styles.subtitle}>Major: {user.information.major}</Text>
      {/* Add other user information as needed */}
      <TouchableOpacity onPress={() => handleLikePress(user.username)}>
      <Icon
        name={usersLiked[user.username] ? 'heart' : 'heart-o'} // Use 'heart' for filled heart and 'heart-o' for outline heart
        color={usersLiked[user.username] ? 'red' : 'gray'}
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
  
   const handleLikedMeButtonPress = () => {
      setShowOnlyUsersLikedBy(!showOnlyUsersLikedBy)
      onRefresh()


   }


    const handleRefreshFeed = async() => {
      const tokenVal = await SecureStore.getItemAsync('token')
      console.log(showOnlyUsersLikedBy)
      if(!showOnlyUsersLikedBy){
        const response = await axios.post(`http://localhost:3000/api/user/refreshfeed`, {
        token: tokenVal
      }
      ).catch(error => {
        console.log("Error occured while searching:", error)
      })
      console.log(response.data.users)
        console.log("updated")
        setDisplayedUsers(response.data.users)
    }
    else{
      const response = await axios.post(`http://localhost:3000/api/user/userslikedby`, {
        token: tokenVal
      }
      ).catch(error => {
        console.log("Error occured while searching:", error)
      })
      console.log(response.data.users)
        console.log("updated")
        setDisplayedUsers(response.data.users)
    }
    }
    const pressablefunc = () => {
      console.log("i was pressed")
    };

    // const getUserLiked = async() => {
    //   const tokenVal = await SecureStore.getItemAsync('token')
    //  const response = await axios.post(`http://localhost:3000/api/user/isUserLiked`, {
    //     token: tokenVal
    //   }
    //   ).catch(error => {
    //     console.log("Error occured while checking:", error)
    //   })
    //   console.log(response.data)
    // }
    

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
            {searchResult.map((user, index) => (
            <View key={index}>
              <Avatar
              size='xlarge'
              rounded
              source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + selectedUser.username + '.jpg'}}
              containerStyle={{backgroundColor: 'grey', margin: 10}}
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

            </View>
            ))}
            </View>
              </View>
            <View style={modalStyles.closeButtonContainer}>
              <Button title="Close" onPress={toggleModal} />
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
          onPress={handleLikedMeButtonPress}
        >
          <Text style={styles.searchButtonText}>{showOnlyUsersLikedBy ? 'All' : 'Liked Me'} </Text>
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
            <Avatar
              size='xlarge'
              rounded
              source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + selectedUser.username + '.jpg'}}
              containerStyle={{backgroundColor: 'grey', margin: 10}}
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

            <Text style={styles.title}>{'\n'}Preferences:</Text>
            <Text style={styles.subtitle}>Gender: {selectedUser.preferences.gender}</Text>
            <Text style={styles.subtitle}>Bedtime: {selectedUser.preferences.bedtime}</Text>
            <Text style={styles.subtitle}>Guests: {selectedUser.preferences.guests}</Text>
            <Text style={styles.subtitle}>Clean: {selectedUser.preferences.clean}</Text>
            <Text style={styles.subtitle}>Noise: {selectedUser.preferences.noise}</Text>

           </View>
            <View style={modalStyles.closeButtonContainer}>
              <Button title="Close" onPress={handleCloseUserModal} />
            </View>
          </View>
        </View>
      </Modal>
    )}
    
      
      {renderModel()}
      <View style={styles.flatListContainer}>
    {displayedUsers.length > 0 ? (
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
    
    ) : (
      <ScrollView

      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.noMatchesText}>
        You have no potential matches. Consider adjusting your preferences to gain a broader suggestion of users
      </Text>
    </ScrollView>
    )}
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
    marginRight: 30,   // Margin between items
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
    marginRight: 30,
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
  noMatchesText: {
    fontSize: 15,
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: "50%",
    marginHorizontal: "5%"
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
  

  });
  