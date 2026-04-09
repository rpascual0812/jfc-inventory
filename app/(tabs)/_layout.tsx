import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function TabLayout() {
    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
                <Tabs
                    screenOptions={{
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarStyle: {
                            position: "absolute",
                            bottom: 0,
                            left: 16,
                            right: 16,
                            height: 82,
                            paddingTop: 10,
                            elevation: 1,
                            backgroundColor: "white",
                            borderRadius: 16,
                            alignItems: "center",
                            justifyContent: "center",
                        },
                    }}
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            paddingTop: 10,
                                            width: width / 5,
                                        }}
                                    >
                                        <Ionicons
                                            name={focused ? "home" : "home-outline"}
                                            color={focused ? "#cf240a" : "gray"}
                                            size={24}
                                        />
                                        <Text
                                            style={{
                                                color: focused ? "#cf240a" : "gray",
                                                fontSize: 12,
                                                marginTop: 4,
                                            }}
                                        >
                                            Home
                                        </Text>
                                    </View>
                                );
                            },
                        }}
                    />
                    <Tabs.Screen
                        name="products"
                        options={{
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            paddingTop: 10,
                                            width: width / 5,
                                        }}
                                    >
                                        <Ionicons
                                            name={focused ? "book" : "book-outline"}
                                            color={focused ? "#cf240a" : "gray"}
                                            size={24}
                                        />
                                        <Text
                                            style={{
                                                color: focused ? "#cf240a" : "gray",
                                                fontSize: 12,
                                                marginTop: 4,
                                            }}
                                        >
                                            Products
                                        </Text>
                                    </View>
                                );
                            },
                        }}
                    />
                    <Tabs.Screen
                        name="scan"
                        options={{
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            height: 60,
                                            width: 60,
                                            justifyContent: "center",
                                            borderRadius: 30,
                                            backgroundColor: "#cf240a",
                                            marginBottom: 30,
                                        }}
                                    >
                                        <Ionicons
                                            name={focused ? "qr-code" : "qr-code-outline"}
                                            color="white"
                                            size={40}
                                        />
                                        <Text
                                            style={{
                                                color: focused ? "#cf240a" : "gray",
                                                fontSize: 12,
                                                marginTop: -15,
                                            }}
                                        ></Text>
                                    </View>
                                );
                            },
                        }}
                    />
                    <Tabs.Screen
                        name="received"
                        options={{
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            paddingTop: 10,
                                            width: width / 5,
                                        }}
                                    >
                                        <Ionicons
                                            name={focused ? "folder-open" : "folder-open-outline"}
                                            color={focused ? "#cf240a" : "gray"}
                                            size={24}
                                        />
                                        <Text
                                            style={{
                                                color: focused ? "#cf240a" : "gray",
                                                fontSize: 12,
                                                marginTop: 4,
                                            }}
                                        >
                                            Received
                                        </Text>
                                    </View>
                                );
                            },
                        }}
                    />
                    <Tabs.Screen
                        name="settings"
                        options={{
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            paddingTop: 10,
                                            width: width / 5,
                                        }}
                                    >
                                        <Ionicons
                                            name={focused ? "menu" : "menu-outline"}
                                            color={focused ? "#cf240a" : "gray"}
                                            size={24}
                                        />
                                        <Text
                                            style={{
                                                color: focused ? "#cf240a" : "gray",
                                                fontSize: 12,
                                                marginTop: 4,
                                            }}
                                        >
                                            Settings
                                        </Text>
                                    </View>
                                );
                            },
                        }}
                    />
                </Tabs>
            </SafeAreaView>
        </View>
    );
}
