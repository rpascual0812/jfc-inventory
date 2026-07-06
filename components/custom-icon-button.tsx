import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

interface CustomIconButtonProps {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    onPress: () => void;
    style?: ViewStyle;
}

const CustomIconButton = ({ icon, onPress, style }: CustomIconButtonProps) => (
    <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
        onPress={onPress}
        android_ripple={{ color: 'rgba(255,255,255,0.18)' }}
    >
        <Ionicons name={icon} color="white" size={20} />
    </Pressable>
);

const styles = StyleSheet.create({
    button: {
        padding: 12,
        borderRadius: 14,
        backgroundColor: '#0F4C81',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0F4C81',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 3,
    },
    pressed: {
        opacity: 0.86,
    },
});

export default CustomIconButton;