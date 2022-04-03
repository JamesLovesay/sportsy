import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Alert,
  Keyboard,
  Image, ScrollView,
} from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { UserContext } from '../contexts/UserContext';
import GlobalStyles from '../constants/styles/GlobalStyles';
import { auth, db } from '../firebase';

function ProfileEditScreen() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  const updateSuccessAlert = () => Alert.alert('Message', 'Profile successfully updated', [
    {
      text: 'OK',
      onPress: () => {
        Keyboard.dismiss();
      },
    },
  ]);

  const apiString = 'https://api.postcodes.io/postcodes';
  const FetchPostcode = (query) => fetch(`${apiString}/${query}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },

  })
    .then((res) => {
      const apiResult = res.json();
      return apiResult;
    })
    .then((data) => {
      const userPostcode = data.result.postcode;
      const { latitude } = data.result;
      const { longitude } = data.result;
      const region = data.result.nuts;
      const userLocation = [userPostcode, latitude, longitude, region];
      return userLocation;
    })
    .catch((err) => {
      alert(err);
    });

  const handleUpdate = () => {
    const docRef = doc(db, 'users', auth.currentUser.uid);
    if (loggedInUser.location === '') {
      const fieldsToUpdate = {
        name: loggedInUser.name,
        username: loggedInUser.username,
        DOB: loggedInUser.DOB,
        locationArray: loggedInUser.locationArray,
        avatar: loggedInUser.avatar,
        location: locationArray[0],
      };
      updateDoc(docRef, fieldsToUpdate).then(() => {
        updateSuccessAlert();
      })
        .catch((err) => alert(err));
    } else {
      FetchPostcode(loggedInUser.location).then((locationArray) => {
        const fieldsToUpdate = {
          name: loggedInUser.name,
          username: loggedInUser.username,
          DOB: loggedInUser.DOB,
          locationArray,
          location: locationArray[0],
          avatar: loggedInUser.avatar,
        };
        updateDoc(docRef, fieldsToUpdate).then(() => {
          updateSuccessAlert();
        })
          .catch((err) => alert(err));
      }).catch(() => alert('That postcode is not valid.'));
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} behavior="padding" enabled keyboardVerticalOffset={70}>
      <ScrollView>

        <View style={styles.container}>
          <View style={{ ...styles.inputContainer, ...GlobalStyles.utilMarginTop }}>
            <View style={{ alignItems: 'center' }}>
              <Image
                style={{ ...styles.userImg, ...GlobalStyles.utilMarginTop10 }}
                source={{ uri: loggedInUser.avatar }}
              />
              <Text style={{
                marginTop: 10, fontSize: 18, fontWeight: 'bold', textTransform: 'capitalize',
              }}
              >
                {loggedInUser ? loggedInUser.name : ''}
              </Text>
            </View>

            <TextInput
              placeholder="Name"
              placeholderTextColor="#666666"
              autoCorrect={false}
              value={loggedInUser ? loggedInUser.name : ''}
              onChangeText={(txt) => setLoggedInUser({ ...loggedInUser, name: txt })}
              style={styles.textInput}
            />

            <TextInput
              placeholder="Username"
              placeholderTextColor="#666666"
              value={loggedInUser ? loggedInUser.username : ''}
              onChangeText={(txt) => setLoggedInUser({ ...loggedInUser, username: txt })}
              autoCorrect={false}
              style={styles.textInput}
            />

            <TextInput
              multiline
              numberOfLines={3}
              placeholder="DOB"
              placeholderTextColor="#666666"
              value={loggedInUser ? loggedInUser.DOB : ''}
              onChangeText={(txt) => setLoggedInUser({ ...loggedInUser, DOB: txt })}
              autoCorrect
              style={[styles.textInput, { height: 40 }]}
            />

            <TextInput
              placeholder="Avatar URL"
              placeholderTextColor="#666666"
              autoCorrect={false}
              value={loggedInUser ? loggedInUser.avatar : ''}
              onChangeText={(txt) => setLoggedInUser({ ...loggedInUser, avatar: txt })}
              style={styles.textInput}
            />

            <TextInput
              placeholder="Postcode"
              placeholderTextColor="#666666"
              autoCorrect={false}
              value={loggedInUser ? loggedInUser.location : ''}
              onChangeText={(txt) => setLoggedInUser({ ...loggedInUser, location: txt })}
              style={styles.textInput}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleUpdate}
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ProfileEditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
  },
  textInput: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#63CDAB',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#63CDAB',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#63CDAB',
    fontWeight: '700',
    fontSize: 16,
  },
  userImg: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    width: 150,
    borderRadius: 75,
    marginTop: 10,
  },
});
