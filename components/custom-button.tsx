import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const CustomButton = ({ title, onPress, style, textStyle }: CustomButtonProps) => (
    <Pressable
        style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            style,
        ]}
        onPress={onPress}
        android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
    >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 16,
        backgroundColor: '#0F4C81',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0F4C81',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 3,
    },
    buttonPressed: {
        opacity: 0.92,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});

export default CustomButton;