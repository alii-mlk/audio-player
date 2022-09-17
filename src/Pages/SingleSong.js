import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import MusicPlayer from '../Components/MusicPlayer';
import Rating from '../Components/Rating';
import { SongsContext } from '../Contexts/SongsContext';

export default function SingleSong({ navigation, route }) {
    const [song, setSong] = useState(undefined)
    const { songs } = useContext(SongsContext);
    const [loading, setLoading] = useState(true)
    // insted of the below useEffect logic, that would be possible to use route.params.item in rendering but after submiting the rating, stars view wouldn't change.
    useEffect(() => {
        let _songs = [...songs]
        const len = _songs.length
        for (var i = 0; i < len; i++) {
            if (route.params.item.title == _songs[i].title) {
                setSong(_songs[i])
                setLoading(false)
                break
            }
        }
    }, [songs])


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {loading ? <View style={styles.alignCenterContainer}><ActivityIndicator size="large" /></View> :
                <View>
                    <MusicPlayer item={song} />
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
                        <Rating isClickable={true} name={song.title} rate={song.rating} />
                    </View>
                </View>
            }
        </View>
    );
}
const styles = StyleSheet.create({
    alignCenterContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})