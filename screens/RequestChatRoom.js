import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import React, {useContext, useLayoutEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AuthContext} from '../AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {BASE_URL} from '../store/constant';

const RequestChatRoom = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const {token, userId, setToken, setUserId} = useContext(AuthContext);
  const route = useRoute();
  useLayoutEffect(() => {
    return navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View>
            <Text>{route?.params?.name}</Text>
          </View>
        </View>
      ),
    });
  }, []);
  console.log('userId', userId);
  console.log('Rec', route?.params.receiverId);
  const sendMessage = async () => {
    try {
      const userData = {
        senderId: userId,
        receiverId: route?.params?.receiverId,
        message: message,
      };

      const response = await axios.post(`${BASE_URL}/sendrequest`, userData);
      if (response.status == 200) {
        setMessage('');
        Alert.alert(
          'Your request has been shared',
          'wait for the user to accept your request',
        );
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <KeyboardAvoidingView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView></ScrollView>

      <View
        style={{
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: '#dddddd',
          marginBottom: 20,
        }}>
        <Ionicons name="happy-outline" size={24} color="gray" />

        <TextInput
          placeholder="type your message..."
          value={message}
          onChangeText={setMessage}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: '#ddddd',
            borderRadius: 20,
            paddingHorizontal: 10,
            marginLeft: 10,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginHorizontal: 8,
          }}>
          <Ionicons name="camera-outline" size={24} color="gray" />

          <Ionicons name="mic-outline" size={24} color="gray" />
        </View>

        <Pressable
          onPress={sendMessage}
          style={{
            backgroundColor: '#0066b2',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
          }}>
          <Text style={{textAlign: 'center', color: 'white'}}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RequestChatRoom;

const styles = StyleSheet.create({});
