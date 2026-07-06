import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, Timestamp } from "firebase/firestore";
import moment from 'moment';
import { db } from '../FirebaseConfig';

const itemCollection = process.env.EXPO_PUBLIC_ITEM_COLLECTION || 'items';
const receivedCollection = process.env.EXPO_PUBLIC_RECEIVED_COLLECTION || 'received';
const dropdownCollection = process.env.EXPO_PUBLIC_DROPDOWN_COLLECTION || 'dropdownOptions';

const createFireStoreService = () => {
    const getItems = async () => {
        try {
            const itemsCollection = collection(db, itemCollection);
            const q = query(itemsCollection);
            const data = await getDocs(q);
            return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        } catch (e) {
            console.error('Error fetching documents: ', e);
            return [];
        }
    };

    const getOne = async (id: string) => {
        try {
            const docRef = doc(db, itemCollection, id);
            const data = await getDoc(docRef);

            if (data.exists()) {
                return {
                    ...data.data(),
                    id: data.id,
                };
            } else {
                console.log('No such document!');
                return null;
            }
        } catch (e) {
            console.error('Error fetching document: ', e);
            return null;
        }
    };

    const saveItem = async (item: any) => {
        let docRefId = item?.id || null;
        const newDocRef = doc(collection(db, itemCollection)); // Automatically generate a unique ID for the new document
        if (item && !item.id) {
            docRefId = newDocRef.id;
        }

        const formattedDate = item?.consumeUntil ? moment(item?.consumeUntil, 'DD MMMM, YYYY').format('YYYY-MM-DD 00:00:00') : moment(new Date()).format('DD MMMM, YYYY');
        const consumeUntil = new Date(formattedDate);
        await setDoc(doc(db, itemCollection, docRefId), {
            type: item.type,
            strNo: item.strNo,
            storeCode: item.storeCode,
            product: item.product,
            qty: item.qty,
            unitOfMeasurement: item.unitOfMeasurement,
            remarks: item.remarks,
            consumeUntil: Timestamp.fromDate(consumeUntil),
            batchCode: item.batchCode,
            createdAt: Timestamp.fromDate(new Date()),
        }).then(() => console.log('Document successfully written!'))
            .catch((error) => {
                console.error('Error writing document: ', error);
            });
    };

    const deleteItem = async (id: string) => {
        await deleteDoc(doc(db, itemCollection, id));
    };

    const received = async (itemId: string) => {
        const receivedDocRef = doc(collection(db, receivedCollection));

        await setDoc(receivedDocRef, {
            itemId,
            createdAt: Timestamp.fromDate(new Date()),
        }).then(() => console.log('Document successfully written!'))
            .catch((error) => {
                console.error('Error writing document: ', error);
            });
    };

    const getReceivedWithItem = async () => {
        try {
            const ordersSnapshot = await getDocs(collection(db, 'received'));

            const results = await Promise.all(
                ordersSnapshot.docs.map(async (receivedDoc) => {
                    const receivedData = receivedDoc.data();

                    let itemData = null;

                    if (receivedData.itemId) {
                        const itemRef = doc(db, 'items', receivedData.itemId);
                        const itemSnap = await getDoc(itemRef);

                        if (itemSnap.exists()) {
                            itemData = {
                                id: itemSnap.id,
                                ...itemSnap.data(),
                            };
                        }
                    }

                    return {
                        id: receivedDoc.id,
                        ...receivedData,
                        item: itemData, // LEFT JOIN result
                    };
                })
            );

            return results;
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    const deleteReceivedItem = async (id: string) => {
        await deleteDoc(doc(db, receivedCollection, id));
    };

    const getDropdownItems = async (category: string) => {
        try {
            const snapshot = await getDoc(doc(db, dropdownCollection, category));

            if (!snapshot.exists()) {
                return [];
            }

            const data = snapshot.data();
            return Array.isArray(data?.items)
                ? data.items.map((item: any, index: number) => ({
                    id: item?.id || `${category}-${index}`,
                    label: item?.label || '',
                    value: item?.value || '',
                }))
                : [];
        } catch (e) {
            console.error('Error fetching dropdown items: ', e);
            return [];
        }
    };

    const saveDropdownItem = async (category: string, item: { id?: string; label: string; value: string }) => {
        try {
            const currentItems = await getDropdownItems(category);
            const nextItems = item?.id
                ? currentItems.map((currentItem) => currentItem.id === item.id
                    ? { ...currentItem, label: item.label, value: item.value }
                    : currentItem)
                : [
                    ...currentItems,
                    {
                        id: `${category}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                        label: item.label,
                        value: item.value,
                    },
                ];

            await setDoc(doc(db, dropdownCollection, category), {
                category,
                items: nextItems,
            }, { merge: true });

            return nextItems;
        } catch (e) {
            console.error('Error saving dropdown item: ', e);
            return [];
        }
    };

    const deleteDropdownItem = async (category: string, itemId: string) => {
        try {
            const currentItems = await getDropdownItems(category);
            const nextItems = currentItems.filter((item) => item.id !== itemId);

            await setDoc(doc(db, dropdownCollection, category), {
                category,
                items: nextItems,
            }, { merge: true });

            return nextItems;
        } catch (e) {
            console.error('Error deleting dropdown item: ', e);
            return [];
        }
    };

    return {
        getItems,
        getOne,
        saveItem,
        deleteItem,
        received,
        getReceivedWithItem,
        deleteReceivedItem,
        getDropdownItems,
        saveDropdownItem,
        deleteDropdownItem,
    };
};

const FireStoreService = () => createFireStoreService();

export default FireStoreService;