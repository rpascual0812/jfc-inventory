import Entypo from "@expo/vector-icons/Entypo";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Toast, { BaseToast, BaseToastProps } from 'react-native-toast-message';

import ProductModal from './product-modal';

const CustomHeader = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = (status: boolean) => {
        setModalVisible(status);
    };

    const handleAddProduct = () => {
        setModalVisible(true);
    }

    const newProductSubmitted = () => {
        setModalVisible(false);
        Toast.show({
            type: 'success', // or 'error', 'info'
            text1: 'Success',
            text2: 'Product saved successfully!',
            visibilityTime: 4000, // duration in milliseconds
        });
    }

    const toastConfig = {
        success: (props: BaseToastProps) => (
            <BaseToast
                {...props}
                // Optional: styling for the whole toast container
                style={{ borderLeftColor: 'pink' }}
                contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 10 }}
                // Key step: increase the font size here
                text1Style={{
                    fontSize: 20, // <-- Set your desired font size
                    fontWeight: 'bold',
                }}
                text2Style={{
                    fontSize: 16, // <-- Set your desired font size for the second line
                }}
                text1NumberOfLines={0} // Default to unlimited lines for all error toasts
                text2NumberOfLines={5}
            />
        ),
        // Add configurations for other types (error, info) as needed
    };

    return (
        // <SafeAreaView style={{ backgroundColor: "#cf240a" }}>
        <View
            style={{
                backgroundColor: "#cf240a",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: 90,
                paddingHorizontal: 10,
                paddingTop: 30,
            }}
        >
            <TouchableOpacity onPress={() => alert("Left button pressed")}>
                {/* <Text style={{ color: "white" }}>Left</Text> */}
            </TouchableOpacity>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                {process.env.EXPO_PUBLIC_APP_NAME}
            </Text>
            <TouchableOpacity onPress={handleAddProduct}>
                {/* <Text style={{ color: "white" }}>Right</Text> */}
                <Entypo name="circle-with-plus" size={32} color="white" />
            </TouchableOpacity>

            <ProductModal
                isModalVisible={modalVisible}
                closeModal={() => toggleModal(false)}
                submitted={() => newProductSubmitted()}
            ></ProductModal>

            <Toast config={toastConfig} />
        </View>
        // </SafeAreaView>
    );
};

export default CustomHeader;
