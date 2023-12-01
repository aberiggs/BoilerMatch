import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainFeed from '../screens/MainFeed/MainFeed'
import ChatList from '../screens/Messages/ChatList'
import Profile from '../screens/Profile/Profile'
import PostsFeed from '../screens/PostsFeed/PostsFeed'
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const [chatReloaded, setChatReloaded] = useState(false)

    const reloadChat = () =>{
      setChatReloaded(!chatReloaded)

    }
   
    return (
    <Tab.Navigator screenOptions={({ route }) => ({
        
        tabBarIcon: ({color, size }) => {
          let iconName;
        
          if (route.name === "Main Feed") {
            iconName =  "ios-home"
          } else if (route.name === "Messages") {
            iconName = "chatbubble"
          } else if (route.name === "Posts") {
            iconName = "newspaper"
          } else {
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
       // options={{ tabBarBadge: checkForMatch ? 1 : null }} // Example of using the state for a badge
      >
        {(props) => <MainFeed {...props} reloadChat={reloadChat}/>}
      </Tab.Screen>

      <Tab.Screen name="Posts" component={PostsFeed} />

      <Tab.Screen
        name="ChatList"
        // options={{ tabBarBadge: checkForMatch ? 1 : null, unmountOnBlur: true}}
      >
        {(props) => <ChatList {...props} chatReloaded={chatReloaded} />}
      </Tab.Screen>
      <Tab.Screen name="Profile"
      >
         {(props) => <Profile {...props}  reloadChat={reloadChat} />}
      </Tab.Screen>
    </Tab.Navigator>
    )
}