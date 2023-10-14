import { Text, View } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';

export default function userProfile() {
  const route = useRoute();
  const { user } = route.params;

  return (
    <View>
      <Text>User Profile</Text>
      <Text>Username: {user.username}</Text>
      {/* Display other user profile information */}
    </View>
  );
}
