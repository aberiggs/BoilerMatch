import { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Avatar, TouchableOpacity, ScrollView, SafeAreaView, TextInput, KeyboardAvoidingView, Pressable, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import themeContext from '../../theme/themeContext';

import {timeSince} from '../../utils/timeSince'

import axios from "axios"

export default function Comment(props, {navigation}) {
    const post = props.post
    const theme = useContext(themeContext)

    const [newComment, setNewComment] = useState('')
    const [comments, setComments] = useState(null)
    const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount ? post.upvoteCount : 0)
    const [upvoted, setUpvoted] = useState(post.upvoteUsers ? post.upvoteUsers.includes(props.currentUsername) : false)
    const [downvoted, setDownvoted] = useState(post.downvoteUsers ? post.downvoteUsers.includes(props.currentUsername) : false)
    const [delCommentDetails, setDelCommentDetails] = useState('')

    const [username, setUsername] = useState()

    useEffect(() => {
        console.log("Initializing")
        initialize()
    },[])
    
    const initialize = async () => {
        fetchComments()
        const usernameVal = setUsername(await SecureStore.getItemAsync('username'))
    }

    const createComment = async() => {
        console.log("creating comment with api call")
        const updatedComments = (comments ? comments : [])
        updatedComments.push(newComment)
        setComments(updatedComments)

        const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/posts/createComment', {
          username: username,
          comment: newComment,
          id: post._id,
        }). catch(error => {
          console.log("Error occured while creating comments: ", error)
        })

        fetchComments()
    }
    
    const fetchComments = async () => {
        const res = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/posts/getComments', {
            id: post._id,
        }).catch(error => {
            console.log("Couldn't fetch comments")
            return null
        })
        
        if (!res || !res.data || !res.data.comments) {
            return
        }

        setComments(res.data.comments)
    }

    const deleteComment = async () => {
        const res = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/posts/deleteComment', {
            id: post._id,
            username: username,
            details: delCommentDetails, 
        }).catch(error => {
            console.log("Couldn't fetch comments")
            return null
        })

        fetchComments()
    }

    const CommentItem = ({item}) => {
    
        const lastUpdated = timeSince(item.timestamp)
        const isCurrentUserComment = item.from == username
        setDelCommentDetails(item.details);

        return (
          <View style={[styles.feedItem, {backgroundColor:theme.background}]}>
            <View style={{alignSelf: 'flex-end', marginTop: -5, position: 'absolute', backgroundColor:theme.background}}>
            {isCurrentUserComment && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                deleteComment();
              }}>
                <Ionicons
                    name={'trash-bin'}
                    color={'red'}
                    size={20}
                />
            </TouchableOpacity>
          )}
            </View>
            <Text style={[commentStyles.title, {color:theme.color}]}>{item.details}</Text>
            <Text style={{color: 'grey', fontWeight: "bold"}}>@{item.from}</Text>
            <Text style={[commentStyles.infoLabel]}>{lastUpdated}</Text>
          </View>
        )
    }

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
          id: post._id,
        }).catch(error => {
          console.log("Error occurred while updating vote: ", error.response.data )
        })
    
        if (response && response.data) {
          const newUpvoteCount = response.data.upvoteCount
          setUpvoteCount(newUpvoteCount)
          props.getPost()
        }
      } 

    return(
        <SafeAreaView style={{height: '100%', width: '100%', backgroundColor:theme.background}}>
            <View style={[commentStyles.headingContainer, {backgroundColor:theme.background}]}>
                <View style={{width: '30%', alignItems: 'left', backgroundColor:theme.backgroundColor}}>
                    <Pressable style={{padding: 6}} onPress={() => props.onClose()}>
                        <Ionicons name="chevron-back" size={30} color="gold" />
                    </Pressable>
                </View>
            </View>

            <View style={{paddingHorizontal: 15, paddingTop: 10, width: '90%', alignItems: 'left', justifyContent: 'left', color:theme.color}}>
                    <Text style={{fontWeight: "bold", fontSize: 24, color:theme.color}}>{post.title}</Text>
            </View>

            <View style={{paddingHorizontal: 15, width: '90%', alignItems: 'left', justifyContent: 'left', color:theme.color}}>
                    <Text style={{textDecorationLine: 'underline', fontSize: 15, color:'gray'}}>@{post.user}</Text>
            </View>

            <View style={{paddingHorizontal: 15, width: '90%', alignItems: 'left', justifyContent: 'left', color:theme.color}}>
                    <Text style={{fontSize: 15, color:'gray'}}>{timeSince(post.timestamp)}</Text>
            </View>

            <View style={{paddingHorizontal: 15, paddingVertical: 10, width: '90%', alignItems: 'left', justifyContent: 'left', color:theme.color}}>
                    <Text style={{fontSize: 18, color:theme.color}}>{post.details}</Text>
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
            
            <View style={{paddingHorizontal: 15, paddingVertical: 10, width: '90%', alignItems: 'left', justifyContent: 'left', color:theme.color}}>
                    <Text style={{textDecorationLine: 'underline', fontSize: 18, color:theme.color}}>Comments</Text>
            </View>
            <KeyboardAvoidingView behavior={'padding'} removeClippedSubview={false} style={[commentStyles.convoContainer, {backgroundColor:theme.background}]}>
                <FlatList
                    style={commentStyles.chatScrollView}
                    data={comments}
                    
                    renderItem={({ item }) => CommentItem({item}) }
                    keyExtractor={(item) => {return item.id}} 
                    horizontal={false}
                />

                <View style={commentStyles.messageContainer}>
                    <TextInput
                        placeholder='Type your comment here!'
                        placeholderTextColor='gray'

                        onChangeText={comment => setNewComment(comment)}

                        style={[commentStyles.messageField, {color:theme.color}]}
                    />

                    <Pressable onPress={() => {createComment(); fetchComments()}}>
                        <Ionicons name="send-outline" size={24} color="black" />
                    </Pressable>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
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
        flexGrow: 1,
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

const commentStyles = StyleSheet.create({
    buttonText: {
      fontSize: 12,
      alignSelf: "center"
    },
    postsListContainer: {
        width: '100%',
        backgroundColor: '#ECECEC',
        padding: 20,
        flexGrow: 1, // Ensure the content can grow within the container
    },
    otherUserMessageBox: {
        maxWidth: '75%',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        margin: 5,
        backgroundColor: 'lightgrey',
    },
    button: {
      width: "100%",
      height: 40,
      backgroundColor: "gold",
      borderWidth: 1,
      borderRadius: 6,
      borderBlockColor : "black",
      justifyContent: 'center',
      alignSelf: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: 'gold',
      alignItems: 'center',
      width: '100%'
    },
    buttonContainer: {
        flexDirection: 'column', // Display buttons horizontally
        justifyContent: 'space-between', // You can change this to 'space-between' for different spacing
        width: '20%',
        padding: 10
    },
    convoContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    headingContainer: {
        flexDirection: 'row',
        justifyContent: 'left',
        width: '100%',
        height: '6%',
        alignItems: 'left',
        borderBottomWidth: 1,
        borderColor: 'gold',
        backgroundColor: "gold"
    },
    chatScrollView: {
        width: '95%',
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 50,
        borderWidth: 1,
        width: '80%',
        height: 40,
        margin: 10,
        paddingHorizontal: 10
    },
    messageField: {
        color:"black",
        width: "80%",
        borderColor: 'black',
        padding: 10,
        borderRadius: 50,
        height: '100%',
    },
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
});