import React from 'react';
import {
-  Text,
-  View,
-  StyleSheet,
-  TextInput,
-  Dimensions,
-  TouchableHighlight,
-  Animated,
-  Image
} from 'react-native';
- import ImagePicker from "react-native-image-picker";
- import firebase from "react-native-firebase";
- import UploadPage from "./page/Upload";
- import { H2, H3, P, Bull } from "./page/styles.js";
- import { Button } from "./component/Button.js";



- const width = Dimensions.get("window").width
- const height = Dimensions.get("window").height


shareStoryText = () => (
  <View>
    <P>The women of Aashiyaan shared their strategies to stay safe.</P>
    <P>Share YOUR strategy!
      Create a story
      Record a video with your device.
      Submit one story or strategy per video.
      Keep clips short. We recommend less than 2 minutes.
      Your story may be added to Aashiyaan! </P>
  </View>
);

class InputField extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      text: "",
    }
  }
  render(){
  let { text, placeholder } = this.props;
    return (
      <View style={styles.inputField}>
        <Text>{text}</Text>
        <TextInput
          onTextChange={(text) => this.setState({text})}
          placeholder={placeholder}
        />
      </View>
    )}
}    ;

inputForm = () => (
    <View>
      <InputField
        text={<P>My story is about ...</P>}
        placeholder="Details (optional)" />
      <InputField
        text={<P>Please contact me if my video will appear on aashiyaan.</P>}
        placeholder="Email (optional)" />
    </View>
  );

thankYouText = () => (
      <View>
        <P>Your video may appear on Aashiyan!</P>
        <P>If you would like to have your video removed, contact us at idoc.conversations@gmail.com </P>
      </View>
  );

const uploadPages = {
    titles: {
      start: "Share Your Story",
      details: "Add Details",
      thankyou: "Thanks for Sharing!"
    },
    bodyText: {
      start: shareStoryText(),
      details: inputForm(),
      thankyou: thankYouText(),
    },
    buttonFunction: {
      start: "details",
      details: "thankyou",
      thankyou: "done",
    },
    buttonText: {
      start: "Start",
      details: "Upload Video",
      thankyou: "home",
    },
  };

/***
Buttons:
 share new strategy
 my shared videos



***/


/***
view videos page
delete videos option/page
***/


export default class tempPseudo extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        stage: "start",
      };
    };

// // parens may need to be brackets
//   goToStage = ( nextStage ) => (
//       this.setState({ stage: nextStage })
//   );

  render(){

    let { stage } = this.state;
/*

START
CHOOSER
LOGGING_IN
UPLOADING
UPLOADED
MYVIDEOS

*/
    const title = uploadPages.titles[stage];
    const bodyText = uploadPages.bodyText[stage];
    const buttonFunction = () => this.goToStage(uploadPages.buttonFunction[stage]);
    const buttonText = uploadPages.buttonText[stage];


    return(
      <View style={{alignItems: "center", justifyContent: "center"}}>
        <Image source={require("./assets/skyline_bg.png")}
               style={styles.backImage}
               resizeMode="cover" />
        <View style={styles.innerView}>
            <H2>{title}</H2>
            {bodyText}
            <Button
              buttonStyle={styles.purpleButton}
              style={styles.button}
              onPress={buttonFunction}>
                {buttonText}
            </Button>
        </View>
      </View>
    );
  }
};


const styles = StyleSheet.create({
  backImage: {
    position: "absolute",
    height: height,
    width: width
  },
  innerView: {
    width: "100%",
    backgroundColor: "#fff",
    width: "95%",
    height: "100%",
    padding: "5%"
  },
  button: {
    alignSelf: "center",
    width: "100%",
    height: "20%",
  },
  purpleButton: {
    backgroundColor: "#262C66",
    color: "white"
  },
  inputField: {
  }
})


tempPseudo.navConfig = {
    screen: tempPseudo,

    navigationOptions: ({navigation}) => ({
        headerTitle: "About this Project"
    })
}
