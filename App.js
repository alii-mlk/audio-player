import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SongsList from './src/Pages/SongsList';
import SingleSong from './src/Pages/SingleSong';
import TrackPlayer from 'react-native-track-player';
import SongsContextProvider from './src/Contexts/SongsContext';


const Stack = createNativeStackNavigator();

function App() {
  useEffect(() => {
    TrackPlayer.setupPlayer()
  })
  return (
    <SongsContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Skoovin"
          screenOptions={{
            headerTitleAlign: 'center'
          }}>
          <Stack.Screen name="Home" component={SongsList} />
          <Stack.Screen name="SingleSong" component={SingleSong}
            options={({ route }) => ({
              title: route.params.item.title,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SongsContextProvider>

  );
}
export default App;