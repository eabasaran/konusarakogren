/**
 * Konuşarak Öğren - AI Destekli Chat Uygulaması
 * Mobile React Native App
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import ChatScreen from './src/screens/ChatScreen';

function App(): React.JSX.Element {
  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#fff" 
        translucent={false}
      />
      <ChatScreen />
    </>
  );
}

export default App;
