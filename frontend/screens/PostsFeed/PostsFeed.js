import { StyleSheet, View, FlatList, Text, TouchableOpacity} from 'react-native';
import React, { useState, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios"
import * as SecureStore from 'expo-secure-store';
import themeContext from '../../theme/themeContext';

import CreatePostModal from './CreatePostModal'; // Import the ReportBlockModal component

export default function PostsFeed({navigation}) {

    const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
    const theme = useContext(themeContext);
    const [username, setUsername] = useState(null);
    
    const openCreatePostModal = () => {
        setCreatePostModalVisible(true);
    };

    const closeCreatePostModal = () => {
        setCreatePostModalVisible(false);
    };

    const initialize = async () => {
      const userVal = await SecureStore.getItemAsync('username')
      setUsername(userVal)
    }

    initialize()

    // @ Sprocket, you can look at ChatList and formatTimestamp or formatTimestampDate
    // and see how you wanna format the timestamp thats going on the feed
    

    const displayedPosts = [{title: "Looking for a roommate!"},
                            {title: "Subleasing for Spring 2024"}, 
                            {title: "Where can I find cheaper leases?"}]

    const PostItem = ({item}) => (
      <View style={[styles.feedItem, {backgroundColor:theme.background}]}>
          <View style={[feedStyles.infoContainer, {backgroundColor:theme.backgroundColor}]}>
            <Text style={[feedStyles.name, {color:theme.color}]}>{"Title"}</Text>
            <Text style={feedStyles.username}>@{"username handle"}</Text>
            <Text style={[styles.subtitle, {color:theme.color}]}>
              <Text style={[feedStyles.infoLabel, {color:theme.color}]}>Timestamp: </Text>
            </Text>
            <Text style={[styles.subtitle, {color:theme.color}]}>
              <Text style={[feedStyles.infoLabel, {color:theme.color}]}>Details </Text>
            </Text>
            
          </View> 
        </View>
    )

    return(
        <View style={styles.container}>
            <FlatList
                style={styles.postsListContainer}
                data={displayedPosts}
                
                renderItem={({ item }) => PostItem({item}) }
                keyExtractor={(item) => item._id} // Replace with a unique key extractor
                horizontal={false}
            />
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.button} onPress={openCreatePostModal}>
                    <Text style={styles.buttonText}>
                        Create Post
                    </Text>
                </TouchableOpacity>
            </View>
            <CreatePostModal visible={createPostModalVisible} onClose={closeCreatePostModal} />
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