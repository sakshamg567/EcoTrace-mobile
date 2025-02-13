import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'
import {Tabs, Redirect} from "expo-router";

import {icons} from "../../constants"
import { StatusBar } from 'expo-status-bar';

const TabIcon = ({icon, color, name, focused}) => {
   return(
      <View className='items-center justify-center gap-2'>
         <Image
            source={icon}
            resizeMode='contain'
            tintColor={color}
            className='w-6 h-6'
         />
      </View>
   )
}

const TabsLayout = () => {
   return (
      <>
         <Tabs screenOptions={{
            tabBarActiveTintColor: '#10a326',
            headerShown: false
            // tabBarInactiveTintColor: '#2588d9'
         }}>
            <Tabs.Screen
               
               name='Home'
               options={{
                  title: "Home",
                  headerShown: false,
                  tabBarIcon: ({color, focused}) => (
                     <TabIcon
                        icon={icons.home}
                        color={color}
                        name={"Home"}
                        focused={focused}
                     />
               
                  )
               }}
            />
            <Tabs.Screen
               name='LeaderBoard'
               options={{
                  title: "LeaderBoard",
                  headerShown: false,
                  tabBarIcon: ({color, focused}) => (
                     <TabIcon
                        icon={icons.leaderboard}
                        color={color}
                        name={"LeaderBoard"}
                        focused={focused}
                     />
               
                  )
               }}
            />
            <Tabs.Screen
               name='ProductAgent'
               options={{
                  title: "ProductAgent",
                  headerShown: false,
                  tabBarIcon: ({color, focused}) => (
                     <TabIcon
                        icon={icons.search}
                        color={color}
                        name={"ProductAgent"}
                        focused={focused}
                     />
               
                  )
               }}
            />

         </Tabs>
         <StatusBar style='dark'/>
      </>
   )
}

export default TabsLayout

const styles = StyleSheet.create({})