import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

type Props = {
    isLoading: boolean;
};

const Loading: React.FC<Props> = ({isLoading}) => {
    return (
        <>
            {isLoading && (
                <View style={styles.container}>
                    <View style={styles.inner}>
                        <ActivityIndicator size="large" color="#000000" />
                    </View>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 5,
    },
    inner: {
        marginBottom: 80,
    },
});

export default Loading;
