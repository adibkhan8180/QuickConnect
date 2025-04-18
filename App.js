import React from 'react';
import StackNavigator from './navigation/StackNavigator';
import {AuthProvider} from './AuthContext';
import {SocketContextProvider} from './SocketContext';

function App() {
  // mongodb+srv://adibkhan8180:<db_password>@cluster0.rkgtbq9.mongodb.net/
  return (
    <AuthProvider>
      <SocketContextProvider>
        <StackNavigator />
      </SocketContextProvider>
    </AuthProvider>
  );
}

export default App;
