import * as React from 'react';
import * as ReactNativeScript from 'react-nativescript';
import { MainStack } from './components/MainStack';
import { initializeFirebase } from './services/firebase';
import { createDrawerNavigator, DrawerToggleButton } from '@react-navigation/drawer';


Object.defineProperty(global, '__DEV__', { value: false });

// Initialize Firebase
initializeFirebase().catch(console.error);

ReactNativeScript.start(React.createElement(MainStack, {}, null));