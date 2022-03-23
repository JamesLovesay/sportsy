import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileEditScreen from '../screens/ProfileEditScreen';

const Stack = createNativeStackNavigator();

export default function GlobalStack() {
  return (

    <Stack.Navigator>
      <Stack.Screen name="editProfile" component={ProfileEditScreen} />
    </Stack.Navigator>

  );
}
