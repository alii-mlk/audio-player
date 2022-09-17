import React, { useContext } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, Platform } from 'react-native'
import { SongsContext } from '../Contexts/SongsContext';

export default function Rating({ isClickable, rate, name }) {
    const { ratingHandler } = useContext(SongsContext);

    let views = []
    if (isClickable) {
        for (var i = 0; i < 5; i++) {
            let ii = i
            views.push(
                <TouchableOpacity
                    key={ii}
                    onPress={() => {
                        let rating = ii + 1
                        ratingHandler(name, rating)
                    }}
                >
                    <Image
                        style={styles.stars}
                        source={ii < rate ? require('../../assets/Logos/star/star-filled-black.png') : require('../../assets/Logos/star/star-line-black.png')}
                    />
                </TouchableOpacity>
            )
        }
    }
    else {
        for (var i = 0; i < 5; i++) {
            views.push(<Image
                key={i}
                style={styles.stars}
                source={i < rate ? require('../../assets/Logos/star/star-filled-black.png') : require('../../assets/Logos/star/star-line-black.png')}
            />)

        }
    }
    return (
        <View style={styles.wrapper}>
            {views}
        </View>

    )
}
const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        margin: 5,
    },
    stars: {
        width: 20,
        height: 20,
        margin: 1,
        backgroundColor: 'rgba(230,230,230,0.3)',
        borderRadius:20
    }
})