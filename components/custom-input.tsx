import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

const CustomInput = (props: TextInputProps & { containerStyle?: ViewStyle }) => {
    const { containerStyle, ...inputProps } = props;
    return (
        <View style={containerStyle}>
            <TextInput
                {...inputProps} // Pass all other props like placeholder, keyboardType, etc.
                style={styles.textInput}
                value={props.value}
                onChangeText={props.onChangeText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#eee',
        padding: 5,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 8,
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

export default CustomInput;
