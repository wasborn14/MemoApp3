import React from 'react';
import {NavigationContainer, NavigatorScreenParams} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MemoListScreen from '../screens/memo/MemoListScreen';
import MemoEditScreen, {MemoEditParams} from '../screens/memo/MemoEditScreen';
import MemoCreateScreen from '../screens/memo/MemoCreateScreen';
import MemoDetailScreen from '../screens/memo/MemoDetailScreen';
import {MemoDetailParams} from '../screens/memo/MemoDetailScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LogInScreen from '../screens/LogInScreen';
import {SettingScreen} from '../screens/SettingScreen';
import TaskListContainer from '../screens/task/list';
import {Foundation} from '@expo/vector-icons';
import {SimpleLineIcons} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import GraphTopContainer from '../screens/graph/top';

export type RootStackParamList = {
  SignUp: undefined;
  LogIn: undefined;
  MainTab: NavigatorScreenParams<MainStackParamList>;
};

export type MainStackParamList = {
  Memo: NavigatorScreenParams<MemoStackPramList>;
  Task: NavigatorScreenParams<TaskStackPramList>;
  Set: NavigatorScreenParams<SettingStackParamList>;
};

export type MemoStackPramList = {
  MemoList: undefined;
  MemoEdit: MemoEditParams;
  MemoCreate: undefined;
  MemoDetail: MemoDetailParams;
};

export type TaskStackPramList = {
  TaskList: undefined;
};

export type GraphStackPramList = {
  GraphTop: undefined;
};

export type SettingStackParamList = {
  Setting: undefined;
};

export type MainTabNavigation = StackNavigationProp<RootStackParamList>;
export type MemoTabNavigation = StackNavigationProp<MemoStackPramList>;
export type TaskTabNavigation = StackNavigationProp<TaskStackPramList>;
export type GraphTabNavigation = StackNavigationProp<GraphStackPramList>;

const RootStack = createStackNavigator<RootStackParamList>();
const MemoStack = createStackNavigator<MemoStackPramList>();
const TaskStack = createStackNavigator<TaskStackPramList>();
const GraphStack = createStackNavigator<GraphStackPramList>();
const SetStack = createStackNavigator<SettingStackParamList>();
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

const TaskStackNavigator = () => {
  return (
    <TaskStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#FFDDAA'},
        headerTitleStyle: {color: '#000000'},
        headerTitle: 'Task',
        headerTintColor: '#ffffff',
        headerBackTitle: 'Back',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <TaskStack.Screen name="TaskList" component={TaskListContainer} />
    </TaskStack.Navigator>
  );
};

const GraphStackNavigator = () => {
  return (
    <GraphStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#FFDDAA'},
        headerTitleStyle: {color: '#000000'},
        headerTitle: 'Graph',
        headerTintColor: '#ffffff',
        headerBackTitle: 'Back',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <GraphStack.Screen name="GraphTop" component={GraphTopContainer} />
    </GraphStack.Navigator>
  );
};

const SetStackNavigator = () => {
  return (
    <SetStack.Navigator
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
      <SetStack.Screen name="Setting" component={SettingScreen} />
    </SetStack.Navigator>
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
      <Tab.Screen
        name="Task"
        component={TaskStackNavigator}
        options={{
          tabBarLabel: 'Task',
          tabBarIcon: ({focused}) =>
            focused ? (
              <MaterialCommunityIcons name="human-greeting" size={24} color="black" />
            ) : (
              <MaterialCommunityIcons name="human-greeting" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Graph"
        component={GraphStackNavigator}
        options={{
          tabBarLabel: 'Graph',
          tabBarIcon: ({focused}) =>
            focused ? (
              <Foundation name="graph-horizontal" size={24} color="black" />
            ) : (
              <Foundation name="graph-horizontal" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Memo"
        component={MemoStackNavigator}
        options={{
          tabBarLabel: 'Memo',
          tabBarIcon: ({focused}) =>
            focused ? (
              <SimpleLineIcons name="note" size={24} color="black" />
            ) : (
              <SimpleLineIcons name="note" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Set"
        component={SetStackNavigator}
        options={{
          tabBarLabel: 'Set',
          tabBarIcon: ({focused}) =>
            focused ? (
              <SimpleLineIcons name="settings" size={24} color="black" />
            ) : (
              <SimpleLineIcons name="settings" size={24} color="black" />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export const Navigation = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="LogIn"
        screenOptions={{
          headerStyle: {backgroundColor: '#FFDDAA'},
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
        <RootStack.Screen
          name="MainTab"
          component={MainTabNavigator}
          options={{
            headerShown: false,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
