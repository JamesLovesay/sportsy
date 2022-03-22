import * as React from 'react';
import { View, Text } from 'react-native';

export default function CreateAccountScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Header />
      <Text
        onPress={() => navigation.navigate('Home')}
        style={{ fontSize: 26, fontWeight: 'bold' }}
      >
        Create Account

      </Text>
    </View>
  );
}
