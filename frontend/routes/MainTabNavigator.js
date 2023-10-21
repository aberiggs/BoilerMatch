import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainFeed from '../screens/MainFeed/MainFeed'
import Messages from '../screens/Messages/Messages'
import Profile from '../screens/Profile/Profile'
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {

    return (
    <Tab.Navigator screenOptions={({ route }) => ({
        
        tabBarIcon: ({color, size }) => {
          let iconName;
        
          if (route.name === "Main Feed") {
            iconName =  "ios-home"
          } else if (route.name === "Messages") {
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
      <Tab.Screen name="Main Feed" component={MainFeed} />
      <Tab.Screen name="Messages" component={Messages} />
      <Tab.Screen name="Profile" component={Profile} />
      
    </Tab.Navigator>
    )
}