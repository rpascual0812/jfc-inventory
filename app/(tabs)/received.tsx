import moment from "moment";
import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { collection, getDocs, query } from "firebase/firestore";

import { db } from "../../FirebaseConfig";

const getItemReceivedQty = (item: any) =>
    Number(item?.receivedQuantity ?? item?.receivedQty) || 0;

type AggregatedReceived = {
    itemId: string;
    receivedQuantity: number;
    count: number;
    item: any | null;
};

const aggregateByItemId = (
    receivedDocs: any[],
    itemsById: Map<string, any>
): AggregatedReceived[] => {
    const grouped = new Map<string, { receivedQuantity: number; count: number }>();

    for (const received of receivedDocs) {
        if (!received.itemId) continue;

        const item = itemsById.get(received.itemId);
        const qty = getItemReceivedQty(item);

        const existing = grouped.get(received.itemId);
        if (existing) {
            existing.receivedQuantity += qty;
            existing.count += 1;
        } else {
            grouped.set(received.itemId, { receivedQuantity: qty, count: 1 });
        }
    }

    return Array.from(grouped.entries()).map(([itemId, data]) => ({
        itemId,
        receivedQuantity: data.receivedQuantity,
        count: data.count,
        item: itemsById.get(itemId) ?? null,
    }));
};

const FancyListItem = ({ item, onPress }: { item: AggregatedReceived; onPress: () => void }) => {
    const product = item.item;

    return (
        <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
            <View style={styles.textContainer}>
                {product ? (
                    <>
                        <Text style={styles.itemTitle}>
                            {product.productName} ({product.unitOfMeasurement})
                        </Text>
                        <Text style={styles.itemDescription}>
                            Batch Code: {product.batchCode}
                        </Text>
                        {product.consumeUntil ? (
                            <Text style={styles.itemDescription}>
                                CU: {moment(product.consumeUntil.toDate()).format("LLLL")}
                            </Text>
                        ) : null}
                        <Text style={styles.itemDescription}>
                            Received Qty: {item.receivedQuantity}
                        </Text>
                        <Text style={styles.itemDescription}>Count: {item.count}</Text>
                    </>
                ) : (
                    <Text style={styles.itemDescription}>
                        Item not found (ID: {item.itemId})
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default function ReceivedScreen() {
    const [aggregatedItems, setAggregatedItems] = useState<AggregatedReceived[]>([]);
    const [totalReceived, setTotalReceived] = useState(0);

    useEffect(() => {
        const fetchReceived = async () => {
            try {
                const [receivedSnapshot, itemsSnapshot] = await Promise.all([
                    getDocs(query(collection(db, "received"))),
                    getDocs(query(collection(db, "items"))),
                ]);

                const receivedDocs = receivedSnapshot.docs.map((receivedDoc) => ({
                    ...receivedDoc.data(),
                    id: receivedDoc.id,
                }));

                const itemsById = new Map(
                    itemsSnapshot.docs.map((itemDoc) => [
                        itemDoc.id,
                        { id: itemDoc.id, ...itemDoc.data() },
                    ])
                );

                setTotalReceived(receivedDocs.length);
                setAggregatedItems(aggregateByItemId(receivedDocs, itemsById));
            } catch (e) {
                console.error("Error fetching received documents: ", e);
            }
        };

        fetchReceived();
    }, []);

    const renderItem = ({ item }: { item: AggregatedReceived }) => (
        <FancyListItem
            item={item}
            onPress={() =>
                console.log(
                    `Pressed item ${item.itemId}`,
                    item.item?.productName ?? item.itemId,
                    `receivedQuantity: ${item.receivedQuantity}`
                )
            }
        />
    );

    return (
        <View>
            <Text style={{ marginLeft: 10, marginTop: 10 }}>
                Received Today: {totalReceived} ({aggregatedItems.length} unique)
            </Text>
            <FlatList
                data={aggregatedItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.itemId}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

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
});
