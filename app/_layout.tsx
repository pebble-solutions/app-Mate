import {SplashScreen, Stack} from "expo-router";
import { useFonts, Inter_500Medium, Inter_300Light, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';
import {useEffect} from "react";
import ActivityContextProvider from "../shared/contexts/ActivityContext";

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

    const [fontsLoaded, fontError] = useFonts({
        Inter_500Medium, Inter_300Light, Inter_700Bold, Inter_900Black
    })

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync()
        }
    }, [fontsLoaded, fontError])

    if (!fontsLoaded && !fontError) {
        return null
    }

    return (
        <ActivityContextProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{
                    headerShown: false
                }} />
            </Stack>
        </ActivityContextProvider>
    )
}