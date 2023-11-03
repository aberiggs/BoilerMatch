import { StatusBar } from 'expo-status-bar';
import { useState , useContext} from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import axios from "axios";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import themeContext from '../../theme/themeContext';

export default function Register({navigation}){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [acceptedTos, setAcceptedTos] = useState(false)
    const [showTos, setShowTos] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const theme = useContext(themeContext)


    const handleRegister = async () => {    
      if (canRegister()) {
        const res = await createAccountThroughApi()
        if (!res || res.success === false) {
          print(res)
          if (res) {
            setErrorMessage(res.message)
          } else {
            setErrorMessage("An unexpected error occurred")
          }
        } else {
          navigation.navigate("Landing")
        }
      }
    }

    const createAccountThroughApi = async () => {
      // TODO: .env for dev/production environments
      const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/register', {
          email: email,
          password: password,
      }).catch((error) => {
        if (error.response) return error.response.data
      })

      return response
    }

    const canRegister = () => {
      emailExtension = "@purdue.edu"  // Note: Change this to be @gmail.com to create account from gmail for testing purposes
      if (email.length === 0 || email.includes(" ")) {
        // Email is blank or contains spaces
        setErrorMessage("Please enter a valid email")
        return false
      } else if (email.substring(email.length-emailExtension.length, email.length) !== emailExtension || email.length-emailExtension.length === 0) {
        // Email is not *.@purdue.edu
        setErrorMessage("Please enter a valid Purdue email")
        return false
      } else if (!validatePassword()) {
        // Error messages are handled by validatePassword()
        return false
      }  else if (password !== confirmedPassword) {
        // Passwords do not match
        setErrorMessage("The passwords do not match")
        return false
      } else if (acceptedTos !== true){
        // User didn't accept TOS
        setErrorMessage("Please accept the Terms of Service")
        return false
      }

      return true
    }

    const validatePassword = () => {
      passwordRegEx = /[A-Za-z]*[!?@#$]{1,}[A-Za-z]*/
      if (password.length === 0) {
        // Password is blank or contains spacess
        setErrorMessage("Please create a password")
        return false
      } else if (password.includes(" ")) {
          setErrorMessage("Your password must not contain spaces")
          return false
      } else if (!password.match(passwordRegEx) || password.length < 6 || password.length > 20) {
        // Ensure a secure password
        setErrorMessage("Your password must be 6-20 characters, and contain a special character (!,?,@,#,$)")
        return false
      }

      return true
    }

    return(
      <View style={[styles.container, {backgroundColor:theme.backgroundColor}]}>

        <Modal
          animationType="slide"
          transparent={false}
          visible={showTos}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setShowTos(!showTos);
          }}>
            <View style={styles.container}>
              <View style={{height: '88%'}}>
                <ScrollView>
                  <TOS/>
                </ScrollView>
              </View>
              <View style={{flex:1, justifyContent:'center', alignItems:'center', width: '100%'}}>
                <Pressable style={styles.button} onPress={() => setShowTos(!showTos)}>
                  <Text style={styles.buttonText}>Close</Text>
                </Pressable>
              </View>
            </View>
        </Modal>

        <View style={{flex: 'column', width: "45%"}}>
          <Text style={[styles.title, {color:theme.color}]}>Register</Text>

          <Text style={[styles.subtitle, {color:theme.color}]}>Email</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            placeholderTextColor={"grey"}
            
            onChangeText={text => setEmail(text)}

            style={styles.inputFieldBox}
          />

          <Text style={[styles.subtitle, {color:theme.color}]}>Password</Text>

          <View style={styles.inputFieldBox}>

            <TextInput 
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              placeholderTextColor={"grey"}

              onChangeText={text => setPassword(text)}
              secureTextEntry={!showPass}

              style={styles.inputField}
            />

            <Pressable style={{position: 'absolute', paddingRight: 10}} onPress={() => setShowPass(!showPass)}>
              { showPass ?
                <Ionicons name="eye-off-outline" size={26} color="black" /> :
                <Ionicons name="eye-outline" size={26} color="black" />
              }
            </Pressable>
          </View>

          <Text style={[styles.subtitle, {color:theme.color}]}>Confirm Password</Text>
          <TextInput 
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            placeholderTextColor={"grey"}

            onChangeText={ text => setConfirmedPassword(text)}
            secureTextEntry={!showPass}

            style={styles.inputFieldBox}
          />
        </View>

        <Text style={styles.errorMes}>{errorMessage}</Text>

        <View style={{
          flexDirection: 'row',
          paddingBottom: 20
        }}> 
          <Checkbox
            disabled={false}
            value={acceptedTos}
            onValueChange={(newValue) => setAcceptedTos(newValue)}
          />

          <Text style={[styles.otherText, {color:theme.color}]}>I agree to the <Text style={{color: 'gold', textDecorationLine: 'underline'}} onPress={() => setShowTos(!showTos)}>BoilerMatch Terms</Text></Text>
        
        </View>
      
        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      
      </View>
    )

}


const TOS = () => {

  // Maybe swap to styled components later?
  return(
    <View style={{flex: 1, alignItems: 'left', justifyContent: 'left', paddingHorizontal: 30, paddingVertical: 50}}>
      <Text style={tosStyles.title}>BoilerMatch - Terms of Service</Text>
      
      <Text style={tosStyles.heading}>Effective Date: 10/03/2023</Text>

      <Text style={tosStyles.section}>
        Welcome to BoilerMatch! These Terms of Service ("Terms") govern your use of the BoilerMatch mobile application ("App"). BoilerMatch is a mobile application designed to help Purdue University students find compatible roommates. Please read these Terms carefully before using the App.
      </Text>
      <Text style={tosStyles.section}>
        By downloading, creating an account, and using the App, you agree to be bound by these Terms. If you do not agree to these Terms, please do not register or use the app.
      </Text>

      <Text style={tosStyles.heading}>
        1. Acceptance of Terms
      </Text>
      <Text style={tosStyles.section}>
        1.1. These Terms constitute a legally binding agreement between you and BoilerMatch. By using the App, you acknowledge that you have read, understood, and agreed to be bound by these Terms.
      </Text>

      <Text style={tosStyles.heading}>
        2. Eligibility
      </Text>
      <Text style={tosStyles.section}>
        2.1. To use the App, you must be a Purdue University student or a person affiliated with Purdue University.
      </Text>
      <Text style={tosStyles.section}>
        2.2. You must be at least 18 years old to use the App.
      </Text>

      <Text style={tosStyles.heading}>
        3. User Conduct
      </Text>
      <Text style={tosStyles.section}>
        3.1. By using the App, you agree not to:
      </Text>
        <Text style={tosStyles.sectionDetail}>
            a) Attempt to reverse engineer, decompile, disassemble, or hack the App;
        </Text>
        <Text style={tosStyles.sectionDetail}>
          b) Use the App for any unlawful or fraudulent purpose;
        </Text>
        <Text style={tosStyles.sectionDetail}>
          c) Post, upload, or transmit explicit, offensive, inappropriate, or harmful content;
        </Text>
        <Text style={tosStyles.sectionDetail}>
          d) Harass, threaten, or harm other users;
        </Text>
        <Text style={tosStyles.sectionDetail}>
          e) Impersonate another person or entity;
        </Text>
        <Text style={tosStyles.sectionDetail}>
          f) Violate any applicable laws, rules, or regulations.
        </Text>
      <Text style={tosStyles.section}>
        3.2. BoilerMatch reserves the right to terminate or suspend your account without notice if you violate these rules or engage in any inappropriate behavior on the App.
      </Text>
      
      <Text style={tosStyles.heading}>
        4. User Accounts and User-Generated Contributions
      </Text>
      <Text style={tosStyles.section}>
        4.1. User Accounts:
      </Text>
        <Text style={tosStyles.sectionDetail}>
          a) To use the features of the App, you are required to create a user account. You are responsible for maintaining the confidentiality of your account credentials.
        </Text>
        <Text style={tosStyles.sectionDetail}>
          b) You agree to provide accurate, current, and complete information when creating your user account and to update such information as necessary to keep it accurate and complete.
        </Text>
      <Text style={tosStyles.section}>
        4.2. User-Generated Contributions:
      </Text>
        <Text style={tosStyles.sectionDetail}>
          a) Users may contribute content to the App, including but not limited to text, images, and other materials ("Contributions").
        </Text>
        <Text style={tosStyles.sectionDetail}>
          b) You retain ownership of your Contributions, but by submitting them to BoilerMatch, you grant BoilerMatch a worldwide, non-exclusive, royalty-free, transferable, sub-licensable license to use, store, display, reproduce, modify, adapt, create derivative works from, and distribute your Contributions in connection with the operation and promotion of the App.
        </Text>
        <Text style={tosStyles.sectionDetail}>
          c) You are solely responsible for your Contributions. BoilerMatch does not endorse or guarantee the accuracy, quality, or appropriateness of any Contributions posted on the App.
        </Text>
        <Text style={tosStyles.sectionDetail}>
          d) BoilerMatch reserves the right to remove or restrict access to any Contributions that violate these Terms or our content guidelines.
        </Text>

      <Text style={tosStyles.heading}>
        5. Termination
      </Text>
      <Text style={tosStyles.section}>
        5.1. BoilerMatch may terminate or suspend your account at any time, with or without notice, for any reason, including but not limited to violation of these Terms.
      </Text>

      <Text style={tosStyles.heading}>
        6. Disclaimer
      </Text>
      <Text style={tosStyles.section}>
        6.1. The App is provided "as-is" and "as available." BoilerMatch does not guarantee the accuracy, completeness, or availability of any information on the App.
      </Text>

      <Text style={tosStyles.heading}>
        7. Limitation of Liability
      </Text>
      <Text style={tosStyles.section}>
        7.1. BoilerMatch shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of the App, even if BoilerMatch has been advised of the possibility of such damages.
      </Text>

      <Text style={tosStyles.heading}>
        8. Changes to Terms
      </Text>
      <Text style={tosStyles.section}>
        8.1. BoilerMatch reserves the right to modify or update these Terms at any time. You are responsible for checking these Terms periodically for changes.
      </Text>

      <Text style={tosStyles.heading}>
        9. Contact Information
      </Text>
      <Text style={tosStyles.section}>
        9.1. If you have any questions or concerns about these Terms, please contact us at boilermatchproj@gmail.com.
      </Text>

      <Text style={tosStyles.heading}>
        10. Governing Law
      </Text>
      <Text style={tosStyles.section}>
        10.1. These Terms shall be governed by and construed in accordance with the laws of the state of Indiana, without regard to its conflict of law principles.
      </Text>

      <Text style={tosStyles.section}></Text>

      <Text style={tosStyles.section}>
        By using the BoilerMatch application, you acknowledge and agree to these Terms of Service. If you do not agree with these Terms, please do not register or use the App. BoilerMatch reserves the right to take appropriate action against users who violate these Terms or engage in any inappropriate conduct on the App.
      </Text>

      <Text style={tosStyles.section}>
        Thank you for using BoilerMatch!
      </Text>
    </View>
  )
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
        width: "40%",
        height: 50,
        backgroundColor: "gold",
        borderRadius: 6,
        justifyContent: 'center',
      },
      buttonText: {
        fontSize: 20,
        alignSelf: "center"
      },
      otherText: {
        fontSize: 16,
        paddingLeft: 5
      },
      inputFieldBox: {   
        flexDirection: 'row',
        height: 40,
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        borderColor: 'gold',
        borderWidth: 1,
        borderRadius: 5,        
      },
      inputField: {
        width: "100%",
      },
      title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 25,
        marginBottom: 30,
      },
      subtitle: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 8,
      },
      errorMes: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 10,
        marginBottom: 8,
        color: 'red',
        marginHorizontal: 'auto'
      }
  });

  const tosStyles = StyleSheet.create({
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      paddingVertical: 10
    },
    heading: {
      fontWeight: 'bold',
      fontSize: 16,
      paddingVertical: 10
    },
    section: {
      fontSize: 15,
      paddingVertical: 6
    },
    sectionDetail: {
      fontSize: 15,
      paddingVertical: 3,
      paddingLeft: 15
    }

  })



  