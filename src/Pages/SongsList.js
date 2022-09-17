import React, { useEffect, useRef, useState, useContext } from 'react'
import { ActivityIndicator, Button, FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MAIN_API } from '../../utils/main_api';
import Rating from '../Components/Rating';
import { SongsContext } from '../Contexts/SongsContext';

export default function SongsList({ navigation }) {
  const [err, setErr] = useState(undefined)
  const apiCall = useRef(undefined)
  const [loading, setLoading] = useState(true)
  const { songs, setSongsHandler, likeHandler } = useContext(SongsContext);

  useEffect(() => {
    const interval = setInterval(() => {
      getManifest()
    }, 30000);
    return () => {
      clearInterval(interval)
      if (apiCall.current !== undefined) {
        apiCall.current.cancel()
      }
    }
  }, [])
  const getManifest = async () => {
    try {
      apiCall.current = MAIN_API.request({
        path: '/manifest.json',
        method: 'get'
      })
      const response = await apiCall.current.promise
      if (!response.isSuccess)
        throw response
      let _songs = [...response.data]
      let len = _songs.length
      for (var i = 0; i < len; i++) {
        _songs[i].isFavorite = false
        _songs[i].rating = 0
      }
      if (songs && songs.length !== 0) {
        let isChanged = compareStates(songs, _songs)
        if (isChanged)
          setSongsHandler(_songs)
      }
      else setSongsHandler(_songs)
    }
    catch (err) {
      console.log(err)
      setErr("Failed to load songs.")
      setLoading(false)
    }
  }
  useEffect(() => {
    if (songs !== undefined) {
      setLoading(false)
    }
  }, [songs])
  const compareStates = (oldState, newState) => {
    if (oldState.length != newState.length)
      return true;
    for (var i = 0; i < oldState.length; i++) {
      var keys = Object.keys(oldState[i]);
      for (var j = 0; j < keys.length; j++) {
        var oldVal = oldState[i][keys[j]];
        var newVal = newState[i][keys[j]];
        if (oldVal != newVal)
          return true;
      }
    }
    return false;
  }
  return (
    <View style={styles.container}>
      {loading ? <View style={styles.alignCenterContainer}><ActivityIndicator size="large" /></View> :
        err ? <View style={styles.alignCenterContainer}><Text style={{ color: 'red' }}>{err}</Text></View> :
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={songs}
            renderItem={({ item }) => (

              <View style={{ borderColor: 'black', borderStyle: 'solid', borderWidth: 1, margin: 5 }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SingleSong', { item: item })}
                >
                  <ImageBackground
                    source={{ uri: item.cover }}
                    style={{ flex: 1, width: '100%', height: 300 }}>

                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <Rating rate={item.rating} isClickable={false} />
                    </View>

                  </ImageBackground>
                </TouchableOpacity>

                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <View style={{ flex: 1 }} />
                  <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                    <Text style={{ fontSize: 20 }}>
                      {item.title}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{ flex: 1, alignItems: 'flex-end' }}
                    onPress={() => likeHandler(item.title)}
                  >
                    <Image
                      style={{ width: 40, height: 40, margin: 5 }}
                      source={item.isFavorite ? require('../../assets/Logos/heart/heart-filled-black.png') : require('../../assets/Logos/heart/heart-line-black.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>

            )}
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  alignCenterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    flex: 1,
    width: '100%',
    height: 200
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 50,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0"
  }

})