import React from 'react';
import {NavigationContainer, NavigatorScreenParams} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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
  MainTab: NavigatorScreenParams<MemoStackPramList>;
};

export type MemoStackPramList = {
  MemoList: undefined;
  MemoEdit: MemoEditParams;
  MemoCreate: undefined;
  MemoDetail: MemoDetailParams;
};

export type MainTabNavigation = StackNavigationProp<RootStackParamList>;

const RootStack = createStackNavigator<RootStackParamList>();
const MemoStack = createStackNavigator<MemoStackPramList>();
const Tab = createBottomTabNavigator();

const MemoStackNavigator = () => {
  return (
    <MemoStack.Navigator
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
      <MemoStack.Screen name="MemoList" component={MemoListScreen} />
      <MemoStack.Screen name="MemoEdit" component={MemoEditScreen} />
      <MemoStack.Screen name="MemoCreate" component={MemoCreateScreen} />
      <MemoStack.Screen name="MemoDetail" component={MemoDetailScreen} />
    </MemoStack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        lazy: false,
        tabBarLabelStyle: {fontWeight: 'bold'},
        tabBarActiveTintColor: '#262928',
        tabBarInactiveTintColor: '#D4D4D4',
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name="Memo" component={MemoStackNavigator} />
    </Tab.Navigator>
  );
};

export const Navigation = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="LogIn"
        screenOptions={{
          headerStyle: {backgroundColor: '#467FD3'},
          headerTitleStyle: {color: '#ffffff'},
          headerTitle: 'Memo App',
          headerTintColor: '#ffffff',
          headerBackTitle: 'Back',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureEnabled: false,
          gestureDirection: 'horizontal',
        }}
      >
        <RootStack.Screen name="LogIn" component={LogInScreen} />
        <RootStack.Screen name="SignUp" component={SignUpScreen} />
        <RootStack.Screen name="MainTab" component={MainTabNavigator} options={
            {
                headerShown: false,
            }
        }/>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
