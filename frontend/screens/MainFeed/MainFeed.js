import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View,TouchableOpacity,TextInput, Modal, Button, Image, Pressable, ScrollView, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios"
import { Avatar } from '@rneui/themed';
import { RefreshControl } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import UserProfile from './UserProfile'
import MatchPopUp from '../../screenComponents/MatchPopUp';


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
  //variables for match pop up
  const [matchPopUpUserShown,setMatchPopUpUserShown] = useState(null)
  
  useEffect(() => {
    handleRefreshFeed()
  },[showOnlyUsersLikedBy]);
  
  const handleLikePress = async(user) => {
    // Find the feed item with the specified key
    const tokenVal = await SecureStore.getItemAsync('token')
      const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/likeuser', {
        token: tokenVal,
        userShown: user.username,
      }
      ).catch(error => {
        console.log("Error occurred while searching:", error)
      })

      //Update returns what the data previously look like so if there was no interaction
      //we set to true and if there was an interaction we said liked to the reciprocal
      let liked = true
      
      if(response.data.user_added == null){
        liked = true
      }
      else{
        liked = !response.data.user_added.liked
      }
      if(liked == true){
      const res = await axios.post(`http://localhost:3000/api/user/isUserLiked`, {
        token: tokenVal,
        userShown: user.username,
      }
      ).catch(error => {
        console.log("error occurred w:", error)
      })
      console.log(res.data)
      if(res.data.liked == true){
       // console.log(res.data.userLiked)
        setMatchPopUpUserShown(user)
      }
    }

      setUsersLiked((usersLiked) => ({
        ...usersLiked,
        [user.username]: liked,
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
    setUsersLiked({})
    handleRefreshFeed();
    // ... Fetch data ...
    setRefreshing(false);
  };

  const FeedItem = ({ user, onLikePress }) => (
    <View style={styles.feedItem}>
      <Avatar
          size={250}
          rounded
          source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + user.username + '.jpg'}}
          containerStyle={{backgroundColor: 'grey', margin: 10, alignSelf: 'center'}}
          activeOpacity={0.8}
        />
      
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={feedStyles.iconContainer} onPress={() => handleLikePress(user)}>
          <Ionicons
            name={usersLiked[user.username] ? 'heart' : 'heart-outline'} // Use 'heart' for filled heart and 'heart-o' for outline heart
            color={usersLiked[user.username] ? 'red' : 'gray'}
            size={40}
          />
        </TouchableOpacity>

        <TouchableOpacity style={feedStyles.iconContainer} onPress={() => handleUserItemClick(user)}>
          <Ionicons
            name={'information-circle-outline'} // Use 'heart' for filled heart and 'heart-o' for outline heart
            color={'gray'}
            size={40}
          />
        </TouchableOpacity>
        
      </View>

      <View style={feedStyles.infoContainer}>
        <Text style={feedStyles.name}>{user.information.firstName} {user.information.lastName}</Text>
        <Text style={feedStyles.username}>@{user.username}</Text>
        
        <Text>
          <Text style={feedStyles.infoLabel}>Major: </Text>
          {user.information.major}
        </Text>
        <Text style={styles.subtitle}>
          <Text style={feedStyles.infoLabel}>Graduation Year:  </Text>
          {user.information.graduation}
        </Text>
        
      </View>
      
    </View>
  );

  
  // Function to handle the search button press not yet finished.. need to get info from database
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  
  const hideMatchPopUp = () =>{
    setMatchPopUpUserShown(null)
  }

  const toggleNewSearch = () => {
    setIsNewSearch(!isNewSearch);
  };
  

  const toggleUser = () => {
    setUserNotFound(!userNotFound);
  };

  const fetchUsers = async (text) => {
    
    // Make an API request to your database to search for users with similar names
    axios.get(process.env.EXPO_PUBLIC_API_HOSTNAME + `/api/user/search/${text}`).then((response) => {
      
      if (response.data.users.length > 0) {
        setSearchResults(response.data.users.map(user => user));
      }
      setIsDropdownVisible(response.data.users.length > 0)
    }).catch(error => {
      console.log("Error occurred while searching:", error)
    });
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
    toggleModal()
  };
      
  
  const handleLikedMeButtonPress = () => {
    setShowOnlyUsersLikedBy(!showOnlyUsersLikedBy)
   }


  const handleRefreshFeed = async() => {
      const tokenVal = await SecureStore.getItemAsync('token')
      if(!showOnlyUsersLikedBy){
        const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/refreshfeed', {
        token: tokenVal
      }
      ).catch(error => {
        console.log("Error occured while searching:", error)
      })
        setDisplayedUsers(response.data.users)
    }
    else{
      const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/userslikedby', {
        token: tokenVal
      }
      ).catch(error => {
        console.log("Error occurred while searching:", error)
      })
        setDisplayedUsers(response.data.users)
    }
    }

  const renderModal = () => {
    if (searchResult) {
      return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={isModalVisible}
        >
          <UserProfile user={selectedUser} closeModal={() => setIsModalVisible(false)}/>
        </Modal>
      );
    }  else if (userNotFound) {
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
            onPress={handleLikedMeButtonPress}>
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
            <UserProfile user={selectedUser} closeModal={handleCloseUserModal}/>
          </Modal>
        )}

    
       {renderModal()}
        
        <MatchPopUp matchedUser={matchPopUpUserShown} hideMatchPopUp={hideMatchPopUp}/>

        <View style={styles.flatListContainer}>
          {displayedUsers.length > 0 ? (
            <FlatList
              data={displayedUsers} // Replace with your data array
              renderItem={({ item }) => <FeedItem user={item} onLikePress={handleLikePress}/>}
              keyExtractor={(item) => item.username} // Replace with a unique key extractor
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
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
    alignContent: 'center',
    alignItems: 'center',
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
  

const feedStyles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: 10
  },
  infoContainer: {
    width: '100%',
    padding: 10,
    fontSize: 16,
    lineHeight: 40
  },
  name: {
    fontSize: 25
  },
  username: {
    fontSize: 16,
    color: 'grey',
    paddingBottom: 6
  },
  infoLabel: {
    fontWeight: '600',
  },  
  
})