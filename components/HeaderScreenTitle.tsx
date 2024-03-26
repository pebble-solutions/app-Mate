import { globalStyles } from "../shared/globalStyles";
import { Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { router } from "expo-router";

type HeaderScreenTitleType = {
    title: string,
    addButton?: boolean
    grayedOut?: boolean
}

export default function HeaderScreenTitle({ title, addButton, grayedOut }: HeaderScreenTitleType) {
    return (
        <View style={globalStyles.topContainer}>
            <View style={globalStyles.headTitleActions}>
                // si grayedOut est défini, on affiche le titre en gris
                <Text style={[globalStyles.headTitle, grayedOut ? globalStyles.grayedOut : null]}>{title}</Text>
                <Text style={globalStyles.headTitle}>{title}</Text>
                {addButton && <TouchableOpacity
                    onPress={() => {
                        router.push({
                            pathname: "/activities/create",
                        });
                    }}>
                    <AntDesign name="pluscircleo" size={26} color="black" />
                </TouchableOpacity>}
            </View>
        </View>
    )
}