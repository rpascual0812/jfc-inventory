import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomButton from './custom-button';
import CustomInput from './custom-input';

interface ProductModalProps {
    data?: any;
    isModalVisible: boolean;
    closeModal: () => void;
    submitted: () => void
}

const ProductModal = ({ data, isModalVisible, closeModal, submitted }: ProductModalProps) => {
    // const [item, setItem] = useState<any>(data || {});
    const [date, setDate] = useState(new Date());
    const formattedDate = data?.consumeUntil || moment(date).format('DD MMMM, YYYY');

    const { control, reset, handleSubmit, formState: { errors } } = useForm({
        // defaultValues: {
        //     productName: data?.productName || '',
        //     // consumeUntil: moment(data?.consumeUntil.toDate()).format('DD MMMM, YYYY') || moment(new Date()).format('DD MMMM, YYYY'),
        //     consumeUntil: formattedDate,
        //     batchCode: data?.beginningQty || '',
        //     beginningQty: data?.beginningQty || '',
        //     receivedQty: data?.receivedQty || '',
        //     transferIn: data?.transferIn || '',
        //     transferOut: data?.transferOut || '',
        //     endingInventory: data?.endingInventory || '',
        //     dailyUsage: data?.dailyUsage || '',
        //     ordering: data?.ordering || '',
        //     unitOfMeasurement: data?.unitOfMeasurement || ''
        // }
    });

    useEffect(() => {
        reset(data || {});
    }, [data, reset]);

    // const [items, setItems] = useState<any>([]);
    // const itemsCollection = collection(db, 'items');

    // const fetchItems = async () => {
    //     try {
    //         const q = query(itemsCollection);
    //         const data = await getDocs(q);
    //         setItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //         // const querySnapshot = await getDocs(itemsCollection);
    //         // const items: any[] = [];
    //         // querySnapshot.forEach((doc) => {
    //         //     items.push({ id: doc.id, ...doc.data() });
    //         // });
    //         console.log('Items: ', items);

    //     } catch (e) {
    //         console.error('Error fetching documents: ', e);
    //     }
    // }

    // fetchItems();


    // const testUpdate = () => {
    //     firestore()
    //         .collection('items')
    //         .doc('pfR8DUTPij8XEoOErP1s')
    //         .update({
    //             productName: 'Sample Product',
    //             consumeUntil: '2024-12-31',
    //             batchCode: 'BATCH123',
    //             beginningQty: 100,
    //             receivedQty: 50,
    //             transferIn: 20,
    //             transferOut: 10,
    //             endingInventory: 160,
    //             dailyUsage: 5,
    //             ordering: 30,
    //             unitOfMeasurement: 'Packs',
    //             createdAt: firestore.FieldValue.serverTimestamp(),
    //         })
    //         .then(() => {
    //             console.log('Document successfully updated!');
    //         })
    //         .catch((error) => {
    //             console.error('Error updating document: ', error);
    //         });
    // }

    const addItem = () => {
        // firestore().collection('items').add({
        //     productName: 'Sample Product',
        //     consumeUntil: '2024-12-31',
        //     batchCode: 'BATCH123',
        //     beginningQty: 100,
        //     receivedQty: 50,
        //     transferIn: 20,
        //     transferOut: 10,
        //     endingInventory: 160,
        //     dailyUsage: 5,
        //     ordering: 30,
        //     unitOfMeasurement: 'Packs',
        //     createdAt: firestore.FieldValue.serverTimestamp(),
        // })
    }



    const { width } = useWindowDimensions();

    const handleCancel = () => {
        closeModal();
    };





    const onSubmit = async (data: any) => {
        data.cu = moment(formattedDate, 'DD MMMM, YYYY').format('YYYY-MM-DD');
        console.log(data);
        // addItem();
        // const docRef = await firestore
        //     .collection('items') // Reference to your collection
        //     .add({
        //         ...data,
        //         createdAt: Timestamp.now(),
        //     });
        // console.log('Document written with ID: ', docRef.id);
        // reset();
        // try {
        //     const docRef = await firestore()
        //         .collection('todos') // Reference to your collection
        //         .add({
        //             ...data,
        //             isComplete: false,
        //             createdAt: firestore.FieldValue.serverTimestamp(),
        //         });
        //     console.log('Document written with ID: ', docRef.id);
        // } catch (e) {
        //     console.error('Error adding document: ', e);
        // }

        submitted();
    };



    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };



    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (selectedDate: Date) => {
        setDate(selectedDate);
        hideDatePicker();
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
                        {/* Modal Body */}
                        <View style={modalStyles.modalBody}>
                            <Text style={modalStyles.label}>Product Name</Text>
                            <Controller
                                control={control}
                                name="productName"
                                rules={{
                                    required: "* Product Name is required",
                                    maxLength: {
                                        value: 250,
                                        message: "Product Name cannot exceed 250 characters",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={modalStyles.inputContainer}>
                                        <CustomInput placeholder="" onChangeText={onChange} onBlur={onBlur} value={value} containerStyle={errors.productName ? modalStyles.childInputContainerError : modalStyles.childInputContainer} />
                                        {errors.productName && (
                                            <Text style={modalStyles.errorText}>{typeof errors.productName.message === 'string' ? errors.productName.message : ''}</Text>
                                        )}
                                    </View>
                                )}
                            />

                            <Text style={modalStyles.label}>Consume Until</Text>
                            <Controller
                                control={control}
                                name="consumeUntil"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={modalStyles.inputContainer}>
                                        <TouchableOpacity onPress={showDatePicker}>
                                            <TextInput
                                                style={modalStyles.textDateInput}
                                                placeholder=""
                                                value={formattedDate}
                                                editable={false} // Prevents keyboard from opening
                                            />
                                        </TouchableOpacity>
                                    </View>

                                )}
                            />
                            {/* The Modal Date Picker Component */}
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                            />

                            <Text style={modalStyles.label}>Batch Code</Text>
                            <Controller
                                control={control}
                                name="batchCode"
                                rules={{
                                    required: "* Batch Code is required",
                                    maxLength: {
                                        value: 250,
                                        message: "Batch Code cannot exceed 250 characters",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={modalStyles.inputContainer}>
                                        <CustomInput placeholder="" onChangeText={onChange} onBlur={onBlur} value={value} containerStyle={errors.batchCode ? modalStyles.childInputContainerError : modalStyles.childInputContainer} />
                                        {errors.batchCode && (
                                            <Text style={modalStyles.errorText}>{typeof errors.batchCode.message === 'string' ? errors.batchCode.message : ''}</Text>
                                        )}
                                    </View>
                                )}
                            />

                            <Text style={modalStyles.label}>Beginning Inventory Qty</Text>
                            <Controller
                                control={control}
                                name="beginningQty"
                                rules={{
                                    required: "* Beginning Inventory Qty is required",
                                    maxLength: {
                                        value: 250,
                                        message: "Beginning Inventory Qty cannot exceed 250 characters",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={modalStyles.inputContainer}>
                                        <CustomInput placeholder="" onChangeText={onChange} onBlur={onBlur} value={value} keyboardType="numeric" containerStyle={errors.beginningQty ? modalStyles.childInputContainerError : modalStyles.childInputContainer} />
                                        {errors.beginningQty && (
                                            <Text style={modalStyles.errorText}>{typeof errors.beginningQty.message === 'string' ? errors.beginningQty.message : ''}</Text>
                                        )}
                                    </View>
                                )}
                            />

                            <Text style={modalStyles.label}>Received Qty</Text>
                            <Controller
                                control={control}
                                name="receivedQty"
                                rules={{
                                    required: "* Received Qty is required",
                                    maxLength: {
                                        value: 250,
                                        message: "Received Qty cannot exceed 250 characters",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={modalStyles.inputContainer}>
                                        <CustomInput placeholder="" onChangeText={onChange} onBlur={onBlur} value={value} keyboardType="numeric" containerStyle={errors.receivedQty ? modalStyles.childInputContainerError : modalStyles.childInputContainer} />
                                        {errors.receivedQty && (
                                            <Text style={modalStyles.errorText}>{typeof errors.receivedQty.message === 'string' ? errors.receivedQty.message : ''}</Text>
                                        )}
                                    </View>
                                )}
                            />

                            <Text style={modalStyles.label}>Transfer In</Text>
                            <Controller
                                control={control}
                                name="transferIn"
                                rules={{
                                    required: "* Transfer In is required",
                                    maxLength: {
                                        value: 250,
                                        message: "Transfer In cannot exceed 250 characters",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={modalStyles.inputContainer}>
                                        <CustomInput placeholder="" onChangeText={onChange} onBlur={onBlur} value={value} containerStyle={errors.transferIn ? modalStyles.childInputContainerError : modalStyles.childInputContainer} />
                                        {errors.transferIn && (
                                            <Text style={modalStyles.errorText}>{typeof errors.transferIn.message === 'string' ? errors.transferIn.message : ''}</Text>
                                        )}
                                    </View>
                                )}
                            />

                            <Text style={modalStyles.label}>Transfer Out</Text>
                            <Controller
                                control={control}
                                name="transferOut"
                                rules={{
                                    required: "* Transfer Out is required",
                                    maxLength: {
                                        value: 250,
                                        message: "Transfer Out cannot exceed 250 characters",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={modalStyles.inputContainer}>
                                        <CustomInput placeholder="" onChangeText={onChange} onBlur={onBlur} value={value} containerStyle={errors.transferOut ? modalStyles.childInputContainerError : modalStyles.childInputContainer} />
                                        {errors.transferOut && (
                                            <Text style={modalStyles.errorText}>{typeof errors.transferOut.message === 'string' ? errors.transferOut.message : ''}</Text>
                                        )}
                                    </View>
                                )}
                            />

                            <Text style={modalStyles.label}>Ending Inventory</Text>
                            <Controller
                                control={control}
                                name="endingInventory"
                                rules={{
                                    required: "* Ending Inventory is required",
                                    maxLength: {
                                        value: 250,
                                        message: "Ending Inventory cannot exceed 250 characters",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={modalStyles.inputContainer}>
                                        <CustomInput placeholder="" onChangeText={onChange} onBlur={onBlur} value={value} keyboardType="numeric" containerStyle={errors.endingInventory ? modalStyles.childInputContainerError : modalStyles.childInputContainer} />
                                        {errors.endingInventory && (
                                            <Text style={modalStyles.errorText}>{typeof errors.endingInventory.message === 'string' ? errors.endingInventory.message : ''}</Text>
                                        )}
                                    </View>
                                )}
                            />

                            <Text style={modalStyles.label}>Daily Usage</Text>
                            <Controller
                                control={control}
                                name="dailyUsage"
                                rules={{
                                    required: "* Daily Usage is required",
                                    maxLength: {
                                        value: 250,
                                        message: "Daily Usage cannot exceed 250 characters",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={modalStyles.inputContainer}>
                                        <CustomInput placeholder="" onChangeText={onChange} onBlur={onBlur} value={value} keyboardType="numeric" containerStyle={errors.dailyUsage ? modalStyles.childInputContainerError : modalStyles.childInputContainer} />
                                        {errors.dailyUsage && (
                                            <Text style={modalStyles.errorText}>{typeof errors.dailyUsage.message === 'string' ? errors.dailyUsage.message : ''}</Text>
                                        )}
                                    </View>
                                )}
                            />

                            <Text style={modalStyles.label}>Ordering</Text>
                            <Controller
                                control={control}
                                name="ordering"
                                rules={{
                                    required: "* Ordering is required",
                                    maxLength: {
                                        value: 250,
                                        message: "Ordering cannot exceed 250 characters",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={modalStyles.inputContainer}>
                                        <CustomInput placeholder="" onChangeText={onChange} onBlur={onBlur} value={value} keyboardType="numeric" containerStyle={errors.ordering ? modalStyles.childInputContainerError : modalStyles.childInputContainer} />
                                        {errors.ordering && (
                                            <Text style={modalStyles.errorText}>{typeof errors.ordering.message === 'string' ? errors.ordering.message : ''}</Text>
                                        )}
                                    </View>
                                )}
                            />

                            <Text style={modalStyles.label}>Unit of Measurement</Text>
                            <Controller
                                control={control}
                                name="unitOfMeasurement"
                                rules={{
                                    required: "* Unit of Measurement is required",
                                    maxLength: {
                                        value: 250,
                                        message: "Unit of Measurement cannot exceed 250 characters",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={modalStyles.inputContainer}>
                                        <CustomInput placeholder="" onChangeText={onChange} onBlur={onBlur} value={value} containerStyle={errors.unitOfMeasurement ? modalStyles.childInputContainerError : modalStyles.childInputContainer} />
                                        {errors.unitOfMeasurement && (
                                            <Text style={modalStyles.errorText}>{typeof errors.unitOfMeasurement.message === 'string' ? errors.unitOfMeasurement.message : ''}</Text>
                                        )}
                                    </View>
                                )}
                            />
                        </View>
                        {/* Modal Footer with Custom Buttons */}
                        <View style={modalStyles.modalFooter}>
                            <CustomButton
                                title="Cancel"
                                onPress={handleCancel}
                                style={{ backgroundColor: '#f44336' }} // Custom cancel button style
                            />
                            <CustomButton
                                title="Save"
                                onPress={handleSubmit(onSubmit)}
                                style={{ backgroundColor: '#4CAF50' }} // Custom save button style
                            />
                        </View>
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
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Aligns buttons to the right
        marginTop: 10,
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

export default ProductModal;
