import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomButton from './custom-button';
import CustomInput from './custom-input';

import FireStoreService from '@/services/FireStore';
import CustomTextarea from './custom-textarea';

interface ProductModalProps {
    data?: any;
    isModalVisible: boolean;
    closeModal: () => void;
    submitted: () => void
}

interface Item {
    id: string | undefined;
    productName: string;
    consumeUntil: string;
    batchCode: string;
    beginningQty: number;
    receivedQty: number;
    transferIn: string;
    transferOut: string;
    endingInventory: number;
    dailyUsage: number;
    ordering: number;
    unitOfMeasurement: string;
}

const ProductModal = ({ data, isModalVisible, closeModal, submitted }: ProductModalProps) => {
    const [date, setDate] = useState(new Date());
    const formattedDate = data?.consumeUntil ?? moment(date).format('DD MMMM, YYYY');
    // console.log('saving data: ', data?.id, formattedDate, data);
    const { control, reset, handleSubmit, formState: { errors } } = useForm();

    const [openType, setOpenType] = useState(false);
    const [typeValue, setTypeValue] = useState('receiving');
    const [typeList, setTypeList] = useState([
        { label: 'Receiving', value: 'receiving' },
        { label: 'Transfer In', value: 'transferIn' },
        { label: 'Transfer Out', value: 'transferOut' },
        // { label: 'Ordering', value: 'ordering' }
    ]);

    const [openStoreCode, setOpenStoreCode] = useState(false);
    const [storeCodeValue, setStoreCodeValue] = useState('');
    const [storeList, setStoreList] = useState([
        { label: 'Store 1', value: 'store001' },
        { label: 'Store 2', value: 'store002' },
        { label: 'Store 3', value: 'store003' },
        { label: 'Store 4', value: 'store004' },
        { label: 'Store 5', value: 'store005' },
        { label: 'Store 6', value: 'Store 6' },
        { label: 'Store 7', value: 'Store 7' },
        { label: 'Store 8', value: 'Store 8' },
    ]);

    const [openProduct, setOpenProduct] = useState(false);
    const [productValue, setproductValue] = useState('');
    const [productList, setProductList] = useState([
        { label: 'Buns, Yum, Glazed', value: '1000001726' },
        { label: 'Buns, Yum W/ Sesame, Glazed', value: '1000001780' },
        { label: 'Buns, Champ, Glazed', value: '1000001600' },
        { label: 'Roll, Hotdog, Glazed', value: '1000001779' },
    ]);

    const [openUnitOfMeasurement, setOpenUnitOfMeasurement] = useState(false);
    const [unitOfMeasurementValue, setUnitOfMeasurementValue] = useState('');
    const [unitOfMeasurementList, setUnitOfMeasurementList] = useState([
        { label: 'Pieces', value: 'pieces' },
        { label: 'Packs', value: 'packs' },
    ]);

    useEffect(() => {
        reset(data || {});
    }, [data, reset]);

    const { width } = useWindowDimensions();

    const handleCancel = () => {
        closeModal();
    };

    const onSubmit = async (data: any) => {
        data.consumeUntil = moment(formattedDate, 'DD MMMM, YYYY').format('YYYY-MM-DD 00:00:00');
        FireStoreService().saveItem(data);
        submitted();
        reset();
        closeModal();
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

    const refreshForm = () => {
        console.log(typeValue);
    }

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
                            <Text style={[modalStyles.label, { marginBottom: 10 }]}>Type</Text>
                            <View style={{ zIndex: 1000 }}>
                                <DropDownPicker
                                    listMode="SCROLLVIEW"
                                    open={openType}
                                    value={typeValue}
                                    items={typeList}
                                    setOpen={setOpenType}
                                    setValue={setTypeValue}
                                    setItems={setTypeList}
                                    multiple={false}
                                    onChangeValue={() => refreshForm()}
                                />
                            </View>

                            <View style={{ marginTop: 30 }}></View>

                            {['transferIn', 'transferOut'].includes(typeValue) &&
                                <>
                                    <Text style={modalStyles.label}>STR No.</Text>
                                    <Controller
                                        control={control}
                                        name="strNo"
                                        rules={{
                                            required: "* STR No. is required",
                                            maxLength: {
                                                value: 250,
                                                message: "STR No. cannot exceed 250 characters",
                                            },
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View style={modalStyles.inputContainer}>
                                                <CustomInput placeholder="" onChangeText={onChange} onBlur={onBlur} value={value} keyboardType="numeric" containerStyle={errors.strNo ? modalStyles.childInputContainerError : modalStyles.childInputContainer} />
                                                {errors.strNo && (
                                                    <Text style={modalStyles.errorText}>{typeof errors.strNo.message === 'string' ? errors.strNo.message : ''}</Text>
                                                )}
                                            </View>
                                        )}
                                    />
                                </>
                            }

                            {['transferIn', 'transferOut'].includes(typeValue) &&
                                <View style={{ zIndex: openStoreCode ? 1000 : 1 }}>
                                    <Text style={[modalStyles.label, { marginBottom: 10 }]}>Store Code</Text>
                                    <DropDownPicker
                                        listMode="SCROLLVIEW"
                                        open={openStoreCode}
                                        value={storeCodeValue}
                                        items={storeList}
                                        setOpen={setOpenStoreCode}
                                        setValue={setStoreCodeValue}
                                        setItems={setStoreList}
                                        multiple={false}
                                        style={{ marginBottom: 30 }}
                                        zIndex={3000} zIndexInverse={1000}
                                    />
                                </View>
                            }

                            {/* {['receiving', 'transferIn', 'transferOut'].includes(typeValue) &&
                                <>
                                    <Text style={[modalStyles.label]}>Product Code</Text>
                                    <Controller
                                        control={control}
                                        name="productCode"
                                        rules={{
                                            required: "* Product Code is required",
                                            maxLength: {
                                                value: 250,
                                                message: "Product Code cannot exceed 250 characters",
                                            },
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View style={modalStyles.inputContainer}>
                                                <CustomInput placeholder="" onChangeText={onChange} onBlur={onBlur} value={value} containerStyle={errors.productCode ? modalStyles.childInputContainerError : modalStyles.childInputContainer} />
                                                {errors.productCode && (
                                                    <Text style={modalStyles.errorText}>{typeof errors.productCode.message === 'string' ? errors.productCode.message : ''}</Text>
                                                )}
                                            </View>
                                        )}
                                    />
                                </>
                            } */}

                            {['receiving', 'transferIn', 'transferOut'].includes(typeValue) &&
                                <View style={{ zIndex: openProduct ? 1000 : 1 }}>
                                    <Text style={modalStyles.label}>Product</Text>
                                    <DropDownPicker
                                        listMode="SCROLLVIEW"
                                        open={openProduct}
                                        value={productValue}
                                        items={productList}
                                        setOpen={setOpenProduct}
                                        setValue={setproductValue}
                                        setItems={setProductList}
                                        multiple={false}
                                        style={{ marginBottom: 30 }}
                                        zIndex={3000} zIndexInverse={1000}
                                    />
                                </View>
                            }

                            {['receiving', 'transferIn', 'transferOut'].includes(typeValue) &&
                                <>
                                    <Text style={modalStyles.label}>Qty</Text>
                                    <Controller
                                        control={control}
                                        name="qty"
                                        rules={{
                                            required: "* Qty is required",
                                            maxLength: {
                                                value: 250,
                                                message: "Qty cannot exceed 250 characters",
                                            },
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View style={modalStyles.inputContainer}>
                                                <CustomInput placeholder="" onChangeText={onChange} onBlur={onBlur} value={value} keyboardType="numeric" containerStyle={errors.qty ? modalStyles.childInputContainerError : modalStyles.childInputContainer} />
                                                {errors.qty && (
                                                    <Text style={modalStyles.errorText}>{typeof errors.qty.message === 'string' ? errors.qty.message : ''}</Text>
                                                )}
                                            </View>
                                        )}
                                    />
                                </>
                            }

                            {['receiving', 'transferIn', 'transferOut'].includes(typeValue) &&
                                <View style={{ zIndex: openUnitOfMeasurement ? 1000 : 1 }}>
                                    <Text style={modalStyles.label}>Unit of Measurement</Text>
                                    <DropDownPicker
                                        listMode="SCROLLVIEW"
                                        open={openUnitOfMeasurement}
                                        value={unitOfMeasurementValue}
                                        items={unitOfMeasurementList}
                                        setOpen={setOpenUnitOfMeasurement}
                                        setValue={setUnitOfMeasurementValue}
                                        setItems={setUnitOfMeasurementList}
                                        multiple={false}
                                        style={{ marginBottom: 30 }}
                                        zIndex={3000} zIndexInverse={1000}
                                    />
                                </View>
                                // <>
                                //     <Text style={modalStyles.label}>Unit of Measurement</Text>
                                //     <Controller
                                //         control={control}
                                //         name="unitOfMeasurement"
                                //         rules={{
                                //             required: "* Unit of Measurement is required",
                                //             maxLength: {
                                //                 value: 250,
                                //                 message: "Unit of Measurement cannot exceed 250 characters",
                                //             },
                                //         }}
                                //         render={({ field: { onChange, onBlur, value } }) => (
                                //             <View style={modalStyles.inputContainer}>
                                //                 <CustomInput placeholder="" onChangeText={onChange} onBlur={onBlur} value={value} containerStyle={errors.unitOfMeasurement ? modalStyles.childInputContainerError : modalStyles.childInputContainer} />
                                //                 {errors.unitOfMeasurement && (
                                //                     <Text style={modalStyles.errorText}>{typeof errors.unitOfMeasurement.message === 'string' ? errors.unitOfMeasurement.message : ''}</Text>
                                //                 )}
                                //             </View>
                                //         )}
                                //     />
                                // </>
                            }

                            {['receiving'].includes(typeValue) &&
                                <>
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
                                </>
                            }

                            {['receiving'].includes(typeValue) &&
                                <>
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
                                </>
                            }

                            {['transferIn', 'transferOut'].includes(typeValue) &&
                                <>
                                    <Text style={modalStyles.label}>Remarks</Text>
                                    <Controller
                                        control={control}
                                        name="remarks"
                                        rules={{
                                            required: "* Remarks is required",
                                            maxLength: {
                                                value: 500,
                                                message: "Remarks cannot exceed 500 characters",
                                            },
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View style={modalStyles.inputContainer}>
                                                <CustomTextarea onChangeText={onChange} onBlur={onBlur} value={value} containerStyle={errors.remarks ? modalStyles.childInputContainerError : modalStyles.childInputContainer} />
                                                {errors.remarks && (
                                                    <Text style={modalStyles.errorText}>{typeof errors.remarks.message === 'string' ? errors.remarks.message : ''}</Text>
                                                )}
                                            </View>
                                        )}
                                    />
                                </>
                            }














                            {[''].includes(typeValue) &&
                                <>
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
                                </>
                            }
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
            </View >
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
