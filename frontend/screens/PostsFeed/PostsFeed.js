import { StyleSheet, View, FlatList, Text, TouchableOpacity} from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios"
import * as SecureStore from 'expo-secure-store';
import themeContext from '../../theme/themeContext';

import CreatePostModal from './CreatePostModal'; // Import the ReportBlockModal component

export default function PostsFeed({navigation}) {
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const theme = useContext(themeContext);
  const [username, setUsername] = useState(null);
  const [posts, setPosts] = useState(null)
  

  useEffect(() => {
    console.log("Initializing")
    initialize()
  },[])

  const initialize = async () => {
    const userVal = await SecureStore.getItemAsync('username')
    setUsername(userVal)
    fetchPosts()
  }

  const fetchPosts = async () => {
    console.log("Fetching...")
    const res = await axios.get(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/posts/getPostList', { params: {
      fetchAmount: 20
    }}).catch(error => {
      console.log("Error occurred while fetching posts: ", error)
    })

    // Fails to fetch data
    if (!res || !res.data || !res.data.postList) {
      return
    }

    setPosts(res.data.postList)
    
  }

  const PostItem = ({item}) => {
    
    const lastUpdated = "x days ago"

    return (
      <View style={[styles.feedItem, {backgroundColor:theme.background}]}>
        <View style={[feedStyles.infoContainer, {backgroundColor:theme.backgroundColor}]}>
          <Text style={[feedStyles.title, {color:theme.color}]}>{item.title}</Text>
          <Text style={feedStyles.username}>@{item.user}</Text>
          <Text style={[styles.subtitle, {color:theme.color}]}>
            <Text style={[feedStyles.infoLabel]}>{lastUpdated}</Text>
          </Text>
        </View> 
      </View>
    )
  }

  return(
    <View style={styles.container}>
      <FlatList
          style={styles.postsListContainer}
          data={posts}
          
          renderItem={({ item }) => PostItem({item}) }
          keyExtractor={(item) => {return item.id}} 
          horizontal={false}
      />
      <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setCreatePostModalVisible(true)}>
              <Text style={styles.buttonText}>
                  Create Post
              </Text>
          </TouchableOpacity>
      </View>
      <CreatePostModal visible={createPostModalVisible} onClose={() => {setCreatePostModalVisible(false); fetchPosts()}} />
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
        height: '15%',
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