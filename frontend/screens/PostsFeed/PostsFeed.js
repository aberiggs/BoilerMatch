import { StyleSheet, View, Modal, FlatList, Text, TouchableOpacity} from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios"
import * as SecureStore from 'expo-secure-store';
import themeContext from '../../theme/themeContext';
import RNPickerSelect from "react-native-picker-select"

import CreatePostModal from './CreatePostModal'; 
import DeletePostModal from './DeletePostModal';
import Post from './Post';

import {timeSince} from '../../utils/timeSince'

export default function PostsFeed({navigation}) {
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [deletePostModalVisible, setDeletePostModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState('')
  const [postOpened, setPostOpened] = useState(false) 
  const theme = useContext(themeContext);
  const [username, setUsername] = useState(null);
  const [posts, setPosts] = useState(null)
  const [filterCategory, setFilterCategory] = useState('');
  

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
    console.log("Fetching...");
    const res = await axios.get(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/posts/getPostList', {
      params: {
        fetchAmount: 20,
        filterCategory: filterCategory
      }
    }).catch(error => {
      console.log("Error occurred while fetching posts: ", error);
    });
  
    // Fails to fetch data
    if (!res || !res.data || !res.data.postList) {
      return;
    }
  
    setPosts(res.data.postList);
  };

  const handleFilterCategory = (value) => {
    setFilterCategory(value);
    fetchPosts()
  }
  

  const PostModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={postOpened}>
          <Post post={selectedPost} onClose={() => setPostOpened(false)}/>
      </Modal>
    )
  }

  const handlePostPress = async (post) => {
    if (post) {
      setSelectedPost(post)
      setPostOpened(true)
    } else {
      console.log("User is undefined");
    }
  };

  const PostItem = ({item}) => {

    console.log(item.user)

    const isCurrentUserPost = item.user == username;

    console.log(isCurrentUserPost)
    
    const lastUpdated = timeSince(item.timestamp)

    let categoryDisplayed = ''
    if (item.category == "housing") {
      categoryDisplayed = "Housing";
    } else if (item.category == "roommateSearching") {
      categoryDisplayed = "Roommate searching";
    } else if (item.category == "misc") {
      categoryDisplayed = "MISC"
    }

    return (
      
      <View style={[styles.feedItem, {backgroundColor:theme.background}]}>
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
                setSelectedPost(item); // Pass the selected post
                setDeletePostModalVisible(true);
              }}
            >
              <Text style={styles.deleteButtonText}>Delete post</Text>
            </TouchableOpacity>
          )}

        </TouchableOpacity> 
      </View>
    )
  }

  return(

    
    <View style={styles.container}>
      <RNPickerSelect
          placeholder={ {label: "Filter posts by category", value: null}}
          onValueChange={(value) => handleFilterCategory(value)}
          value={filterCategory}
          items={[
            { label: "Housing", value: "housing" },
            { label: "Roommate searching", value: "roommateSearching" },
            { label: "MISC", value: "misc" },
          ]}
          style={pickerSelectStyles}
      /> 
      <PostModal />
      <FlatList
          style={styles.postsListContainer}
          data={posts}
          
          renderItem={({ item }) => PostItem({item}) }
          keyExtractor={(item) => {return item._id}} 
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
      <DeletePostModal visible={deletePostModalVisible} post={selectedPost} onClose={() => {setDeletePostModalVisible(false); fetchPosts() }} />
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'grey', // Set the color of the border
    borderRadius: 8, // Set the border radius for rounded corners
    paddingHorizontal: 10, // Add padding to the left and right for better appearance
    paddingVertical: 10, // Add padding to the top and bottom for better appearance
  },
});
