import { StatusBar } from 'expo-status-bar';

import {StyleSheet, Text, View,TouchableOpacity,TextInput, Modal, Button, Image, Platform, ScrollView, FlatList } from 'react-native';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Ionicons,FontAwesome} from '@expo/vector-icons';

import axios from "axios"
import { Avatar } from '@rneui/themed';
import { RefreshControl } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { AppState } from 'react-native';
import { useNotification } from '../../NotificationContext';

//import { NotificationSettings } from "../Profile/ManageNotifications"



import UserProfile from './UserProfile'
import MatchPopUp from '../../screenComponents/MatchPopUp';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    if (AppState === 'background') {
      // Display the alert when the app is in the background
      return {
        shouldShowAlert: true,
        shouldPlaySound: false, // You can control other notification behaviors here
        shouldSetBadge: false,
      };
    } else {
      // App is in the foreground, don't display the alert
      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      };
    }
  },
});




export default function MainFeed({navigation,handleMatchMade}){
  const [usersLiked, setUsersLiked] = useState({});
  const [usersDisliked, setUsersDisliked] = useState({});
  const [usersBookmarked, setUsersBookmarked]= useState({});
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

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [username,setUsername] = useState("");
  const [appState, setAppState] = useState(AppState.currentState);
  const { notificationsEnabled, setNotificationsEnabled } = useNotification();
  const [hasNoti,setHasNoti] = useState(false);

  //variables for match pop up
  const [matchPopUpUserShown,setMatchPopUpUserShown] = useState(null)
  
  useEffect(() => {
    handleRefreshFeed()
  },[showOnlyUsersLikedBy]);

  useEffect(() => {
    // Define a separate async function to fetch the username
    const fetchUsername = async () => {
      try {
        const userVal = await SecureStore.getItemAsync('username');
        setUsername(userVal);
        console.log("username in init", userVal); // Log the username here if needed
      } catch (error) {
        console.error("Error fetching username", error);
      }
    };
  
    // Call the function to fetch the username
    fetchUsername();
  
    // Add a dependency on username to trigger the Axios call when username changes
  }, [username]);
  

    //  console.log("notiSettings: ", notificationsEnabled)

  //NotificationSettings()

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      if (notificationsEnabled) {
        setNotification(notification);
      }
    });
  
    // Other notification handling code
  }, [notificationsEnabled]);

  //console.log("notification Listener", notificationsEnabled);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      setAppState(nextAppState);
    };
  
    const subscription = AppState.addEventListener('change', handleAppStateChange);
  
    return () => {
      subscription.remove();
    };
  }, []);

  

  useEffect(() => {
  const fetchData = async () => {

    const updateNotificationsThroughApi = async (pushToken, notiResponse) => {
      console.log("inside", pushToken);
      console.log(notiResponse)
      const tokenVal = await SecureStore.getItemAsync('token');
      const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/notifications', {
        token: tokenVal,
        pushToken: pushToken,
        recieveNotifications: notiResponse,
      }).catch((error) => {
        if (error.response) {
          return error.response.data;
        }
        return;
      });

      return response;
    };

    // Step 1: Get the push token
    const pushToken = await registerForPushNotificationsAsync();
    setExpoPushToken(pushToken);

    // Step 2: Get the 'hasNoti' value
    const tokenVal = await SecureStore.getItemAsync('token');
    const response = await axios.get(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getNoti', {
      params: {
        token: tokenVal,
      }
    }).catch((error) => {
      if (error.response) {
        return error.response.data;
      }
    });

    if (response && response.data && response.data.notificationsEnabled !== undefined) {
      //setHasNoti(response.data.notificationsEnabled);
       var notiResponse = response.data.notificationsEnabled;
       console.log("when set", notiResponse)

      // Step 3: Update notifications through the API
      const updateResponse = await updateNotificationsThroughApi(pushToken, notiResponse);
      console.log(updateResponse);
    }
  };

  fetchData();
},[]);

  
  


  
  useEffect( () => {
    console.log("usename", username)
    //registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(async response => {
       await axios.get(process.env.EXPO_PUBLIC_API_HOSTNAME + `/api/user/search/${username}`).then((response) => {
       //console.log(response.data.users[0]);
        setSelectedUser(response.data.users[0]);
        toggleModal();
        //setIsDropdownVisible(true);
      }).catch((error) => {
          console.log(error.response.data)
      })
      console.log(response);
    });
    
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [username]);
  /*
  useEffect(() => {
  const updateNotificationsThroughApi = async() => {
    console.log("inside", expoPushToken);
    const tokenVal = await SecureStore.getItemAsync('token')
    const response  = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/notifications', {
      token: tokenVal,
      pushToken: expoPushToken,
      recieveNotifications: true,
    }).catch((error) => {
      if (error.response) {
        return error.response.data
      }
      return
    })

    return response
  };
  updateNotificationsThroughApi();
},[]);
*/
/*
  const fetchUsername = async () => {
    const userVal = await SecureStore.getItemAsync('username')
    //setUsername(userVal);
    return userVal;
  }
  */
  
  
  const handleLikePress = async(user) => {
    // Find the feed item with the specified key
    //console.log(user)
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
        liked = !(response.data.user_added.liked_or_disliked == "liked")
      }
      if(liked == true){

      const isUserLiked  = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + `/api/user/isUserLiked`, {
        token: tokenVal,
        userShown: user.username,
      }
      ).catch(error => {
        console.log("error occurred while liking user:", error)
      })
   
      if(isUserLiked.data.liked == true){
       // console.log(res.data.userLiked)
       const answer = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + `/api/messages/createConversation`, {
        token: tokenVal,
        toUser: user
      }
      
      ).catch(error => {
        console.log("Error creating conversation: ", error)
      })
        setMatchPopUpUserShown(user)
        
      }
    }

      setUsersLiked((usersLiked) => ({
        ...usersLiked,
        [user.username]: liked,
      })
      )
      if (liked && notificationsEnabled) {
        schedulePushNotification(username)
      }
      /*
      const ans = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getNotiToken', {
        name: user,
      }).catch((error) => {
        if (error.response) {
          console.log("error")
        }
        token = ans.data;
        console.log(token);
      });
      */
      
      //commented out but this is how you send notifications to others
      //await sendLikeNotification(token, username);

      
      if(liked && usersDisliked[user.username]){
        setUsersDisliked((usersDisliked) => ({
          ...usersDisliked,
          [user.username]: false,
        })
        )
      }
    
  handleMatchMade()
  };

  const handleDislikePress = async(user) => {
    // Find the feed item with the specified key
    const tokenVal = await SecureStore.getItemAsync('token')
      const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/dislikeuser', {
        token: tokenVal,
        userShown: user.username,
      }
      ).catch(error => {
        console.log("Error occurred while disliked users:", error)
      })

      //Update returns what the data previously look like so if there was no interaction
      //we set to true and if there was an interaction we said liked to the reciprocal
      let disliked = true
      
      if(response.data.user_added == null){
        disliked = true
      }
      else{
        disliked = !(response.data.user_added.liked_or_disliked == "disliked")
      }

      setUsersDisliked((usersDisliked) => ({
        ...usersDisliked,
        [user.username]: disliked,
      })
      )
      
      if(disliked && usersLiked[user.username]){
        setUsersLiked((usersLiked) => ({
          ...usersLiked,
          [user.username]: false,
        })
        )
      }
    handleMatchMade()
  };

  const handleBookmarkPressed = async(user) => {
      const tokenVal = await SecureStore.getItemAsync('token')
      const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/bookmarkuser', {
        token: tokenVal,
        userShown: user.username,
      }
      ).catch(error => {
        console.log("Error occurred while bookmarking users:", error)
      })
      let bookmarked = true
      console.log(response)
      if(response.data.user_added == null){
        bookmarked = true
      }
      else{
        bookmarked = !(response.data.user_added.bookmarked)
      }

      setUsersBookmarked((usersBookmarked) => ({
        ...usersBookmarked,
        [user.username]: bookmarked,
      })
      )

  }
  
  const handleUserItemClick = (user) => {
    setSelectedUser(user);
    setIsUserModalVisible(true);
  };
  
  const handleCloseUserModal = () => {
    setIsUserModalVisible(false);
  };

  const onRefresh = async() => {
    setRefreshing(true);
    handleRefreshFeed();
    // ... Fetch data ...
    setRefreshing(false);
  };

  const FeedItem = ({ user }) => (
    <View style={styles.feedItem}>
      <Avatar
          size={250}
          rounded
          source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + user.username + '.jpg'}}
          containerStyle={{backgroundColor: 'grey', margin: 10, alignSelf: 'center'}}
          activeOpacity={0.8}
        />
      
      <View style={styles.iconRow}>
        <TouchableOpacity style={feedStyles.iconContainer} onPress={() => handleLikePress(user)}>
          <Ionicons
            name={usersLiked[user.username] ? 'heart' : 'heart-outline'} // Use 'heart' for filled heart and 'heart-o' for outline heart
            color={usersLiked[user.username] ? 'red' : 'gray'}
            size={40}
          />
        </TouchableOpacity>

        
        <View style={{flexDirection:"row"}}>
        <TouchableOpacity style={feedStyles.iconContainer} onPress={() => handleUserItemClick(user)}>
          <Ionicons
            name={'information-circle-outline'} // Use 'heart' for filled heart and 'heart-o' for outline heart
            color={'gray'}
            size={40}
          />
        </TouchableOpacity>
        <TouchableOpacity style={feedStyles.iconContainer} onPress={() => handleBookmarkPressed(user)}>
          <Ionicons
            name={usersBookmarked[user.username] ? 'bookmark' : 'bookmark-outline'} // Use 'heart' for filled heart and 'heart-o' for outline heart
            color={usersBookmarked[user.username] ? 'gold' : 'gray'}
            size={40}
          />
        </TouchableOpacity>
        </View>

        <TouchableOpacity style={feedStyles.iconContainer} onPress={() => handleDislikePress(user)}>
          <Ionicons
            name={usersDisliked[user.username] ? 'heart-dislike' : 'heart-dislike-outline'} // Use 'heart' for filled heart and 'heart-o' for outline heart
            color={usersDisliked[user.username] ? 'red' : 'gray'}
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
        setIsDropdownVisible(response.data.users.length > 0)
      }
      
    }).catch(error => {
      setIsDropdownVisible(false);
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
      let response = null
      if(!showOnlyUsersLikedBy){
        response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getMainFeedUsers', {
        token: tokenVal
      }
      ).catch(error => {
        console.log("Error occured while getting main feed users:", error)
      })
        setDisplayedUsers(response.data.users)
    }
    else{
      response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getUsersLikedBy', {
        token: tokenVal
      }
      ).catch(error => {
        console.log("Error occurred while getting liked users:", error)
      })
        setDisplayedUsers(response.data.users)
    }
    setUsersLiked({})
    setUsersDisliked({})
    setUsersBookmarked(response.data.users.map(user=>user.interaction.bookmarked != null?user.interaction.bookmarked:false))
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
        <View style ={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search for a user"
            
              //onChangeText={(text) => setSearchTerm(text)}
            onChangeText={(text) => {
              setSearchTerm(text); // Update the search term state
              fetchUsers(text);
              setIsDropdownVisible(!!text);
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
          <TouchableOpacity
            style={[styles.filterButton, showOnlyUsersLikedBy?{backgroundColor:"gold"}:{backgroundColor: "#d9d9d9"}]}
            onPress={handleLikedMeButtonPress}>
            <Text style={styles.searchButtonText}>Liked Me </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, showOnlyUsersLikedBy?{backgroundColor:"gold"}:{backgroundColor: "#d9d9d9"}]}
            onPress={handleLikedMeButtonPress}>
             <Ionicons
            name={showOnlyUsersLikedBy ? 'bookmark' : 'bookmark-outline'} // Use 'heart' for filled heart and 'heart-o' for outline heart
            color={"gray"}
            size={15}
          />
          </TouchableOpacity>
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
    async function schedulePushNotification(user) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Someone liked you",
          body: user + ' likes you',
        },
        trigger: { seconds: 2 },
        to: user.notificationToken,
      });
    }
    async function sendLikeNotification(recipientNotificationToken, senderUsername) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "You have a new like!",
          body: `${senderUsername} liked you.`,
          data: { type: 'like' },
        },
        trigger: null, // Send the notification immediately
        to: recipientNotificationToken,
      });
    }

      async function registerForPushNotificationsAsync() {
        let token;
      
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
        //await updateNotificationsThroughApi();
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          // Learn more about projectId:
          // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
          token = (await Notifications.getExpoPushTokenAsync("181661f8-d406-4a71-a48f-08829cc0ec4a")).data;
          //await updateNotificationsThroughApi();
          console.log("token", token);
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        return token;
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
  input: { 
    height: 40, 
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginRight: 0,
  },
  hyperlink: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
  searchButton: {
    backgroundColor: 'gold', 
    padding: 10,
    borderRadius: 5,
  },
  filterButton: {
   
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'gray', 
    fontSize: 13,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 20,
    zIndex: 1,
    gap: 10
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
  iconRow: {
    flexDirection: 'row',
    justifyContent: "space-between"
  }
  });
  

const feedStyles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: 5
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