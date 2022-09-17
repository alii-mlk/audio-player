import React, { createContext, useState } from 'react';


export const SongsContext = createContext();

const SongsContextProvider = (props) => {
    const [songs, setSongs] = useState(undefined)
    const setSongsHandler = (songs) => {
        setSongs(songs)
    }
    const likeHandler = (name) => {
        let _songs = [...songs]
        for (var i = 0; i < _songs.length; i++)
            _songs[i].isFavorite = false
        _songs.find(t => t.title == name).isFavorite = true
        setSongs(_songs)
    }
    const ratingHandler = (name, rating) => {
        let _songs = [...songs]
        _songs.find(t => t.title == name).rating = rating
        setSongs(_songs)
    }
    return (
        <SongsContext.Provider value={{ songs, setSongsHandler, likeHandler, ratingHandler }}>
            {props.children}
        </SongsContext.Provider>
    )
}
export default SongsContextProvider
