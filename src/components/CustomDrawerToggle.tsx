// CustomDrawerToggle.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  navigation: any; // o puedes tiparlo mejor con NavigationProp si usas @react-navigation
}

const CustomDrawerToggle: React.FC<Props> = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
      <Ionicons name="menu" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default CustomDrawerToggle;
