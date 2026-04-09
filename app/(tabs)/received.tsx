import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const DATA = [
    {
        id: "1",
        title: "Item 1",
        description: "This is a description for item 1.",
        imageUrl: "https://via.placeholder.com",
    },
    {
        id: "2",
        title: "Item 2",
        description: "This is a description for item 2.",
        imageUrl: "https://via.placeholder.com",
    },
    {
        id: "3",
        title: "Item 3",
        description: "This is a description for item 3.",
        imageUrl: "https://via.placeholder.com",
    },
];

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

export default function ReceivedScreen() {
    const renderItem = ({ item }: { item: any }) => (
        <FancyListItem
            item={item}
            onPress={() => console.log(`Pressed item ${item.title}`)}
        />
    );

    return (
        <View>
            <Text style={{ marginLeft: 10, marginTop: 10 }}>Received Today: 10</Text>
            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
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
