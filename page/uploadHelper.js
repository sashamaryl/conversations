import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableHighlight,
  Image
} from "react-native";
import { H2, H3, P, Bull, Strong } from "./styles.js";

export const uploadText = {
  "shareStoryText": () => (
      <Text> The women of Aashiyaan shared their strategies to stay safe.{"\n\n"}
      <Text style={{paddingLeft: "10%"}}>• <Text style={{color: "rgb(43, 35, 103)", fontWeight:"bold"}}>Share YOUR strategy!</Text>{"\n"}
        • Record a video with your device.{"\n"}
        • Submit one story or strategy per video.{"\n"}
        • Keep clips short. We recommend less than 2 minutes.{"\n"}
        • Your story may be added to Aashiyaan!</Text></Text>
  ),
  "inputForm": () => (
      <View>
        <InputField
          text={<P>My story is about ...</P>}
          placeholder="Details (optional)" />
          <InputField
            text={<P>Please contact me if my video will appear on aashiyaan.</P>}
            placeholder="Email (optional)" />
      </View>
    ),
    "thankYouText": () => (
      <View>
        <P>Your video may appear on Aashiyan!</P>
        <P>If you would like to have your video removed, contact us at idoc.conversations@gmail.com </P>
      </View>
      )
  };



  export const uploadPages = {
      title: {
        START: "Share Your Story",
        CHOOSER: () => <P>Add Details</P>,
        LOGGING_IN: () => <P></P>,
        UPLOADING: () => <P></P>,
        UPLOADED: () => <P>Thanks for Sharing!</P>,
        MYVIDEOS: () => <P></P>,
      },
      bodyText: {
        START: () => uploadText.shareStoryText(),
        CHOOSER: () => inputForm(),
        UPLOADING: () => <P>""</P>,
        LOGGING_IN:() => <P>""</P>,
        UPLOADED: () => thankYouText(),
        MYVIDEOS:() =>  <P>""</P>
      },
      renderPage: {
        LOGGING_IN: () => <P>""</P>,
        UPLOADED: () => <P>""</P>,
        MYVIDEOS: () => <P>""</P>
      },
      buttonFunction: {
        START: () => "CHOOSER",
        CHOOSER: () => "LOGGING_IN",
        LOGGING_IN: () => "UPLOADING",
        UPLOADING: () => "UPLOADED",
        UPLOADED: () => "MYVIDEOS",
        MYVIDEOS: () => "START",
      },
      buttonText: {
        START: () => <P>Start,</P>,
        CHOOSER: () => <P>Upload Video,</P>,
        LOGGING_IN: () => <P>,</P>,
        UPLOADING: () => <P>,</P>,
        UPLOADED:  () => <P>home,</P>,
        MYVIDEOS:  () => <P></P>,
      },
    };



    export class InputField extends React.Component {
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
      };



      const styles = StyleSheet.create({
        bullet: {
          textAlign: "left",
          lineHeight: 1,
          paddingLeft: "6%",
        }

      })
