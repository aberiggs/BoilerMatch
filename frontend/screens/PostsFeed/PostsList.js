
import { StyleSheet, View, Modal, FlatList, Text, TouchableOpacity, RefreshControl, Pressable } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios"
import * as SecureStore from 'expo-secure-store';
import themeContext from '../../theme/themeContext';

import DeletePostModal from './DeletePostModal';
import Post from './Post';

import {timeSince} from '../../utils/timeSince'

export default function PostsFeed(props) {
  const [username, setUsername] = useState(null)
  

  useEffect(() => {
    initialize()
  },[])


  const initialize = async () => {
    const userVal = await SecureStore.getItemAsync('username')
    setUsername(userVal)
  }


  return(
    <View style={styles.container}>
      <FlatList
        style={styles.postsListContainer}
        data={props.posts}
        
        renderItem={({ item }) => <PostItem post={item} currentUsername={username} fetchPosts={props.fetchPosts}/> }
        keyExtractor={(item) => {return item._id}} 
        horizontal={false}
        scrollEnabled={false}
      />
    </View>
  )

}

function PostItem (props) {
    const item = props.post
    const theme = useContext(themeContext)
    const [postOpened, setPostOpened] = useState(false) 
    const [deletePostModalVisible, setDeletePostModalVisible] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(item.upvoteCount ? item.upvoteCount : 0)
    const [upvoted, setUpvoted] = useState(item.upvoteUsers ? item.upvoteUsers.includes(props.currentUsername) : false)
    const [downvoted, setDownvoted] = useState(item.downvoteUsers ? item.downvoteUsers.includes(props.currentUsername) : false)
  
    const isCurrentUserPost = item.user == props.currentUsername;
    const lastUpdated = timeSince(item.timestamp)
  
    let categoryDisplayed = ''
    if (item.category == "housing") {
      categoryDisplayed = "Housing";
    } else if (item.category == "roommateSearching") {
      categoryDisplayed = "Roommate searching";
    } else if (item.category == "misc") {
      categoryDisplayed = "MISC"
    }
  
    const PostModal = () => {
      return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={postOpened}>
            <Post post={item} onClose={() => setPostOpened(false)}/>
        </Modal>
      )
    }
  
    const handlePostPress = async (post) => {
      if (post) {
        setPostOpened(true)
      } else {
        console.log("User is undefined");
      }
    };
    
    const handleUpvote = async () => {
      const newUpvoteVal = !upvoted
      setUpvoted(newUpvoteVal)
      setDownvoted(false)
      updateVote(newUpvoteVal ? 1 : 0)
    }
    
    const handleDownvote = () => {
      const newDownvoteVal = !downvoted
      setDownvoted(newDownvoteVal)
      setUpvoted(false)
      updateVote(newDownvoteVal ? -1 : 0)
    }
  
    const updateVote = async (voteVal) => {
      console.log(voteVal)
      const tokenVal = await SecureStore.getItemAsync('token')
      const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/posts/modifyVote', {
        token: tokenVal,
        vote: voteVal,
        id: item._id,
      }).catch(error => {
        console.log("Error occurred while updating vote: ", error.response.data )
      })
  
      if (response && response.data) {
        const newUpvoteCount = response.data.upvoteCount
        setUpvoteCount(newUpvoteCount)
      }
    } 
    
    return (
      <View style={[styles.feedItem, {backgroundColor:theme.background}]}>
        <PostModal />
        <DeletePostModal visible={deletePostModalVisible} post={item} onClose={() => {setDeletePostModalVisible(false); props.fetchPosts() }} />
        <View style={{flexGrow: 1}}>
          <TouchableOpacity style={[feedStyles.infoContainer, {backgroundColor:theme.backgroundColor}]} onPress={() => handlePostPress(item)}>
            <Text style={[feedStyles.title, {color:theme.color}]}>{item.title}</Text>
            <Text style={feedStyles.username}>@{item.user}</Text>
            <Text style={feedStyles.username}>{categoryDisplayed}</Text>
            <Text style={[styles.subtitle, {color:theme.color}]}>
              <Text style={[feedStyles.infoLabel]}>{lastUpdated}</Text>
            </Text>
  
            {isCurrentUserPost && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setDeletePostModalVisible(true);
                }}
              >
                <Text style={styles.deleteButtonText}>Delete post</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity> 
        </View>
  
        <View style={{justifyContent: 'space-between', alignItems: 'center', width:'20%'}}>
          <Pressable onPress={() => handleUpvote()}>
            <Ionicons name="chevron-up" size={46} color={upvoted ? 'gold' : theme.color}/>
          </Pressable>
  
          <Text style={{fontSize: 20, color:theme.color}}>{upvoteCount}</Text>
  
          <Pressable onPress={() => handleDownvote()}>
            <Ionicons name="chevron-down" size={46} color={downvoted ? 'gold' : theme.color} />
          </Pressable>
        </View>
        
      </View>
    )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    },
    postsListContainer: {
        width: '100%',
        padding: 20,
        flexGrow: 1, // Ensure the content can grow within the container
    },
    bottomContainer: {
        width: '100%',
        height: '10%',
        alignItems: 'center',
        justifyContent: 'center'
    },    
    button: {
        width: "40%",
        height: 50,
        backgroundColor: "gold",
        borderRadius: 6,
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        alignSelf: "center"
    },
    feedItem: {
      // Take up the entire available space
      flexDirection: 'row',
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
    deleteButton: {
    width: "30%",
    height: 30,
    backgroundColor: "gold",
    borderRadius: 6,
    justifyContent: 'center',
    },
    deleteButtonText: {
    fontSize: 12,
    alignSelf: "center",
    }
})

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
  title: {
    fontSize: 16
  },
  username: {
    fontSize: 16,
    color: 'grey',
    paddingBottom: 0
  },
  infoLabel: {
    fontSize: 14,
    color: 'grey'
  },  
})