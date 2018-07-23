import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  PixelRatio,
  View,
  Dimensions
} from 'react-native';


//measured from phone
export const pr = PixelRatio.get();
export const height = Dimensions.get("window").height;
export const width = Dimensions.get("window").width;

//our color palette
const darkestBlue = "rgb(43, 35, 103)"; // backgrounds, buttons, text on white
const linkBlue = "#4682b4"; // for links only
const lightBlue = "rgb(43, 35, 103)";
const ourWhite = "#ffffff";

export const color = {
  background: darkestBlue,
  insetFrame: ourWhite,
  buttons: darkestBlue,
  selectedButtons: lightBlue,
  textOnWhite: darkestBlue,
  links: linkBlue,
}

//fudge factors
export const bottomScrollerMarginFactor = 0.18;// fixes scroll pages getting stuck at the bottom


export const InsetFrame = (children) => {
  return (
        <ScrollView style={{
          backgroundColor: insetFrame,
          width: width*0.9,
          height: height,
          marginLeft: width*0.05,
          marginTop: height*0.05,
          marginBottom: height*bottomScrollerMarginFactor,
          padding: 10*pr,
        }}>{children}</ScrollView>
      )
}

export const homeScreenImage = require('.././assets/BackgroundForAppLanding.png');

/***
H1
H2
H3
H4
H5
H6

Strong
Em
P
A (link)
BulletList (+ headers)

InnerView
ErrorBox
horizontalLine
text area (mostly horizontal margins)
indent text area


placement of objects icons? size box for objects? grid placement?



set colors
text/reverse text
selected/not selected
icon/reverse icon
backgrounds

***** SETTINGS PAGE ******
const mystyles = StyleSheet.create({
  BackGroundStyle: {
     flex: 1,
     flexDirection: 'column'
  },
  SettingsTitle: {
     paddingTop: 10*pr,
     paddingLeft: 15*pr,
  },
  languageChooser: {
      paddingLeft: 20*pr
  },
  AboutDesc: {
     paddingLeft: 10*pr,
     paddingRight: 10*pr,
     marginBottom: 10*pr
  },

});


****** UPLOAD PAGE *******


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row"
    },
    contentWrapper: {
        flexDirection: 'column',
        flex: 1
    },
    videoThumnail: {
      height: 90,
      width: 160,
      margin: "5%",
      paddingRight: "20%",
      backgroundColor: "#54c"
    },
    buttonRow: {
        width: "90%",
        flexDirection: "row",
        justifyContent:"center",
        alignItems: "flex-end"
    },
    progressBar: {
        backgroundColor: "#333",
        width: 500
    },

    uploadedItem: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%"
    },
    backImage: {
        position: "absolute",
        height: height,
        width: width
    },
    innerView: {
        backgroundColor: "#fff",
        width: "95%",
        height: "95%",
        padding: "1%",
        paddingRight: "5%",
        margin: "auto",
        alignSelf: "center",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flexDirection: "row"
    },
    button: {
        flex: 1,
        height: "20%",
    },
    purpleButton: {
        backgroundColor: "#262C66",
        color: "white"
    },
    inputField: {
    }
  });


******** HELP PAGE *******
const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    section: {
        paddingLeft: 40
    },

    sectionHead: {
        backgroundColor: "white",
        borderTopColor: "#aaa",
        borderTopWidth: 1,
        flex: 1,
        flexDirection: "row",
    },

    sectionIcon: {
        height: 40,
        width: 40,
        position: "absolute",
        left: 0,
        top: 10
    },

    sectionTitle: {
        fontWeight: "bold",
        paddingLeft: 50
    },

    listenButton: {
        position: "absolute",
        right: 10,
        top: 10
    },

    listenButtonImageStyle: {
        height: 50,
        width: 50
    },

    listenButtonImageLoadingStyle: {
        opacity: 0.5
    }
})

***/

// mark a
export const TextContainer = ({style, children}) => (
  <Text style={[styles.bodyText, styles.textContainer, style]}>
    {children}
  </Text>
);

export const InsetView = ({style, children, props}) => (
  <View style={[styles.insetView, style]} props={props}>
      {children}
  </View>
);

export const InsetText = ({style, children}) => (
  <Text style={[styles.bodyText, styles.insetText, style]}>
    {children}
  </Text>
);

export const H1 = ({style, children}) => (
  <Text style={[styles.bodyText, styles.h1, style]}>
    {children}
  </Text>
);

export const H2 = ({style, children}) => (
  <Text style={[styles.bodyText, styles.h2, style]}>
    {children}
  </Text>
);

export const H3 = ({style, children}) => (
  <Text style={[styles.bodyText, styles.h3, style]}>
    {children}
  </Text>
);

export const H4 = ({style, children}) => (
  <Text style={[styles.bodyText, styles.h4, style]}>
    {children}
  </Text>
)
export const H5 = ({style, children}) =>
  <Text style={[styles.bodyText, styles.h5, style]}>
    {children}
  </Text>

export const P = ({children, style}) => (
    <Text style={[styles.bodyText, style]}>
        { children }
    </Text>
);

export const ErrorBox = ({style, children}) => (
    <Text style={[styles.bodyText, styles.errorText, style]}>
        {children}
    </Text>
);

export const A = ({children, href, onPress, style, ...props}) => (
    <Text style={[styles.link, style]} onPress={onPress || (() => Linking.openURL(href))}>
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
    <Text style={[styles.bodyText, styles.liText, styles.center]}>
        {children}
    </Text>
);

//header for bullets
export const BullHeader = ({children}) => (
    <Text style={[styles.bullHeader, styles.bodyText, styles.liText, styles.bold, styles.center]}>
        {children}
    </Text>
);

//an larger bullet header with slightly more spacing
export const BullHeaderMain = ({children}) => (
    <Text style={[styles.bullHeaderMain , styles.liText, styles.bold, styles.center]}>
        {children}
    </Text>
);

export const HR = () => (
    <View style={styles.horizontalLine}></View>
);
//mark s
const styles = StyleSheet.create({
    header: {
        color: "red",
        fontWeight: "100"
    },

    horizontalLine: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginTop: 3*pr
    },

    h2: {
        fontSize: 8 * pr,
        lineHeight: 10 * pr,
        fontWeight: 'bold',
        color: 'rgb(43, 35, 103)',
        marginTop: height * 0.1
        /* textDecorationColor: "#ddd",
         * textDecorationLine: "underline" */
    },
    h3: {
         fontSize: 9*pr,
         color: darkestBlue,
    },
    h4: {
      fontSize: 7*pr,
    },
    bodyText: {
        fontSize: 6*pr,
        lineHeight: 20,
        padding: 5,
        textAlign: "left"
    },

    errorText: {
        borderWidth: 1,
        borderColor: "maroon",
        padding: 10
    },

    liText: {
        paddingLeft: 20,
        paddingTop: 0
    },

    bold: {
        fontWeight: "bold"
    },

    em: {
        fontStyle: "italic"
    },

    link: {
        color: "#4682b4",
        textDecorationLine: "underline"
    },

    center: {
        textAlign: 'center'
    },

    bullHeader: {
        fontSize: 15 * pr,
        lineHeight: 20 * pr,
        padding: 15,
        textAlign: "justify"
    },

    bullHeaderMain: {
        fontSize: 16 * pr,
        lineHeight: 20 * pr,
        paddingTop: 19,
        textAlign: "justify"
    },
    textContainer: {
      paddingTop: 10*pr,
      paddingLeft: 15*pr
    },
    insetText:{
      padding: 10,
    },
    insetView: {
      paddingLeft: 10*pr,
      paddingRight: 18*pr,
      paddingBottom: 10*pr,
      backgroundColor: "white",
      width: width*0.9,
      height: height*0.75,
      marginRight: width*0.01
      // alignItems: "center",
      // marginLeft: width*0.05,
      // marginTop: height*0.05,
       // marginBottom: height*bottomScrollerMarginFactor,
    },

    // These are the Settings Page Styles . Merge in for the about page from here
    settingsRadioFormLabel: {
        lineHeight: 12*pr,
        width: 150
    },
    fontSize10: {
        fontSize: 7*pr
    },
    settingsRadioButton: {
        lineHeight: 10,
        alignSelf: 'flex-start'
    },

    PageTitle: {
      fontSize: 10 * pr
    },

    // These are unique settings from Help.js to be added or joined with styles above.
    sectionHead: {
        backgroundColor: "white",
        borderTopColor: "#aaa",
        borderTopWidth: 1,
        flex: 1,
        flexDirection: "row",
    },

    sectionIcon: {
        height: 40,
        width: 40,
        position: "absolute",
        left: 0,
        top: 10
    },
    sectionTitle: {
        fontWeight: "bold",
        paddingLeft: 50
    },

    listenButton: {
        position: "absolute",
        right: 10,
        top: 10
    },

    listenButtonImageStyle: {
        height: 50,
        width: 50
    },

    listenButtonImageLoadingStyle: {
        opacity: 0.5
    }

});

export default styles;
