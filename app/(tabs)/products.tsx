import moment from 'moment';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import CustomIconButton from '@/components/custom-icon-button';
import ProductModal from '@/components/product-modal';
import ProductQrModal from '@/components/product-qr-modal';
import FireStoreService from '@/services/FireStore';
import Toast from 'react-native-toast-message';

// Custom Fancy List Item Component
const FancyListItem = ({ item, onPress }: { item: any; onPress: any }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
        <View style={styles.textContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
    </TouchableOpacity>
);

export default function ProductScreen() {
    const [productModalVisible, setProductModalVisible] = useState(false);
    const [items, setItems] = useState<any>([]);
    const [item, setItem] = useState<any>({});

    const [productQrModalVisible, setProductQrModalVisible] = useState(false);
    const [qrValue, setQrValue] = useState<any>({});

    const fetchItems = async () => {
        try {
            const data = await FireStoreService().getItems();
            setItems(data);
        } catch (e) {
            console.error('Error fetching documents: ', e);
        }
    }

    fetchItems();

    const handleEdit = (item: any) => {
        item.productName = item.productName.toString();
        item.consumeUntil = item.consumeUntil ? moment(item.consumeUntil.toDate()).format('DD MMMM, YYYY') : '';
        item.batchCode = item.batchCode.toString();
        item.beginningQty = item.beginningQty.toString();
        item.receivedQty = item.receivedQty.toString();
        item.transferIn = item.transferIn.toString();
        item.transferOut = item.transferOut.toString();
        item.endingInventory = item.endingInventory.toString();
        item.dailyUsage = item.dailyUsage.toString();
        item.ordering = item.ordering.toString();
        item.unitOfMeasurement = item.unitOfMeasurement.toString();

        setItem(item);
        setProductModalVisible(true);

        // Implementation for edit functionality
    };

    const handleDelete = (id: string) => {
        console.log('Deleting item with id: ', id);
        deleteAlert(id);
        // Implementation for delete functionality
    };

    const deleteAlert = (id: string) =>
        Alert.alert('Please confirm', 'Are you sure you want to delete this product?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Delete', onPress: () => {
                    FireStoreService().deleteItem(id);
                    Toast.show({
                        type: 'success', // or 'error', 'info'
                        text1: 'Success',
                        text2: 'Product deleted successfully!',
                        visibilityTime: 4000, // duration in milliseconds
                    });
                }
            },
        ]);

    const handleShowQr = (item: any) => {
        console.log('Showing item: ', item);
        setProductQrModalVisible(true);
        setQrValue(item.id);
    };

    const toggleProductModal = (status: boolean) => {
        setProductModalVisible(status);
    };

    const toggleProductQrModal = (status: boolean) => {
        setProductQrModalVisible(status);
    };

    const productUpdated = () => {
        setProductModalVisible(false);
        Toast.show({
            type: 'success', // or 'error', 'info'
            text1: 'Success',
            text2: 'Product saved successfully!',
            visibilityTime: 4000, // duration in milliseconds
        });
    }

    return (
        <View>
            <Text style={{ marginRight: 10, marginTop: 10, textAlign: 'right' }}>Total: {
                items.length
            }</Text>
            <FlatList
                data={items}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.itemContainer} onPress={() => handleShowQr(item)}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <View>
                                <Text style={styles.itemTitle}>Product: {item.productName} ({item.unitOfMeasurement})</Text>
                                <Text style={styles.itemDescription}>Batch Code: {item.batchCode}</Text>
                                <Text style={styles.itemDescription}>CU: {item.consumeUntil ? moment(item?.consumeUntil.toDate()).format('LLLL') : ''}</Text>
                                <Text style={styles.itemDescription}>Qty: {item.receivedQty}</Text>
                            </View>
                            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', flex: 1 }}>
                                <CustomIconButton
                                    onPress={() => handleEdit(item)}
                                    icon="pencil"
                                    style={{ backgroundColor: '#4CAF50', marginBottom: 10 }} // Custom save button style
                                />
                                <CustomIconButton
                                    onPress={() => handleDelete(item.id)}
                                    icon="trash"
                                    style={{ backgroundColor: '#f44336' }} // Custom cancel button style
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContainer}
            />
            <ProductModal
                data={item}
                isModalVisible={productModalVisible}
                closeModal={() => toggleProductModal(false)}
                submitted={() => productUpdated()}
            ></ProductModal>

            <ProductQrModal
                data={item}
                isModalVisible={productQrModalVisible}
                closeModal={() => toggleProductQrModal(false)}
                value={qrValue}
            ></ProductQrModal>
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 10,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    itemDescription: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    accessory: {
        fontSize: 20,
        color: "#ccc",
        marginLeft: 10,
    },
});
