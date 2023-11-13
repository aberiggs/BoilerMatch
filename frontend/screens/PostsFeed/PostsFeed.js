import { StyleSheet, View, FlatList, Text, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios"
import * as SecureStore from 'expo-secure-store';

import CreatePostModal from './CreatePostModal'; // Import the ReportBlockModal component

export default function PostsFeed({navigation}) {

    const [createPostModalVisible, setCreatePostModalVisible] = useState(false);

    const openCreatePostModal = () => {
        setCreatePostModalVisible(true);
    };

    const closeCreatePostModal = () => {
        setCreatePostModalVisible(false);
    };

    const displayedPosts = [{title: "Looking for a roommate!"},
                            {title: "Subleasing for Spring 2024"}, 
                            {title: "Where can I find cheaper leases?"}]

    const PostItem = ({item}) => (
        <View style={{height: 20, width: "full"}}>
            <Text>
                {item.title}
            </Text>
            
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
})