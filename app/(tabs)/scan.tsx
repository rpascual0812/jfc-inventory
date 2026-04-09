import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, Text, View } from "react-native";

export default function HomeScreen() {
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        // Camera permissions are not granted yet.
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ textAlign: "center" }}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScannedData(data);
        console.log(`Scanned type: ${type}, Scanned data: ${data}`);
        // You can add logic here to navigate or process the data
    };

    return (
        <View style={{ flex: 1 }}>
            <CameraView
                style={{ flex: 1 }}
                onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned}
            // Use onBarCodeScanned prop to define the callback function
            >
                {scannedData && (
                    <Button
                        title={"Tap to Scan Again"}
                        onPress={() => setScannedData(null)}
                    />
                )}
            </CameraView>
        </View>
    );
}
