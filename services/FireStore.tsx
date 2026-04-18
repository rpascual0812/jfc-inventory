import { collection, deleteDoc, doc, getDocs, query, setDoc, Timestamp } from "firebase/firestore";
import moment from 'moment';
import { db } from '../FirebaseConfig';

const itemCollection = process.env.EXPO_PUBLIC_ITEM_COLLECTION || 'items';

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

    return { getItems, saveItem, deleteItem };
}