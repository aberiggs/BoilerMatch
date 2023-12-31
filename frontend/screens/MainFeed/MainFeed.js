import { StatusBar } from 'expo-status-bar';

import {StyleSheet, Text, View,TouchableOpacity,TextInput, Modal, Button, Image, Platform, ScrollView, FlatList,ActivityIndicator } from 'react-native';
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
import themeContext from '../../theme/themeContext';
import { useNavigation } from '@react-navigation/native';
import Collapsible from 'react-native-collapsible';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();
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




export default function MainFeed({navigation,reloadChat}){
  const [usersLiked, setUsersLiked] = useState({});
  const [usersDisliked, setUsersDisliked] = useState({});
  const [usersBookmarked, setUsersBookmarked]= useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  //for dropdown
  const [searchResults, setSearchResults] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  //variables for onClick on the mainFeed
  const [currentFeed, setCurrentFeed] = useState("All")
 // const [buttonNotShown, setButtonNotShown] = useState()
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isNewSearch, setIsNewSearch] = useState(false);
  const [newSearch, setNewSearch] = useState([]);
  const [filtering, setFiltering] = useState(false)
  const [selectingMajor,setSelectingMajor] = useState(false)
  const [selectingGradYear, setSelectingGradYear] = useState(false)
  const [majorFilter, setMajorFilter] = useState("")
  const [currMajorInput, setCurrMajorInput] = useState("")
  const [gradYearFilter, setGradYearFilter] = useState(null)
  const [loading, setLoading]  = useState(false)
  const [noMoreUsers, setNoMoreUsers] = useState(false)
  const [currentUser, setCurrentUser] = useState(false);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [username,setUsername] = useState("");
  const [appState, setAppState] = useState(AppState.currentState);
  const { notificationsEnabled, setNotificationsEnabled } = useNotification();
  const [hasNoti,setHasNoti] = useState(false);
  const theme = useContext(themeContext);

  //variables for match pop up
  const [matchPopUpUserShown,setMatchPopUpUserShown] = useState(null)
  
  const scrollViewRef = useRef(null);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToOffset({ offset: 0 });
    }
  };

  useEffect(() => {
    handleRefreshFeed(false)
  },[currentFeed,gradYearFilter,majorFilter]);

  const setTokenInSecureStore = async (token) => {
    await SecureStore.setItemAsync('token', token);
  };

  


  useEffect(() => {
    // Define a separate async function to fetch the username
    const fetchUsername = async () => {
      try {
        const userVal = await SecureStore.getItemAsync('username');
        setUsername(userVal);
        setCurrentUser(userVal)
        //console.log("username in init", userVal); // Log the username here if needed
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
  console.log("notificationsEnabled: ", notificationsEnabled);
  /*
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
    });
    
  
    // Other notification handling code
  }, [notificationsEnabled]);
  */

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

// Assuming the following function is part of a React component and is used within a useEffect hook
useEffect(() => {
  const fetchReadReceiptsData = async () => {
    const updateReadReceiptsThroughApi = async (readReceiptsEnabled) => {
      const tokenVal = await SecureStore.getItemAsync('token');
      const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/readReceipts', {
        token: tokenVal,
        readReceiptsEnabled: readReceiptsEnabled,
      }).catch((error) => {
        if (error.response) {
          return error.response.data;
        }
        return;
      });

      return response;
    };

    const tokenVal = await SecureStore.getItemAsync('token');
    const response = await axios.get(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getReadReceiptsSettings', {
      params: {
        token: tokenVal,
      }
    }).catch((error) => {
      if (error.response) {
        return error.response.data;
      }
    });

    if (response && response.data) {
      var readReceiptsResponse = response.data.readReceiptsEnabled;
    }

    const updateResponse = await updateReadReceiptsThroughApi(readReceiptsResponse);
    console.log(updateResponse);
  };

  // Call the fetchData function when the component mounts
  fetchReadReceiptsData();
}, []);

  

  useEffect(() => {
  const fetchData = async () => {
    const updateNotificationsThroughApi = async (pushToken, notiResponse) => {
      console.log("inside", pushToken);
      //.log(notiResponse)
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
    console.log(pushToken)
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
    console.log("response.data.notifications", response.data.notificationsEnabled)
    if (response && response.data) {
      //setHasNoti(response.data.notificationsEnabled);
       var notiResponse = response.data.notificationsEnabled;
      // console.log("when set", notiResponse)

      // Step 3: Update notifications through the API
      const updateResponse = await updateNotificationsThroughApi(pushToken, notiResponse);
      console.log(updateResponse);
    }
  };

  fetchData();
},[expoPushToken]);

  
  


  
  useEffect( () => {
    //console.log("usename", username)
    //registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
    notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
      if (false){
      setNotification(notification);
      }
    });
    
    //console.log("abakk")
    responseListener.current = Notifications.addNotificationResponseReceivedListener(async response => {
      console.log("response", response);
      console.log("response.requestn: ", response.notification.request.content.data.type);
      var ans = response.notification.request.content.data.type;
      var user = response.notification.request.content.data.otherUser;
      console.log("user request data", user);
      //navigation.navigate("ChatList");
      if (ans === "like") {
       await axios.get(process.env.EXPO_PUBLIC_API_HOSTNAME + `/api/user/search/${user}`).then((response) => {
       //console.log(response.data.users[0]);
        setSelectedUser(response.data.users[0]);
        toggleModal();
        //setIsDropdownVisible(true);
      }).catch((error) => {
          console.log(error.response.data)
      })
      // navigate the notification
    } else if (ans === "update") {
      navigation.navigate("Settings");
    }
    else {
      navigation.navigate("Messages");
    }
    
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
      //we set to true and if there was an interaction we set liked to the reciprocal
      let liked = true
      
      if(response.data.user_added == null){
        liked = true
      }
      else{
        liked = !(response.data.user_added.liked_or_disliked == "liked")
      }
      const isUserLiked  = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + `/api/user/isUserLiked`, {
        token: tokenVal,
        userShown: user.username,
      }
      ).catch(error => {
        console.log("error occurred while liking user:", error)
      })
      if(liked == true){
      if(isUserLiked.data.liked == true){
        console.log("tokenval", tokenVal);
       // console.log(res.data.userLiked)
       const answer = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + `/api/messages/createConversation`, {
        token: tokenVal,
        toUser: user
      }
      
      ).catch(error => {
        console.log("Error creating conversation: ", error)
      })
       reloadChat()
        setMatchPopUpUserShown(user)
        console.log("before usernotimatch")
        if(user.recieveNotifications) {
          console.log("usernotificationTOken", user.username)
        sendMatchNotification(user.notificationToken,username)
        }
        
      }
    }
    else{
      setMatchPopUpUserShown(null)
      reloadChat()
      if(isUserLiked.data.liked == true){
        await axios.delete(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/messages/deleteBlockedMessages', {
          params: {
            token: tokenVal,
            userBlocked: user.username,
          }
        }).catch(error => {
          console.log("Error occurred while blocking users - deleting messages:", error);
        });
        
      }
    }

      setUsersLiked((usersLiked) => ({
        ...usersLiked,
        [user.username]: liked,
      })
      )
      if(liked && usersDisliked[user.username]){
        setUsersDisliked((usersDisliked) => ({
          ...usersDisliked,
          [user.username]: false,
        })
        )
      }
      
      console.log("user", user.username);
      console.log("user noties", user.recieveNotifications)
      const ans = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getNotiToken', {
        name: user.username,
      }).catch((error) => {
        if (error.response) {
          console.log("error")
        }
      });
      
      //tokenVal = await SecureStore.getItemAsync('token')
      if (ans && ans.data && ans.data.notificationToken) {
        const token = ans.data.notificationToken;
        console.log("other user", token);
       
        if (user.recieveNotifications && liked && !isUserLiked.data.liked) {
        sendLikeNotification(token, username);
        }
      }
      //await schedulePushNotification(username)
      //commented out but this is how you send notifications to others
     // console.log("likenotifcation", token);
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
      if(disliked){
        setMatchPopUpUserShown(null)
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
       
        const isUserLiked  = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + `/api/user/isUserLiked`, {
          token: tokenVal,
          userShown: user.username,
        }
        ).catch(error => {
          console.log("error occurred while liking user:", error)
        })
          if(isUserLiked.data.liked == true){
            await axios.delete(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/messages/deleteBlockedMessages', {
              params: {
                token: tokenVal,
                userBlocked: user.username,
              }
            }).catch(error => {
              console.log("Error occurred while blocking users - deleting messages:", error);
            });
            reloadChat()
      }
      
      }
      
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
      if(response.data.user_added == null){
        bookmarked = true
      }
      else{
        bookmarked = !(response.data.user_added.bookmarked)
      }
      console.log(usersBookmarked)
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
    handleRefreshFeed(false);
    setRefreshing(false);
  };

  
  const FeedItem = ({ user }) => (
    <View style={[styles.feedItem, {backgroundColor:theme.background}]}>
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
            name={usersLiked[user.username] ? 'heart' : 'heart-outline'} 
            color={usersLiked[user.username] ? 'red' : 'gray'}
            size={40}
          />
        </TouchableOpacity>

        
        <View style={{flexDirection:"row"}}>
        <TouchableOpacity style={feedStyles.iconContainer} onPress={() => handleUserItemClick(user)}>
          <Ionicons
            name={'information-circle-outline'} 
            color={'gray'}
            size={40}
          />
        </TouchableOpacity>
        <TouchableOpacity style={feedStyles.iconContainer} onPress={() => handleBookmarkPressed(user)}>
          <Ionicons
            name={usersBookmarked[user.username] ? 'bookmark' : 'bookmark-outline'} 
            color={usersBookmarked[user.username] ? 'gold' : 'gray'}
            size={40}
          />
        </TouchableOpacity>
        </View>

        <TouchableOpacity style={feedStyles.iconContainer} onPress={() => handleDislikePress(user)}>
          <Ionicons
            name={usersDisliked[user.username] ? 'heart-dislike' : 'heart-dislike-outline'} 
            color={usersDisliked[user.username] ? 'red' : 'gray'}
            size={40}
          />
        </TouchableOpacity>
      </View>

      <View style={[feedStyles.infoContainer, {backgroundColor:theme.backgroundColor}]}>
        <Text style={[feedStyles.name, {color:theme.color}]}>{user.information.firstName} {user.information.lastName}</Text>
        <Text style={feedStyles.username}>@{user.username}</Text>
        
        <Text style={[styles.subtitle, {color:theme.color}]}>
          <Text style={[feedStyles.infoLabel, {color:theme.color}]}>Major: </Text>
          {user.information.major}
        </Text>
        <Text style={[styles.subtitle, {color:theme.color}]}>
          <Text style={[feedStyles.infoLabel, {color:theme.color}]}>Graduation Date:  </Text>
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
    const tokenVal = await SecureStore.getItemAsync('token')
    
    // Make an API request to your database to search for users with similar names
    axios.get(process.env.EXPO_PUBLIC_API_HOSTNAME + `/api/user/search/${text}`,
    {
      headers: {
        authorization: tokenVal
      }
    }).then((response) => {
      
      if (response.data.users.length > 0) {
        setSearchResults(response.data.users.map(user => user));
        setIsDropdownVisible(response.data.users.length > 0)
      }
      
    }).catch(error => {
      setIsDropdownVisible(false);
    });
  };

  
  const handleSearchListButtonPress = (value,index) => {
    setSelectedUser(value);
    setIsUserModalVisible(true)
   
  };
      
  
  const handleLikedByFeedPress = () => {
    
    setCurrentFeed(currentFeed=="LikedBy"?"All":"LikedBy")
    scrollToTop()
   }
   const handleBookmarkFeedPress = () => {
    
    setCurrentFeed(currentFeed=="Bookmarked"?"All":"Bookmarked")
    scrollToTop()
   }



  const handleRefreshFeed = async(scrolledDown) => {
      if(loading){
        return
      }
        let prevDisplayedUsers = []
        let prevLikedUsers = {}
        let prevDislikedUsers = {}
        let prevBookmarkedUsers = {}
      if(scrolledDown){
         prevDisplayedUsers = [...displayedUsers]
         prevLikedUsers = {...usersLiked}
         prevDislikedUsers = {...usersDisliked}
         prevBookmarkedUsers = {...usersBookmarked}
        setLoading(true)
      }
      excludedUsers = prevDisplayedUsers.map(user=>user.username)
      const tokenVal = await SecureStore.getItemAsync('token')
      let response = null

      response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/undislikeUsersOnExpiration', {
        token: tokenVal
      }
      ).catch(error => {
        console.log("Error occured while undisliking users:", error)
      })
      if(currentFeed=="All"){
        response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getMainFeedUsers', {
        token: tokenVal,
        gradYearFilter: gradYearFilter!=null?gradYearFilter.value: null,
        majorFilter: majorFilter,
        excludedUsers: excludedUsers
      }
      ).catch(error => {
        console.log("Error occured while getting main feed users:", error)
      })
    }
    else if(currentFeed=="LikedBy"){
      response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getUsersLikedBy', {
        token: tokenVal,
        gradYearFilter: gradYearFilter!=null?gradYearFilter.value: null,
        majorFilter: majorFilter,
        excludedUsers: excludedUsers
      }
      ).catch(error => {
        console.log("Error occurred while getting liked users:", error)
      })
    }
    else{
      response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getBookmarkedUsers', {
        token: tokenVal,
        gradYearFilter: gradYearFilter!=null?gradYearFilter.value: null,
        majorFilter: majorFilter,
        excludedUsers: excludedUsers
      }
      ).catch(error => {
        console.log("Error occurred while getting liked users:", error)
      })
    }
    const bookmarkedUsers = response.data.users.reduce((result, user) => {
      result[user.username] = user.interaction.length > 0 && "bookmarked" in user.interaction[0] ? user.interaction[0].bookmarked : false;
      return result;
    }, {});
    const likedUsers = response.data.users.reduce((result, user) => {
      result[user.username] = user.interaction.length > 0 && "liked_or_disliked" in user.interaction[0] ? user.interaction[0].liked_or_disliked== "liked": false;
      return result;
    }, {});
    const dislikedUsers = response.data.users.reduce((result, user) => {
      result[user.username] = user.interaction.length > 0 && "liked_or_disliked" in user.interaction[0] ? user.interaction[0].liked_or_disliked== "disliked": false;
      return result;
    }, {});
  

    if(scrolledDown){
      if(response.data.users.length == 0){
        setNoMoreUsers(true)
      }
      else{
         setUsersBookmarked({...prevBookmarkedUsers,...bookmarkedUsers})
         setUsersLiked({...prevLikedUsers,...likedUsers})
         setUsersDisliked({...prevDislikedUsers,...dislikedUsers})
         setDisplayedUsers([...prevDisplayedUsers, ...response.data.users]);
         setNoMoreUsers(false)
      }
      setLoading(false)
    }
    else{
      
        setUsersBookmarked(bookmarkedUsers)
        setUsersLiked(likedUsers)
        setUsersDisliked(dislikedUsers)
        setDisplayedUsers(response.data.users);
        setNoMoreUsers(false)

    }
  }

  gradDates=[
    { label: "Fall 2024", value: "fall24" },
    { label: "Spring 2025", value: "spring25" },
    { label: "Fall 2025", value: "fall25" },
    { label: "Spring 2026", value: "spring26" },
    { label: "Fall 2026", value: "fall26" },
    { label: "Spring 2027", value: "spring27" },
    { label: "Fall 2027", value: "fall27" },
    { label: "Spring 2028", value: "spring28" },
    { label: "Fall 2028", value: "fall28" },
  ]
  const renderFooter = () => {
    if(loading && !noMoreUsers){
      return(
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator animating size="large" />
      </View>
      )
    }
    else{
      if(noMoreUsers){
        return (<Text>No more users, check again soon for more</Text>)
      }
      else{
        return null
      }
    }
   
  };
    return(
      <View style={[styles.container, {backgroundColor:theme.backgroundColor}]}>
        <View style={[styles.topBar, {backgroundColor:theme.backgroundColor}]}>
        <View style ={styles.inputContainer}>
            <TextInput
              style={[styles.input, {color:theme.color}]}
              placeholder="Search for a user"
              placeholderTextColor='gray'
            
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
              <View style={[styles.dropdownContainer, {backgroundColor:theme.backgroundColor}]}>
                <FlatList
                data={searchResults}
                keyExtractor={(item) => item._id}
                renderItem={({item,index }) => (
                  <TouchableOpacity key={index}
                    //value={searchTerm}
                    onPress={() => handleSearchListButtonPress(item,index)}
                    //activeOpacity={0.7} // You can adjust this value
                    underlayColor="gray">
                      <View style={[styles.dropdownItemContainer, {backgroundColor:theme.backgroundColor}]}>
                      <Text style={[styles.dropdownItem, {color:theme.color}]}>{item.username}</Text>
                      </View>
                  </TouchableOpacity>
                  
                )}
                />
              </View>
            )}
          </View>
    
          <TouchableOpacity
            style={[styles.filterButton, currentFeed=="LikedBy"?{backgroundColor:"gold"}:{backgroundColor: "#d9d9d9"}]}
            onPress={handleLikedByFeedPress}>
            <Text style={styles.searchButtonText}>Liked Me</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, currentFeed=="Bookmarked"?{backgroundColor:"gold"}:{backgroundColor: "#d9d9d9"}]}
            onPress={handleBookmarkFeedPress}>
             <Ionicons
            name={currentFeed=="Bookmarked" ? 'bookmark' : 'bookmark-outline'} // Use 'heart' for filled heart and 'heart-o' for outline heart
            color={"gray"}
            size={15}
          />
          </TouchableOpacity>
          <View>
          <TouchableOpacity
            style={[styles.filterCategoryButton,  majorFilter!=""||gradYearFilter!=null?{backgroundColor:"gold"}:{backgroundColor: "#d9d9d9"}]}
            onPress={()=>{setFiltering(!filtering);setSelectingMajor(majorFilter=="");setSelectingGradYear(gradYearFilter==null)} }>
            <Text style={styles.searchButtonText}>Filters</Text>
          </TouchableOpacity>
          <View  style={styles.collapsibleContent}>
          <Collapsible  collapsed={!filtering}>
            <View >
          <TouchableOpacity onPress={()=>setSelectingMajor(!selectingMajor)} style={[styles.filterCategory, majorFilter!=""?{backgroundColor:"gold"}:{backgroundColor: "#d9d9d9"}]}>
            <Text>Major</Text>
          </TouchableOpacity>
          <Collapsible collapsed={selectingMajor}>
         { !selectingMajor?(<TextInput
              style={[styles.input, {color:theme.color}]}
              placeholder="Enter"
              placeholderTextColor='gray'
              onChangeText={(text) => setCurrMajorInput(text)}
              onBlur={() => setMajorFilter(currMajorInput)}
              value={currMajorInput}
              autoCapitalize="none"
            />):(<></>)}
          </Collapsible>
          <TouchableOpacity onPress={()=>setSelectingGradYear(!selectingGradYear)} style={[styles.filterCategory, gradYearFilter!=null?{backgroundColor:"gold"}:{backgroundColor: "#d9d9d9"}]}>
            <Text>Graduation</Text>
          </TouchableOpacity>
          <Collapsible collapsed={selectingGradYear}>
          {gradYearFilter==null?(gradDates.map((item,index)=>(
          <TouchableOpacity key={index} onPress={()=>setGradYearFilter(item)} style={styles.filterCategory}>
          <Text>{item.label}</Text>
           </TouchableOpacity>
          )))
          :(
            <TouchableOpacity onPress={()=>setGradYearFilter(null)} style={styles.filterCategory}>
            <Text>{gradYearFilter.label}</Text>
           </TouchableOpacity>
          )
          }
          </Collapsible>
          </View>
          </Collapsible>
          </View>
          
          </View>
        </View>

        

    
       {/* {renderModal()} */}
        
        <MatchPopUp matchedUser={matchPopUpUserShown} hideMatchPopUp={hideMatchPopUp} navigation={navigation}/>

        <View style={[styles.flatListContainer, {backgroundColor:theme.backgroundColor}]}>
          {displayedUsers.length > 0 ? (
            <FlatList
            ref={scrollViewRef}
              data={displayedUsers} // Replace with your data array
              renderItem={({ item }) => <FeedItem user={item} onLikePress={handleLikePress}/>}
              keyExtractor={(item) => item.username} // Replace with a unique key extractor
              horizontal={false}
              contentContainerStyle={[styles.flatListContent, {backgroundColor:theme.backgroundColor}]}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              onEndReached={() => handleRefreshFeed(true)}
              onEndReachedThreshold={0}
              ListFooterComponent={renderFooter}
            />
          ) : (
            <ScrollView 
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
              <Text style={[styles.noMatchesText, {color:theme.color}]}>
                You have no potential matches. Consider adjusting your preferences to gain a broader suggestion of users
              </Text>
            </ScrollView>
          )}
        </View>
        <Modal
            animationType="slide"
            transparent={false}
            visible={isUserModalVisible}
          >
            <UserProfile visible={isUserModalVisible} user={selectedUser} closeModal={handleCloseUserModal} handleLikePress={handleLikePress} handleBookmarkPressed={handleBookmarkPressed} handleDislikePress={handleDislikePress}/>
          </Modal>
      </View>
  );
    }
    async function sendLikeNotification(recipientNotificationToken, senderUsername) {
      console.log("Sending like noti: ", recipientNotificationToken, senderUsername)

      const notifData = {
        
        to: recipientNotificationToken,
        title: 'You have a new like!',
        body: senderUsername + ' liked you.',
        data: {
          type: "like",
          otherUser: senderUsername
        }
        
        
      }
  
      const res = await axios.post('https://exp.host/--/api/v2/push/send', notifData, {
        headers: {
          'host': 'exp.host',
          'accept': 'application/json',
          'accept-encoding': 'gzip, deflate',
          'content-type': 'application/json'
        }
       
      }).catch((err) => {
        console.log("Sending message failed: ", err)
      })

     // console.log(res.data)
      /*
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "You have a new like!",
          body: `${senderUsername} liked you.`,
        },
        trigger: { seconds: 2 }, // Send the notification immediately
        to: recipientNotificationToken,
      });
      */
    }
    async function sendMatchNotification(recipientNotificationToken, senderUsername) {
      console.log("Sending like noti: ", recipientNotificationToken, senderUsername)

      const notifData = {
        to: recipientNotificationToken,
        title: 'You have a new Match!',
        body: 'You matched with ' + senderUsername + '.',
        data: {
          type: "match",
          otherUser: senderUsername
        }
      }
  
      const res = await axios.post('https://exp.host/--/api/v2/push/send', notifData, {
        headers: {
          'host': 'exp.host',
          'accept': 'application/json',
          'accept-encoding': 'gzip, deflate',
          'content-type': 'application/json'
        }
       
      }).catch((err) => {
        console.log("Sending match failed: ", err)
      })
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
    backgroundColor:"white"
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
    backgroundColor:"white",
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
  filterCategoryButton: {
    paddingHorizontal:25,
    padding: 10,
    borderRadius: 5,
  },
  filterCategory:{
   borderWidth:1,
   padding:5,
   borderRadius:5,
   backgroundColor:"white"
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
    gap: 5
  },
  collapsibleContent: {
    position: 'absolute',
    top: 35,
    left: 0,
    right: 0,
    borderRadius:5,
    zIndex: 2,// Ensure it appears on top
   // zIndex: 2, // Ensure it appears on top
    
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
    lineHeight: 40,
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