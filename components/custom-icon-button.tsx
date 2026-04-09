import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native';

interface CustomIconButtonProps {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const CustomIconButton = ({ icon, onPress, style, textStyle }: CustomIconButtonProps) => (
    <Pressable style={[styles.button, style]} onPress={onPress}>
        <Ionicons
            name={icon}
            color="white"
            size={24}
        />
    </Pressable>
);

const styles = StyleSheet.create({
    button: {
        padding: 5,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 10
    },
});

export default CustomIconButton;