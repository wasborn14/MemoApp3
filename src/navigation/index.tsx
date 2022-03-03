import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';
import MemoListScreen from '../screens/MemoListScreen';
import MemoEditScreen, {MemoEditParams} from '../screens/MemoEditScreen';
import MemoCreateScreen from '../screens/MemoCreateScreen';
import MemoDetailScreen from '../screens/MemoDetailScreen';
import {MemoDetailParams} from '../screens/MemoDetailScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LogInScreen from '../screens/LogInScreen';

export type RootStackParamList = {
  SignUp: undefined;
  LogIn: undefined;
  MemoList: undefined;
  MemoEdit: MemoEditParams;
  MemoCreate: undefined;
  MemoDetail: MemoDetailParams;
};

const Stack = createStackNavigator<RootStackParamList>();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LogIn"
        screenOptions={{
          headerStyle: {backgroundColor: '#467FD3'},
          headerTitleStyle: {color: '#ffffff'},
          headerTitle: 'Memo App',
          headerTintColor: '#ffffff',
          headerBackTitle: 'Back',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="LogIn" component={LogInScreen} />
        <Stack.Screen name="MemoList" component={MemoListScreen} />
        <Stack.Screen name="MemoEdit" component={MemoEditScreen} />
        <Stack.Screen name="MemoCreate" component={MemoCreateScreen} />
        <Stack.Screen name="MemoDetail" component={MemoDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
