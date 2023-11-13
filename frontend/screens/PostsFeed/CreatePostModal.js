import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable, TextInput} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from "react-native-picker-select"
import * as SecureStore from 'expo-secure-store'
import axios from "axios"

export default function CreatePostModal({ visible, onClose }) {
  
  const [category, setCategory] = useState('');
  const [titleOfPost, setTitleOfPost] = useState('');
  const [detailsOfPost, setDetailsOfPost] = useState('');

  const [errMsgVisible, setErrMsgVisible] = useState(false);
  const [submitMsgVisible, setSubmitMsgVisible] = useState(false);

  const handleTitleOfPost = (text) => {
    setTitleOfPost(text);
  };
  
  const handleDetailsOfPost = (text) => {
    setDetailsOfPost(text);
  };

  const handleSubmit = async () => {
    // If not all the fields filled out then send error message
    // If not all the fields filled out then send error message
    if ( !category || !titleOfPost || !detailsOfPost) {
      setErrMsgVisible(true);
    } else {
      const res = createPostApi();
      setSubmitMsgVisible(true);
    }
  }

  const createPostApi = async(user) => {
    console.log("creating post with api call")
    const tokenVal = await SecureStore.getItemAsync('token')
    const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/posts/createPost', {
      token: tokenVal,
      category: category,
      title: titleOfPost,
      details: detailsOfPost,
    }). catch(error => {
      console.log("Error occured while creating posts: ", error)
    })
    setCategory('');
    setTitleOfPost('');
    setDetailsOfPost('');
  }

  const onCloseModal = () => {
    setCategory('');
    setTitleOfPost('');
    setDetailsOfPost('');
    setErrMsgVisible(false);
    setSubmitMsgVisible(false);
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
    >
      <View style={styles.container}>
        
        <Pressable style={{padding: 6, alignSelf:"flex-start", marginTop: 40}} onPress={onCloseModal}>
          <Ionicons name="chevron-back" size={30} color="gold" />
        </Pressable>


        <Text style={styles.title}>Please fill out information for your post here.</Text>
          
            <Text style={styles.subtitle}>Category of Post</Text>

            <RNPickerSelect
                placeholder={ {label: "Category of Post", value: null}}
                onValueChange={(value) => setCategory(value)}
                value={category}
                items={[
                    { label: "Housing", value: "housing" },
                    { label: "Roommate searching", value: "roommateSearching" },
                    { label: "MISC", value: "misc" },
                ]}
                style={pickerSelectStyles}
            /> 

            <Text style={styles.subtitle}>Write the title of the post here. </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Write something..."
                    value={titleOfPost}
                    onChangeText={handleTitleOfPost}
                />

            <Text style={styles.subtitle}>Write the details of the post here. </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Write something..."
                    value={detailsOfPost}
                    onChangeText={handleDetailsOfPost}
                />

                    
          <Pressable style={styles.button} onPress={() => {handleSubmit()}}>
            <Text style={styles.modalButtonText}>OK</Text>
          </Pressable>

          {/* Modal for error message */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={errMsgVisible}
            onRequestClose={() => {
              setErrMsgVisible(!errMsgVisible);
            }}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Please make sure all the fields are filled out.
              </Text>
              <Pressable style={styles.modalButton} onPress={() => setErrMsgVisible(!errMsgVisible)}>
                <Text style={styles.modalButtonText}>OK</Text>
              </Pressable>
            </View>
          </Modal>

          {/* Modal for submit message */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={submitMsgVisible}
            onRequestClose={() => {
              setSubmitMsgVisible(false); // Close the "submit" message modal
            }}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                You have successfully created a post.
              </Text>
              <Pressable style={styles.modalButton} onPress={() => {setSubmitMsgVisible(false); onClose();}}>
                <Text style={styles.modalButtonText}>OK</Text>
              </Pressable>
            </View>
          </Modal>

        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 0, // Set to 0 to cover the entire screen
    width: '100%', // Set to 100% to cover the entire screen width
    height: '100%', // Set to 100% to cover the entire screen height
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    width: "40%",
    height: 40,
    backgroundColor: "gold",
    borderRadius: 6,
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  buttonText: {
    fontSize: 15,
    alignSelf: "center"
  },
  button: {
    width: "15%",
    height: 40,
    backgroundColor: "gold",
    borderRadius: 6,
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    padding: 10,
  },
  input: {
    width: '80%',
    height: 40,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 25,
    marginTop: 20,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 8
  },
  scrollView: {
    marginVertical:50,
    marginHorizontal:15,
  },
  modalView: {
    flex:1,
    marginTop:50,
    padding:20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: 'gold',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    marginBottom: 20,
  }
}

);
