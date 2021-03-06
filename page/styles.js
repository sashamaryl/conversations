import React from 'react';
import { Linking, StyleSheet, Text } from 'react-native';

export const H2 = ({children}) => (
    <Text style={[styles.bodyText, styles.h2]}>
        {children}
    </Text>
);

export const P = ({children}) => (
    <Text style={styles.bodyText}>
        { children}
    </Text>
);

export const A = ({children, href}) => (
    <Text style={styles.link} onPress={() => Linking.openURL(href)}>
        { children }
    </Text>
);

export const Strong = ({children}) => (
    <Text style={styles.bold}>
        { children }
    </Text>
);

export const Em = ({children}) => (
    <Text style={styles.em}>
        { children }
    </Text>
);

export const Bull = ({children}) => (
    <Text style={[styles.bodyText, styles.liText]}>
        {'‣'} {children}
    </Text>
);


const styles = StyleSheet.create({
    header: {
        color: "red",
        fontWeight: "100"
    },

    h2: {
        fontSize: 18,
        lineHeight: 25,
        /* textDecorationColor: "#ddd",
         * textDecorationLine: "underline" */
    },

    bodyText: {
        fontSize: 12,
        lineHeight: 20,
        padding: 15,
        textAlign: "justify"
    },

    liText: {
        paddingLeft: 20,
        paddingTop: 0
    },

    bold: {
        fontWeight: "bold"
    },

    link: {
        color: "#4682b4",
        textDecorationLine: "underline"
    }
});

export default styles;
