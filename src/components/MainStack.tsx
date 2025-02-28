import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";
import { LoginScreen } from "../screens/LoginScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ClassesScreen } from "../screens/ClassesScreen";
import { ProgressScreen } from "../screens/ProgressScreen";

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => (
  <BaseNavigationContainer>
    <StackNavigator.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4299e1",
        },
        headerTintColor: "white",
        headerShown: true,
      }}
    >
      <StackNavigator.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <StackNavigator.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "GYM APP" }}
      />
      <StackNavigator.Screen
        name="Classes"
        component={ClassesScreen}
        options={{ title: "Available Classes" }}
      />
      <StackNavigator.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ title: "My Progress" }}
      />
    </StackNavigator.Navigator>
  </BaseNavigationContainer>
);