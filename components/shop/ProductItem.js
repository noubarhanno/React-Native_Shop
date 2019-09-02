import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import Card from '../UI/Card';

const ProductItem = props => {
    let TouchableComp = TouchableOpacity;

    if (Platform.OS==='android' && Platform.Version >= 21){
        TouchableComp = TouchableNativeFeedback;
    }
    // useForeground is used to make the touchableNativeFeedback for the entire component including the image
    return (
        <TouchableComp onPress={props.onSelect} useForeground>
            <Card style={styles.product}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{uri: props.image}}/>
                </View>
                <View style={styles.details}>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.price}>${props.price.toFixed(2)}</Text>
                </View>
                <View style={styles.actions}>
                   {props.children}
                </View>
            </Card>
        </TouchableComp>
    );
};

const styles = StyleSheet.create({
    product: {
        height: 300,
        margin: 20,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    imageContainer: {
        width: '100%',
        height: '60%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        overflow: 'hidden'
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginVertical: 2
    },
    price: {
        fontFamily: 'open-sans',
        fontSize: 14,
        color: '#888'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '25%',
        paddingHorizontal: 20,
    },
    details: {
        alignItems: 'center',
        height: '17%',
        padding: 10
    }
});

export default ProductItem;