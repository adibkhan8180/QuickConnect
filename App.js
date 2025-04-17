import React from 'react';
import StackNavigator from './navigation/StackNavigator';
import {AuthProvider} from './AuthContext';

function App() {
  // mongodb+srv://adibkhan8180:<db_password>@cluster0.rkgtbq9.mongodb.net/
  return (
    <AuthProvider>
      <StackNavigator />
    </AuthProvider>
  );
}

export default App;
