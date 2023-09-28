import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainFeed from '../screens/MainFeed'
import ChatRoom from '../screens/ChatRoom'
import Profile from '../screens/Profile'
import {Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {

    return (
    <Tab.Navigator screenOptions={({ route }) => ({
        
        tabBarIcon: ({color, size }) => {
          let iconName;
        
          if (route.name === "MainFeed") {
            iconName =  "ios-home"
          } else if (route.name === "ChatRoom") {
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
      <Tab.Screen name="MainFeed" component={MainFeed} />
      <Tab.Screen name="ChatRoom" component={ChatRoom} />
      <Tab.Screen name="Profile" component={Profile} />
      
    </Tab.Navigator>
    )
}