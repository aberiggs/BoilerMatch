import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import Search from './Search';
import { StyleSheet, Text, View,TouchableOpacity,TextInput } from 'react-native';

export default function MainFeed({navigation}){
  const [searchTerm, setSearchTerm] = useState('');
  // Function to handle the search button press not yet finished.. need to get info from database
  
  const handleSearchButtonPress = async () => {
    try {
      const response = await fetch(`YOUR_BACKEND_URL/api/users/search?query=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        // Update the state with the search results
        setSearchResults(data); // Assuming you have a state variable for search results
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    };

    /*
    plan to use once we get the data from the database.. then we use the userProfile class
    to display the information
    */
   const handleUserSelect = (user) => {
    navigation.navigate('userProfile', { user });
   };
      
    return(
        <View style={styles.container}>
        <Text>No one wants to room with you Sprocket</Text>
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder="Search for a user"
          onChangeText={(text) => setSearchTerm(text)}
          value={searchTerm}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchButtonPress}
        >
          {/* You can use your search icon here */}
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
    


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    width: 250,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    center: 10,
  },
  input: {
    width: 10, // Adjust the width as needed to make it smaller
    height: 40, // Adjust the height as needed
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: 'gold', // Change the background color as desired
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'gray', // Change the text color as desired
    fontSize: 13,
  },
  });
  