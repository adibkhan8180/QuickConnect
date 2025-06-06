import {StyleSheet, Text, View, SafeAreaView, FlatList} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../AuthContext';
import User from '../components/User';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../store/constant';

const PeopleScreen = () => {
  const [users, setUsers] = useState([]);
  const {token, userId} = useContext(AuthContext);
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  console.log('users', users);
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 15,
            fontWeight: '500',
            marginTop: 12,
          }}>
          People using Quick Connect
        </Text>
      </View>
      <FlatList
        data={users}
        renderItem={({item}) => <User item={item} key={item?._id} />}
      />
    </SafeAreaView>
  );
};

export default PeopleScreen;

const styles = StyleSheet.create({});
