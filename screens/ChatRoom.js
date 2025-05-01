import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {AuthContext} from '../AuthContext';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {useSocketContext} from '../SocketContext';
import {BASE_URL} from '../store/constant';

const ChatRoom = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const {token, userId, setToken, setUserId} = useContext(AuthContext);
  const {socket} = useSocketContext();
  const scrollViewRef = useRef();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, [messages]);

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
  const listeMessages = () => {
    const {socket} = useSocketContext();

    useEffect(() => {
      socket?.on('newMessage', newMessage => {
        newMessage.shouldShake = true;
        setMessages([...messages, newMessage]);
      });

      return () => socket?.off('newMessage');
    }, [socket, messages, setMessages]);
  };

  listeMessages();
  const sendMessage = async (senderId, receiverId) => {
    try {
      await axios.post(`${BASE_URL}/sendMessage`, {
        senderId,
        receiverId,
        message,
      });

      socket.emit('sendMessage', {senderId, receiverId, message});

      setMessage('');

      setTimeout(() => {
        fetchMessages();
      }, 100);
    } catch (error) {
      console.log('Error', error);
    }
  };
  const fetchMessages = async () => {
    try {
      const senderId = userId;
      const receiverId = route?.params?.receiverId;

      const response = await axios.get(`${BASE_URL}/messages`, {
        params: {senderId, receiverId},
      });

      setMessages(response.data);
    } catch (error) {
      console.log('Error', error);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, []);
  console.log('messages', messages);
  const formatTime = time => {
    const options = {hour: 'numeric', minute: 'numeric'};
    return new Date(time).toLocaleString('en-US', options);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#EEE'}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 70}>
        <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({animated: true})
          }>
          {messages?.map((item, index) => (
            <Pressable
              key={index}
              style={[
                item?.senderId?._id === userId
                  ? {
                      alignSelf: 'flex-end',
                      backgroundColor: '#005c4b',
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      maxWidth: '60%',
                      borderRadius: 7,
                      margin: 10,
                    }
                  : {
                      alignSelf: 'flex-start',
                      backgroundColor: '#1d282f',
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      margin: 10,
                      borderRadius: 7,
                      maxWidth: '60%',
                    },
              ]}>
              <Text style={{fontSize: 13, textAlign: 'left', color: '#e0e4e7'}}>
                {item?.message}
              </Text>
              <Text
                style={{
                  textAlign: 'right',
                  fontSize: 9,
                  color: '#a5aaad',
                  marginTop: 4,
                }}>
                {formatTime(item?.timeStamp)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View
          style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: '#dddddd',
            paddingBottom: 25,
          }}>
          <Ionicons name="happy-outline" size={24} color="gray" />

          <TextInput
            placeholder="Type your message..."
            placeholderTextColor={'gray'}
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
            onPress={() =>
              message && sendMessage(userId, route?.params?.receiverId)
            }
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
    </SafeAreaView>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({});
