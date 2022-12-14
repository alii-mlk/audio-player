import React, { useEffect, useState, useContext } from 'react'
import Slider from '@react-native-community/slider'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageBackground,
} from 'react-native'
import TrackPlayer, {
    State,
    usePlaybackState,
    useProgress,
} from "react-native-track-player"

import { formatTime } from '../../utils/utils'
import { SongsContext } from '../Contexts/SongsContext'

export default function MusicPlayer({ item }) {
    const playbackState = usePlaybackState()
    const { position, duration } = useProgress()
    const [isSeeking, setIsSeeking] = useState(undefined)
    const [seek, setSeek] = useState(undefined)
    const { likeHandler } = useContext(SongsContext);

    useEffect(() => {
        setupPlayer(item)
        return () => {
            TrackPlayer.reset();
        }
    }, [])

    const setupPlayer = async (item) => {
        await TrackPlayer.reset();
        var track = {
            url: item.audio,
            title: item.title,
            artwork: item.cover,
            duration: item.totalDurationMs
        };
        await TrackPlayer.add([track])
    }

    const togglePlayback = async (playbackState, item) => {
        const currentTrack = await TrackPlayer.getCurrentTrack()
        if (currentTrack !== null) {
            // when track ends playback state changes to stop and player doesn't work so we have to reset the player and then add the track again
            if (playbackState === State.Stopped) {
                await setupPlayer(item)
            }
            if (playbackState === State.Paused || playbackState === State.Ready) {
                await TrackPlayer.play()
            }
            else {
                await TrackPlayer.pause()
            }
        }
    }

    return (
        <View style={styles.container}>

            <ImageBackground source={{ uri: item.cover }} style={styles.artworkImage}>

                <View style={styles.imageWrapper}>
                    <TouchableOpacity onPress={() => togglePlayback(playbackState, item)}>
                        <Image
                            style={styles.toggleIcon}
                            source={
                                playbackState == State.Playing ? require('../../assets/Logos/audio/pause.png')
                                    : require('../../assets/Logos/audio/play.png')} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={{
                        flex: 1, alignItems: 'flex-end',
                    }}
                    onPress={() => likeHandler(item.title)}
                >
                    <Image
                        style={{ width: 50, height: 50, backgroundColor: 'rgba(230,230,230,0.3)' }}
                        source={item.isFavorite ? require('../../assets/Logos/heart/heart-filled-black.png') : require('../../assets/Logos/heart/heart-line-black.png')}
                    />
                </TouchableOpacity>
            </ImageBackground>

            <Text style={styles.title}>{item.title}</Text>
            <Slider
                style={{
                    width: 320,
                    height: 40,
                    Left: 0,
                }}
                minimumValue={0}
                value={position}
                onValueChange={(value) => {
                    setIsSeeking(true);
                    setSeek(value);
                }}
                maximumValue={Math.floor(duration)}
                minimumTrackTintColor="#FFD369"
                onSlidingComplete={(value) => {
                    TrackPlayer.seekTo(value);
                    TrackPlayer.play().then(() => {
                        setTimeout(() => {
                            setIsSeeking(false);
                        }, 1000);
                    });
                }}
                maximumTrackTintColor="#808080"
                thumbTintColor="#FFD369"
            />

            <View style={styles.progressLabelContainer}>
                <Text style={styles.progressLabelText}>{formatTime(position)}</Text>
                <Text>&nbsp;/&nbsp;</Text>
                <Text style={styles.progressLabelText}>{formatTime(duration)}</Text>
            </View>


        </View>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column' },
    artworkImage: {
        width: 300,
        height: 300,
        marginTop: 50,
    },
    imageWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 300, height: 250,
        paddingTop: 30
    },

    title: {
        textAlign: 'center',
        marginVertical: 5,
        fontSize: 20
    },
    progressLabelContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    progressLabelText: {
        fontWeight: "bold",
        fontSize: 20
    },
    toggleIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFD369'
    }
})