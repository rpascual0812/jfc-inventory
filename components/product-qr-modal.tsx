import { File } from 'expo-file-system';
import * as Print from 'expo-print';
import { useRef } from 'react';
import { Modal, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import CustomButton from './custom-button';
import CustomIconButton from './custom-icon-button';

interface ProductQrModalProps {
    data?: any;
    isModalVisible: boolean;
    closeModal: () => void;
    item: any
}

const ProductQrModal = ({ data, isModalVisible, closeModal, item }: ProductQrModalProps) => {
    console.log('ProductQrModal item:', item);
    const viewShotRef = useRef<any>(null);
    const qrRef = useRef<any>(null);
    const { width } = useWindowDimensions();

    const handleClose = () => {
        closeModal();
    };

    const handlePrint = async () => {
        const uri = await viewShotRef.current.capture({
            width: 300,
            height: 300,
            quality: 0.7,
            format: 'png',
        });
        console.log('Captured URI: ', uri);

        // Create a File instance
        const file = new File(uri);

        // Read as base64
        const base64 = await file.base64();

        console.log('Base64 string length: ', base64);

        await Print.printAsync({
            html: `
            <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: auto;">
                <img src="data:image/png;base64,${base64}" width="100%" height="100%"/>
            </div>
            `
        });
    };

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
                        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
                            <View style={modalStyles.modalBody}>
                                <QRCode
                                    value={'view,' + item.id}
                                    size={300}
                                    getRef={(c) => (qrRef.current = c)}
                                />
                                <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center', color: 'black', marginBottom: 20 }}>{item.productName}</Text>
                            </View>
                        </ViewShot>
                        <CustomButton
                            title="Print QR Code"
                            onPress={handlePrint}
                            style={{ backgroundColor: '#f44336' }} // Custom cancel button style
                        />

                    </View>
                </ScrollView>
            </View>
        </Modal >
    );
};


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

export default ProductQrModal;
