import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList,TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Avatar } from '@rneui/themed';

export default function BlockedUsers({route, navigation }) {
  const [users, setUsers] = useState([]);

  const unblockUser = async(username) => {
   
    const tokenVal = await SecureStore.getItemAsync('token')
    const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/reportOtherUser/blockOtherUser', {
      token: tokenVal,
      userBlocked: username
    }
    ).catch(error => {
      console.log("Error occurred while blocking users:", error)
    })
    if(response.data.userBlocked2 == null){
        blocked = true
      }
      else{
        blocked = !(response.data.userBlocked2.didBlocking)
      }
      if(!blocked){
        setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
      }
      if(response.data.userBlocked2.liked_or_disliked=="liked" && 
      response.data.userBlocked2.liked_or_disliked=="liked"){
      await route.params.reloadChat()
      } 


  }

  const getBlockedUsers = async () => {
    try {
      const tokenVal = await SecureStore.getItemAsync('token');
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_HOSTNAME}/api/user/getBlockedUsers`,
        {
          token: tokenVal,
        }
      );

      return response.data.users;
    } catch (error) {
      console.log("Error occurred while getting blocked users:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      const blockedUsers = await getBlockedUsers();
      setUsers(blockedUsers);
    };

    fetchBlockedUsers();
  }, []);

  return (
    <View style={styles.container}>
        
     
      {users.length>0?(
        <View>
         <Text style={styles.title}>Blocked Users</Text>
      <FlatList
        data={users}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
         keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Avatar
          size={50}
          rounded
          source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + item.username + '.jpg'}}
          containerStyle={{backgroundColor: 'grey',  alignSelf: 'center'}}
          activeOpacity={0.8}
        />
            <Text style={styles.usernameText}>{item.username}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={()=>{ unblockUser(item.username)}}>
            <Text style={styles.closeButtonText}>Unblock</Text>
          </TouchableOpacity>
          </View>
        )}
      />
      </View>):(
        <View>

      <Text style={styles.title}>No Blocked Users</Text>
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    

    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',     // Center horizontally
    marginVertical:20
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
   alignSelf:"center",
    justifyContent:"flex-start",

  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    justifyContent:"center",
    borderWidth:1,
    borderRadius: 10,
    padding: 10
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
    width: 100,
    alignSelf: 'center',
    padding: 10
  },
  closeButtonText: {
    fontSize: 15,
    alignSelf: "center"
  },
  noBlockedUsersText:{
    alignSelf:"center",
    fontSize: 20,
  },
  usernameText: {
    color: 'black',
    width: "50%",
    textAlign:"center",
    fontSize: 20,

  }
});