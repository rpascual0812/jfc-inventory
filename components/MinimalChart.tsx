import { LinearGradient } from "expo-linear-gradient";
import { collection, getDocs, query } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

import { db } from "../FirebaseConfig";
import { Color } from "../constants/TWPallete";
import { Icon } from "./ui/Icon";

interface BarData {
    value: number;
    label?: string;
    frontColor?: string;
    [key: string]: unknown;
}

interface ProductChartEntry {
    id: string;
    productName: string;
    quantity: number;
    received: number;
}

const colorThemes = {
    yellow: { name: "yellow", primary: 500, accent: 600 },
} as const;

type ColorTheme = keyof typeof colorThemes;

const getMonthName = (month: number) => {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return months[month];
};

const CHART_BAR_WIDTH = 24;
const CHART_BAR_SPACING = 16;
const CHART_INITIAL_SPACING = 16;
const CHART_GROUP_WIDTH = CHART_BAR_WIDTH * 2 + CHART_BAR_SPACING;

const getReceivedDate = (received: Record<string, unknown>): Date | null => {
    const value = received.createdAt ?? received.receivedAt ?? received.date;

    if (!value || typeof value !== "object") {
        return null;
    }

    if ("toDate" in value && typeof value.toDate === "function") {
        return value.toDate();
    }

    return null;
};

const isInMonth = (date: Date | null, year: number, month: number) =>
    !!date && date.getFullYear() === year && date.getMonth() === month;

export default function MinimalChart() {
    const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [colorTheme] = useState<ColorTheme>("yellow");
    const [items, setItems] = useState<any[]>([]);
    const [receivedDocs, setReceivedDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const theme = colorThemes[colorTheme];
    const themeColor = Color[theme.name as keyof typeof Color];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [itemsSnapshot, receivedSnapshot] = await Promise.all([
                    getDocs(query(collection(db, "items"))),
                    getDocs(query(collection(db, "received"))),
                ]);

                setItems(
                    itemsSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
                setReceivedDocs(
                    receivedSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
            } catch (error) {
                console.error("Error fetching chart data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const chartData = useMemo<ProductChartEntry[]>(() => {
        const itemsById = new Map(items.map((item) => [item.id, item]));
        const receivedByItemId = new Map<string, number>();

        for (const received of receivedDocs) {
            if (!received.itemId) continue;
            if (!isInMonth(getReceivedDate(received), currentYear, currentMonth)) {
                continue;
            }

            const item = itemsById.get(received.itemId);
            const qty = Number(item?.receivedQuantity ?? item?.receivedQty) || 0;

            receivedByItemId.set(
                received.itemId,
                (receivedByItemId.get(received.itemId) ?? 0) + qty
            );
        }

        return items.map((item) => ({
            id: item.id,
            productName: item.productName ?? "Unknown",
            quantity: Number(item.receivedQty ?? item.endingInventory ?? 0) || 0,
            received: receivedByItemId.get(item.id) ?? 0,
        }));
    }, [items, receivedDocs, currentYear, currentMonth]);

    const navigateMonth = (direction: number) => {
        let newMonth = currentMonth + direction;
        let newYear = currentYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setSelectedBarIndex(null);
    };

    const getChartData = useCallback(() => {
        return chartData.flatMap((item, index) => {
            const quantityBarIndex = index * 2;
            const receivedBarIndex = quantityBarIndex + 1;

            return [
                {
                    value: item.quantity,
                    spacing: 0,
                    frontColor:
                        selectedBarIndex === quantityBarIndex
                            ? themeColor[theme.accent]
                            : themeColor[theme.primary],
                    topLabelComponent: () =>
                        selectedBarIndex === quantityBarIndex ? (
                            <Text
                                style={{
                                    color: themeColor[700],
                                    fontSize: 10,
                                    fontWeight: "600",
                                    marginBottom: 4,
                                }}
                            >
                                {item.quantity}
                            </Text>
                        ) : null,
                },
                {
                    value: item.received,
                    frontColor:
                        selectedBarIndex === receivedBarIndex
                            ? themeColor[500]
                            : themeColor[300],
                    topLabelComponent: () =>
                        selectedBarIndex === receivedBarIndex ? (
                            <Text
                                style={{
                                    color: themeColor[700],
                                    fontSize: 10,
                                    fontWeight: "600",
                                    marginBottom: 4,
                                }}
                            >
                                {item.received}
                            </Text>
                        ) : null,
                },
            ];
        });
    }, [chartData, selectedBarIndex, themeColor, theme]);

    const totalQuantity = chartData.reduce((sum, item) => sum + item.quantity, 0);
    const totalReceived = chartData.reduce((sum, item) => sum + item.received, 0);

    const chartWidth = useMemo(() => {
        if (chartData.length === 0) {
            return undefined;
        }

        return (
            CHART_INITIAL_SPACING +
            chartData.length * CHART_GROUP_WIDTH +
            CHART_INITIAL_SPACING
        );
    }, [chartData.length]);

    const bgColors = [
        Color[colorThemes[colorTheme].name][100],
        "#ffffff",
        Color[colorThemes[colorTheme].name][100],
    ] as const;

    return (
        <LinearGradient
            colors={bgColors}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 12,
                        marginVertical: 32,
                        paddingHorizontal: 16,
                    }}
                >
                    <View style={{ flex: 1, ...styles.card }}>
                        <Text style={styles.label}>Products</Text>
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: "700",
                                color: Color.gray[900],
                                marginTop: 4,
                            }}
                        >
                            {chartData.length}
                        </Text>
                    </View>

                    <View style={{ flex: 1, ...styles.card }}>
                        <Text style={styles.label}>Total Qty</Text>
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: "700",
                                color: Color.gray[900],
                                marginTop: 4,
                            }}
                        >
                            {totalQuantity}
                        </Text>
                    </View>

                    <View style={{ flex: 1, ...styles.card }}>
                        <Text style={styles.label}>Received</Text>
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: "700",
                                color: Color.gray[900],
                                marginTop: 4,
                            }}
                        >
                            {totalReceived}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                        paddingHorizontal: 16,
                    }}
                >
                    <Pressable
                        onPress={() => navigateMonth(-1)}
                        style={{
                            padding: 8,
                            borderRadius: 8,
                        }}
                        hitSlop={20}
                    >
                        <Icon
                            symbol={"chevron.backward"}
                            size="sm"
                            color={Color.gray[500]}
                        />
                    </Pressable>

                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "600",
                            color: Color.gray[900],
                        }}
                    >
                        {getMonthName(currentMonth)} {currentYear}
                    </Text>

                    <Pressable
                        onPress={() => navigateMonth(1)}
                        style={{
                            padding: 8,
                            borderRadius: 8,
                        }}
                        hitSlop={20}
                    >
                        <Icon
                            symbol={"chevron.forward"}
                            size="sm"
                            color={Color.gray[500]}
                        />
                    </Pressable>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        gap: 16,
                        paddingHorizontal: 16,
                        marginBottom: 12,
                    }}
                >
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendSwatch,
                                { backgroundColor: themeColor[theme.primary] },
                            ]}
                        />
                        <Text style={styles.legendText}>Quantity</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendSwatch,
                                { backgroundColor: themeColor[300] },
                            ]}
                        />
                        <Text style={styles.legendText}>Received</Text>
                    </View>
                </View>

                <View
                    style={{
                        marginBottom: 32,
                        overflow: "hidden",
                    }}
                >
                    {loading ? (
                        <Text style={styles.emptyText}>Loading chart...</Text>
                    ) : chartData.length === 0 ? (
                        <Text style={styles.emptyText}>No products found.</Text>
                    ) : (
                        <ScrollView
                            horizontal
                            nestedScrollEnabled
                            showsHorizontalScrollIndicator={false}
                        >
                            <View>
                                <BarChart
                                    noOfSections={4}
                                    barBorderRadius={4}
                                    data={getChartData()}
                                    width={chartWidth}
                                    disableScroll
                                    initialSpacing={CHART_INITIAL_SPACING}
                                    endSpacing={CHART_INITIAL_SPACING}
                                    yAxisThickness={0}
                                    xAxisThickness={0}
                                    yAxisTextStyle={{
                                        color: Color.gray[400],
                                        fontSize: 12,
                                        fontWeight: "500",
                                    }}
                                    showXAxisIndices={false}
                                    isAnimated
                                    animationDuration={300}
                                    onPress={(_item: BarData, index: number) => {
                                        setSelectedBarIndex(
                                            selectedBarIndex === index ? null : index
                                        );
                                    }}
                                    showGradient
                                    dashGap={10}
                                    barWidth={CHART_BAR_WIDTH}
                                    spacing={CHART_BAR_SPACING}
                                />
                                <View style={styles.chartLabelsRow}>
                                    {chartData.map((item) => (
                                        <View
                                            key={item.id}
                                            style={styles.chartLabelContainer}
                                        >
                                            <Text style={styles.chartLabel}>
                                                {item.productName}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>
                    )}
                </View>

                {!loading && chartData.length > 0 ? (
                    <View style={{ paddingHorizontal: 16, marginBottom: 32, gap: 8 }}>
                        {chartData.map((item) => (
                            <View key={item.id} style={styles.productRow}>
                                <Text style={styles.productName}>{item.productName}</Text>
                                <Text style={styles.productMeta}>
                                    Qty: {item.quantity} · Received: {item.received}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : null}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 140,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
    },
    label: {
        fontSize: 14,
        color: Color.gray[600],
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    legendSwatch: {
        width: 12,
        height: 12,
        borderRadius: 3,
    },
    legendText: {
        fontSize: 13,
        color: Color.gray[600],
    },
    emptyText: {
        textAlign: "center",
        color: Color.gray[500],
        paddingVertical: 32,
    },
    productRow: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 12,
    },
    productName: {
        fontSize: 15,
        fontWeight: "600",
        color: Color.gray[900],
    },
    productMeta: {
        fontSize: 13,
        color: Color.gray[600],
        marginTop: 4,
    },
    chartLabelsRow: {
        flexDirection: "row",
        paddingLeft: CHART_INITIAL_SPACING,
        paddingRight: CHART_INITIAL_SPACING,
        marginTop: 8,
    },
    chartLabelContainer: {
        width: CHART_GROUP_WIDTH,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    chartLabel: {
        color: Color.gray[400],
        fontSize: 11,
        fontWeight: "500",
        textAlign: "center",
    },
});
