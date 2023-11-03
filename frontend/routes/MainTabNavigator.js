import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainFeed from '../screens/MainFeed/MainFeed'
import ChatList from '../screens/Messages/ChatList'
import Profile from '../screens/Profile/Profile'
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const [refreshOnMatch, SetRefreshOnMatch] = useState(false)
    const [chatOpened, setChatOpened] = useState(false) 

    const [selectedUser, setSelectedUser] = useState('')

    const checkForMatches= () => {
      // Update the externalChange state when an event occurs in this component
      SetRefreshOnMatch(!refreshOnMatch);
      
    };

    const handleChatOpened = (matchedUsername) => {
      setSelectedUser(matchedUsername)
      setChatOpened(true)
    }

    const handleChatClosed = () => {
      setChatOpened(false)

    }
   
    return (
    <Tab.Navigator screenOptions={({ route }) => ({
        
        tabBarIcon: ({color, size }) => {
          let iconName;
        
          if (route.name === "Main Feed") {
            iconName =  "ios-home"
          } else if (route.name === "ChatList") {
            iconName = "chatbubble"
          }
          else {
            iconName = "person";
          }
    
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "gold",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Main Feed"
        options={{ tabBarBadge: refreshOnMatch ? 1 : null }} // Example of using the state for a badge
      >
        {(props) => <MainFeed {...props} checkForMatches={checkForMatches} handleChatOpened={handleChatOpened}/>}
      </Tab.Screen>
      <Tab.Screen
        name="ChatList"
        options={{ tabBarBadge: refreshOnMatch ? 1 : null }}
      >
        {(props) => <ChatList {...props} refreshOnMatch={refreshOnMatch} selectedUser={selectedUser} chatOpened={chatOpened} handleChatOpened={handleChatOpened} handleChatClosed={handleChatClosed}/>}
      </Tab.Screen>
      <Tab.Screen name="Profile" component={Profile} />
      
    </Tab.Navigator>
    )
}