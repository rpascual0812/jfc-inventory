import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, Timestamp } from "firebase/firestore";
import moment from 'moment';
import { db } from '../FirebaseConfig';

const itemCollection = process.env.EXPO_PUBLIC_ITEM_COLLECTION || 'items';
const receivedCollection = process.env.EXPO_PUBLIC_RECEIVED_COLLECTION || 'received';

export default function FireStoreService() {
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
            productName: item.productName,
            consumeUntil: Timestamp.fromDate(consumeUntil),
            batchCode: item.batchCode,
            beginningQty: item.beginningQty,
            receivedQty: item.receivedQty,
            transferIn: item.transferIn,
            transferOut: item.transferOut,
            endingInventory: item.endingInventory,
            dailyUsage: item.dailyUsage,
            ordering: item.ordering,
            unitOfMeasurement: item.unitOfMeasurement,
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

    return { getItems, getOne, saveItem, deleteItem, received, getReceivedWithItem, deleteReceivedItem };
}