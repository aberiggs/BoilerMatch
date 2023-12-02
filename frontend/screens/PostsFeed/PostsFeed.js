import { StyleSheet, View, Modal, FlatList, Text, TextInput, TouchableOpacity, RefreshControl, Pressable, ScrollView } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from 'react-native-elements';
import axios from "axios"
import themeContext from '../../theme/themeContext';
import RNPickerSelect from "react-native-picker-select"

import CreatePostModal from './CreatePostModal'; 
import PostsList from './PostsList'

export default function PostsFeed({navigation}) {
  const theme = useContext(themeContext)
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [posts, setPosts] = useState(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [postsToLoad, setPostsToLoad] = useState(0)
  const [search, setSearch] = useState('')
  const [searched, setSearched] = useState(false)
  

  useEffect(() => {
    initialize()
  },[])

  useEffect(() => {
    fetchPosts()
  },[filterCategory])

  useEffect (() => {
    // If we aren't currently trying to fetch any posts
    if (postsToLoad === 0) {
      // Increase the number of posts to fetch
      incrementPosts()
      return
    }
    if (!searched) {
      fetchPosts()
    }
  },[postsToLoad])

  const initialize = async () => {
    incrementPosts()
  }

  const fetchPosts = async () => {
    const res = await axios.get(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/posts/getPostList', {
      params: {
        fetchAmount: postsToLoad,
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

  const searchPosts = async () => {
    const res = await axios.get(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/posts/searchPosts', {
      params: {
        fetchAmount: postsToLoad,
        keyword: search,
      }
    }).catch(error => {
      console.log("Error occurred while fetching posts: ", error);
    });

    setPosts(res.data.postList)

  }

  const incrementPosts = () => {
    const additionalPostCount = 4
    setPostsToLoad(postsToLoad + additionalPostCount)
  }

  const refreshPosts = () => {
    setPosts(null)
    setPostsToLoad(0)
  }

  const handleFilterCategory = (value) => {
    setFilterCategory(value);
  }

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };


  return(
    <View style={styles.container}>
      <View style={[styles.topBar, {backgroundColor:theme.backgroundColor}]}>
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

      <TextInput
          style={[styles.input, {color:theme.color}]}
          placeholder="Search for a post"
          placeholderTextColor='gray'
        
          onChangeText={(text) => {
            setSearch(text);
          }}

          onSubmitEditing={() => {setSearched(true), searchPosts()}}
          autoCapitalize="none"
      />
      
        {searched && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setSearched(false);
                  fetchPosts();
                }}>

                <Ionicons
                    name={'close-circle-outline'}
                    color={'red'}
                    size={20}
                />
              </TouchableOpacity>
        )}
      </View>

      <ScrollView
        extraData={posts}
        style={{width: '100%'}}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            incrementPosts()
          }
        }}
        scrollEventThrottle={400}

        refreshControl={
          <RefreshControl
            onRefresh={() => {refreshPosts()}}
          />
        }
      >
        <PostsList posts={posts} fetchPosts={fetchPosts}/>
      </ScrollView>

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
    input: { 
      height: 40, 
      flex: 1,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      padding: 10,
      marginRight: 0,
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
    width: "5%",
    height: 30,
    backgroundColor: "white",
    borderRadius: 6,
    justifyContent: 'center',
    },
    deleteButtonText: {
    fontSize: 12,
    alignSelf: "center",
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
    marginBottom: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'grey', // Set the color of the border
    borderRadius: 8, // Set the border radius for rounded corners
    paddingHorizontal: 10, // Add padding to the left and right for better appearance
    paddingVertical: 10, // Add padding to the top and bottom for better appearance
  },
});
