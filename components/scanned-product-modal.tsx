import FireStoreService from "@/services/FireStore";
import moment from "moment";
import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Toast from "react-native-toast-message";
import CustomButton from "./custom-button";
import CustomIconButton from "./custom-icon-button";


interface ScannedProductModalProps {
    id: string | null;
    isModalVisible: boolean;
    closeModal: () => void;
}

export default function ScannedProductModalScreen({ id, isModalVisible, closeModal }: ScannedProductModalProps) {
    const [item, setItem] = useState<any | null>(null);
    const { width } = useWindowDimensions();

    const handleClose = () => {
        closeModal();
    };

    const handleSave = async () => {
        try {
            await FireStoreService().received(item.id);

            Toast.show({
                type: 'success', // or 'error', 'info'
                text1: 'Success',
                text2: 'Product received successfully!',
                visibilityTime: 4000, // duration in milliseconds
            });
        } catch (e) {
            console.error('Error fetching document: ', e);
        }

        closeModal();
    };

    const fetchItem = async (id: string) => {
        try {
            const data = await FireStoreService().getOne(id);
            setItem(data);
        } catch (e) {
            console.error('Error fetching document: ', e);
        }
    }

    if (id) {
        fetchItem(id);
    }

    const consumedUntilformatted = moment.unix(item?.consumeUntil.seconds).format('YYYY-MM-DD');
    // console.log('item', id, item);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={closeModal} // Required for Android hardware back button
        >
            <View style={modalStyles.modalOverlay}>
                <ScrollView
                    horizontal={false}
                    pagingEnabled={false} // Optional: for snapping to full screen widths
                    contentContainerStyle={{ flexDirection: 'row', width: width * 0.9 }}
                >
                    <View style={modalStyles.modalContent}>
                        {/* Modal Header with Custom Buttons */}

                        <View style={modalStyles.modalHeader}>
                            <CustomIconButton
                                onPress={() => handleClose()}
                                icon="close"
                                style={{ backgroundColor: '#f44336', marginBottom: 10 }}
                            />
                        </View>
                        {/* Modal Body */}
                        {item && (
                            <View style={modalStyles.modalBody}>
                                <Text style={{ fontSize: 35, fontWeight: 'bold', textAlign: 'center', color: 'black', marginBottom: 25 }}>{item.productName}</Text>
                                <Text style={{ fontSize: 25, fontWeight: 'normal', textAlign: 'left', color: 'black' }}>Batch Code: {item.batchCode}</Text>
                                <Text style={{ fontSize: 25, fontWeight: 'normal', textAlign: 'left', color: 'black' }}>Consume Until: {consumedUntilformatted}</Text>
                                <Text style={{ fontSize: 25, fontWeight: 'normal', textAlign: 'left', color: 'black' }}>Beginning Qty: {item.beginningQty}</Text>
                                <Text style={{ fontSize: 25, fontWeight: 'normal', textAlign: 'left', color: 'black' }}>Received Qty: {item.receivedQty}</Text>
                            </View>
                        )}

                        <CustomButton
                            title="Continue"
                            onPress={handleSave}
                            style={{ backgroundColor: '#f44336' }} // Custom cancel button style
                        />

                    </View>
                </ScrollView>
            </View>
        </Modal >
    );
}

const modalStyles = StyleSheet.create({

    label: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 1,
        marginTop: 1,
        paddingLeft: 2
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
    textDateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        fontSize: 16,
        borderRadius: 5,
        color: 'black', // Ensure the text is visible
        marginTop: 10,
        marginBottom: 10
    },


    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    errorText: {
        color: "red",
        marginTop: 0,
        fontSize: 12
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Backdrop effect
    },
    modalContent: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '100%',
        // Position the footer at the bottom of the content
        justifyContent: 'space-between',
    },
    modalBody: {
        marginBottom: 20, // Space between body and footer
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Aligns buttons to the right
        marginBottom: 10,
    },
    childInputContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 8,
    },
    childInputContainerError: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'red',
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 8,
    },
});
