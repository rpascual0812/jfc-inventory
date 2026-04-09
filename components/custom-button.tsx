import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const CustomButton = ({ title, onPress, style, textStyle }: CustomButtonProps) => (
    <Pressable style={[styles.button, style]} onPress={onPress}>
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    button: {
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: '#2196F3', // Default color
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20
    },
});

export default CustomButton;