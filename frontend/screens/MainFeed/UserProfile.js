
import { StyleSheet, Text, View, Pressable, ScrollView, Image, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useRef, useContext} from 'react';
import { Avatar } from '@rneui/themed';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import themeContext from '../../theme/themeContext';
import { Ionicons,FontAwesome,MaterialIcons} from '@expo/vector-icons';
import AwaitRateModal from './AwaitRateModal';
import RateModal from './RateModal';


import PostsList from '../PostsFeed/PostsList'

export default function userProfile(props) {
  const [userPhotos, setUserPhotos] = useState([]);
  const [posts, setPosts] = useState(null)

  const carouselRef = useRef(null);
  const [viewingSelf, setViewingSelf] = useState(false)

  const [awaitModalVisible, setAwaitModalVisible] = useState(false);
  const [rateModalVisible, setRateModalVisible] = useState(false);


  const openAwaitModal = () => {
    setAwaitModalVisible(true);
  };

  const openRateModal = () => {
    setRateModalVisible(true);
    

  }

  const rateOrAwaitDecision = async() => {
    const permissionStatus = await isPermitted();
    if(permissionStatus) {
      openRateModal();
    }
    else {
      openAwaitModal();
    }    
  }

  const closeAwaitModal = () => {
    setAwaitModalVisible(false);
  };

  const closeRateModal = () => {
    setRateModalVisible(false);
  };


  const carouselRef = useRef(null);
  const selectedUser = props.user
  const selectedUsername = props.user.username
  const theme = useContext(themeContext)
  const [userLiked, setUserLiked] = useState(false)
  const [userBookmarked, setUserBookmarked] = useState(false)
  const [userDisliked, setUserDisliked] = useState(false)
  const [isBlocked,setIsBlocked] = useState(false)


  const isPermitted = async() => {
    try {
      const tokenVal = await SecureStore.getItemAsync('token');
      const response = await axios.get(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/isPermitted', {
      params :{
      token: tokenVal,
      selectedUser: selectedUsername,
      }
    });
    
      return response.data.hasPermission;
    }
    catch (error) {
      console.error('Error:', error);
      return false; 
    }
     
  }

  useEffect(() => {
    getInteractionWithUser()
  }, [props.visible]);

  useEffect(() => {
    getUserPhotos()
    getUserPosts()
  }, []);
  
  const getInteractionWithUser = async() => {

    const tokenVal = await SecureStore.getItemAsync('token');
    response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getInteractionWithUser', {
      token: tokenVal,
      userShown: selectedUser.username

    }
    ).catch(error => {
      console.log("Error occurred while getting users:", error)
    })
    console.log("HII")
    console.log(response.data)
    setViewingSelf(response.data.viewingSelf)

    interaction = response.data.interaction
    if (interaction != null){
    setUserLiked(interaction.liked_or_disliked =="liked" || false)
    
    setUserDisliked(interaction.liked_or_disliked =="disliked" || false)

    setUserBookmarked(interaction.bookmarked || false)
    
    setIsBlocked(interaction.didBlocking || false)
  }
  }
  const unblockUser = async() => {
    const tokenVal = await SecureStore.getItemAsync('token')
    const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/reportOtherUser/blockOtherUser', {
      token: tokenVal,
      userBlocked: selectedUser.username
    }
    ).catch(error => {
      console.log("Error occurred while blocking users:", error)
    })
    setIsBlocked(!isBlocked)
  }

  const getUserPosts = async () => {
    console.log("Loading posts for ", selectedUser.username)
    const res = await axios.get(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/posts/getUsersPosts', {
      params: {
        user: selectedUser.username
      }
    }).catch(error => {
      console.log("Error occurred while fetching posts: ", error);
    });
  
    // Fails to fetch data
    if (!res || !res.data || !res.data.postList) {
      return;
    }
  
    console.log("Posts found", res.data.postList)
    setPosts(res.data.postList);
  }

  /* Gets the URI's for all user photos */
  const getUserPhotos = async () => {
    console.log(selectedUser)
    //setIsLoading(true)
    const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/otherphotos', {
      username: selectedUser.username,
    }
    ).catch(error => {
      console.log("Error occurred while fetching other photos", error)
      console.log(error.data)
    })

    if (!response || !response.data || !response.data.photos) {
      console.log("No response data")
      return;
    }

    const photos = response.data.photos
    setUserPhotos(photos)
    //setIsLoading(false)
  }

  _renderItem = ({item, index}, parallaxProps) => {
    const photoUri = 'https://boilermatch.blob.core.windows.net/otherphotos/' + item
    return (
      <View style={sliderStyle.item}>
        <ParallaxImage
            source={{ uri: photoUri}}
            containerStyle={sliderStyle.imageContainer}
            style={sliderStyle.image}
            parallaxFactor={0}
            {...parallaxProps}
        />
      </View>
    );
}
  return (

    <View style={[modalStyles.modalContainer,{backgroundColor:theme.background}]}>
      
      <View style={modalStyles.modalContent}>
          <ScrollView style={{width: '70%'}}>
          <Avatar
            size='xlarge'
            rounded
            source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + selectedUser.username + '.jpg'}}
            containerStyle={{backgroundColor: 'grey', margin: 10, alignSelf: 'center'}}
            activeOpacity={0.8}
          />
 { !isBlocked ? (
        <View>

          <Text style={[styles.subtitle,{color:theme.color}]}>Name: {selectedUser.information.firstName} {selectedUser.information.lastName}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Gender: {selectedUser.information.gender}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Grad Year: {selectedUser.information.graduation}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Major: {selectedUser.information.major}</Text>


          <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Carousel
              ref={carouselRef}
              data={userPhotos}
              sliderWidth={400}
              itemWidth={270}
              hasParallaxImages={true}
              renderItem={this._renderItem}
            />
          </View>

          <Text style={[styles.title,{color:theme.color}]}>{'\n'}Housing Information</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Housing: {selectedUser.housingInformation.housing}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Confirmed Housing Situation: {selectedUser.housingInformation.confirmedHousingSituation}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Number Of Roommates: {selectedUser.housingInformation.numRoommates}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>UnknownHousingSituation: {selectedUser.housingInformation.unknownHousingSituation}</Text>

          <Text style={[styles.title,{color:theme.color}]}>{'\n'}Preferences</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Gender: {selectedUser.preferences.gender}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Bedtime: {selectedUser.preferences.bedtime}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Guests: {selectedUser.preferences.guests}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Clean: {selectedUser.preferences.clean}</Text>
          <Text style={[styles.subtitle,{color:theme.color}]}>Noise: {selectedUser.preferences.noise}</Text>
          {selectedUser.ratings && selectedUser.ratings.length > 0 ? (
          selectedUser.ratings.map((rating, index) => (
            <View key={index}>
              <Text style={[styles.title, { color: theme.color }]}>
                {'\n'}Rating by a user
              </Text>
              <Text style={[styles.subtitle, { color: theme.color }]}>
                Usual bedtime: {rating.bedtime}
              </Text>
              <Text style={[styles.subtitle, { color: theme.color }]}>
                Guest frequency: {rating.guest}
              </Text>
              <Text style={[styles.subtitle, { color: theme.color }]}>
                General cleanliness: {rating.clean}
              </Text>
              <Text style={[styles.subtitle, { color: theme.color }]}>
                Noise level: {rating.noise}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.title}>No ratings</Text>
          )}
          </View>
          
          )
          
          :
          <View>
            <TouchableOpacity style={modalStyles.closeButton} onPress={unblockUser}>
            <Text style={modalStyles.closeButtonText}>Unblock</Text>
          </TouchableOpacity>
            </View>}
                  

           <PostsList posts={posts} fetchPosts={getUserPosts} />


          <Text style={[styles.subtitle,{color:theme.color}]}> {}</Text>

          <RateModal visible={rateModalVisible} user={selectedUser.username} onClose={closeRateModal}/>
          <AwaitRateModal visible={awaitModalVisible} username={selectedUser.username} onClose={closeAwaitModal} />
        </ScrollView>
        
        { !viewingSelf && !isBlocked ? (
        <View style={modalStyles.iconRow}>
        <TouchableOpacity style={modalStyles.iconContainer} onPress={() =>{setUserLiked(!userLiked); setUserDisliked(false); props.handleLikePress(selectedUser)}}>
          <Ionicons
            name={userLiked ? 'heart' : 'heart-outline'} 
            color={userLiked ? 'red' : 'gray'}
            size={40}
          />
        </TouchableOpacity>
        <TouchableOpacity style={modalStyles.iconContainer} onPress={() => {setUserBookmarked(!userBookmarked); props.handleBookmarkPressed(selectedUser)}}>
          <Ionicons
            name={userBookmarked ? 'bookmark' : 'bookmark-outline'} 
            color={userBookmarked ? 'gold' : 'gray'}
            size={40}
          />
        </TouchableOpacity>

        <TouchableOpacity style={modalStyles.iconContainer} onPress={() => {setUserDisliked(!userDisliked); setUserLiked(false); props.handleDislikePress(selectedUser)}}>
          <Ionicons
            name={userDisliked ? 'heart-dislike' : 'heart-dislike-outline'} 
            color={userDisliked? 'red' : 'gray'}
            size={40}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={rateOrAwaitDecision}>
        <MaterialIcons
            name={'rate-review'} 
            color={'grey'}
            size={40}
          />
          </TouchableOpacity>
      </View>
        ):(<></>)}
        
        <View style={modalStyles.closeButtonContainer}>
          
          <Pressable style={modalStyles.closeButton} onPress={props.closeModal}>
            <Text style={modalStyles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
     
    </View>
  );
}

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    backgroundColor: "white",
  },
  modalContent: {
    flex: 'column', 
    width: '100%',
    height: '90%', 
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: "space-between",
    width: "60%"
  },
  iconContainer: {
    paddingHorizontal: 5
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
    width: '60%',
    alignSelf: 'center',
    padding: 10
  },
  closeButtonText: {
    fontSize: 20,
    alignSelf: "center"
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
})

const styles = StyleSheet.create({
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
  });
  
  const sliderStyle = StyleSheet.create({
    item: {
      width: '100%',
      height: 360,
    },
    imageContainer: {
      flex: 1,
      marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
      backgroundColor: 'white',
      borderRadius: 8,
    },
    image: {
      ...StyleSheet.absoluteFillObject,
      resizeMode: 'cover',
    },
  })
