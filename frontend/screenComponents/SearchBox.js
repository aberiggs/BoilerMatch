import { View, Text } from 'react-native'
import React from 'react'
import Ionic from "react-native-vector-icons/Ionicons"

const SearchBox = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical:10,
        position:'relative'
      }}>
        <Ionic name="search" style={{}}/>

    </View>
  )
}

export default SearchBox
