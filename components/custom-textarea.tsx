import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

const CustomTextarea = (props: TextInputProps & { containerStyle?: ViewStyle }) => {
    const { containerStyle, ...inputProps } = props;
    return (
        <View style={containerStyle}>
            <TextInput
                {...inputProps} // Pass all other props like placeholder, keyboardType, etc.
                multiline={true}
                numberOfLines={4}
                placeholder="Enter your message here..."
                style={styles.inputContainer}
                value={props.value}
                onChangeText={props.onChangeText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        height: 150,
        justifyContent: "flex-start",
        textAlignVertical: 'top', // Fix for Android alignment
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        fontSize: 16,
        padding: 5,
    },

    textInputError: {
        borderColor: 'red',
        padding: 10,
        fontSize: 16,
        borderRadius: 5,
        color: 'black', // Ensure the text is visible
    },
    textInput: {
        borderColor: '#ccc',
        padding: 10,
        fontSize: 16,
        borderRadius: 5,
        color: 'black', // Ensure the text is visible
    },
});

export default CustomTextarea;
