import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';

export default function ChatRoom({navigation}){



    return(
      <View style={{ flex: 1, padding: 16 }}>
        <FlatList
          data={messages}
          keyExtractor={(message, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <View
                style={{
                  backgroundColor: item.sender === 'user' ? 'blue' : 'green',
                  borderRadius: 8,
                  padding: 8,
                  margin: 4,
                }}
              >
                <Text style={{ color: 'white' }}>{item.text}</Text>
              </View>
            </View>
          )}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={{ flex: 1, borderWidth: 1, borderRadius: 5, padding: 8, marginRight: 8 }}
            value={newMessage}
            onChangeText={text => setNewMessage(text)}
            placeholder="Type your message"
          />
          <Button title="Send" onPress={handleSend} />
        </View>
       </View>
    )



}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  