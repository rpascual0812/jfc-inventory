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
import { collection, getDocs, query } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { db } from '../../FirebaseConfig';

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
    const [modalVisible, setModalVisible] = useState(false);
    const [items, setItems] = useState<any>([]);
    const [item, setItem] = useState<any>({});
    const itemsCollection = collection(db, 'items');
    const fetchItems = async () => {
        try {
            const q = query(itemsCollection);
            const data = await getDocs(q);
            setItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
        setModalVisible(true);
        // Implementation for edit functionality
    };

    const handleDelete = (id: string) => {
        console.log('Delete item with id: ', id);
        deleteAlert();
        // Implementation for delete functionality
    };

    const deleteAlert = () =>
        Alert.alert('Please confirm', 'Are you sure you want to delete this product?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'Delete', onPress: () => console.log('OK Pressed') },
        ]);

    const toggleModal = (status: boolean) => {
        setModalVisible(status);
    };

    const productUpdated = () => {
        setModalVisible(false);
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
                    <View style={styles.itemContainer}>
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
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
            />
            <ProductModal
                data={item}
                isModalVisible={modalVisible}
                closeModal={() => toggleModal(false)}
                submitted={() => productUpdated()}
            ></ProductModal>
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
