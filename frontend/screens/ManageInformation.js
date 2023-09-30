import { StyleSheet, Text, View } from 'react-native';

export default function ManageInformation() {
  
  
    return (
    <View style={styles.container}>
      <Text>Please fill out your information in the following fields</Text>
        
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
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  }
});