import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import SearchBox from '../screenComponents/SearchBox';


const Search = () => {
    return (
        <View style= {{
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            position:'relative'
        }}>
            <ScrollView>
                <SearchBox/>

            </ScrollView>
        </View>
    );

};

export default Search;