import React, { Component } from "react";
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    Dimensions,
    TouchableHighlight,
    Animated,
    TouchableWithoutFeedback,
    View,
    CheckBox,
    AsyncStorage
} from "react-native";

import ImagePicker from "react-native-image-picker";
import firebase from "react-native-firebase";

import { Button } from "../component/Button.js";
import Progress from "../component/Progress.js";

import { H2, H3, P, Bull, Strong } from "./styles.js";

const START = 1
const CHOOSER = 2
const LOGGING_IN = 3
const UPLOADING = 4
const UPLOADED = 5
const MYVIDEOS = 6

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height
const backgroundPicture = require("../assets/skyline_bg.png");

function formatSize(bytes) {
    return `${(bytes/1024/1024).toFixed(1)} MB`;
}

function formatDate(when) {
    if (!when) return "????/??/??";

    if (typeof when === "string" || typeof when === "number")
        when = new Date(when);

    return [when.getFullYear(), when.getMonth(), when.getDate()].join("/");
}

const UploadsList = ({videos, onDelete}) => (
    <FlatList
        style={styles.uploads}
        contentContainerStyle={{justifyContent: "center"}}
        data={videos}
        renderItem={({item, index}) => (
            <View style={styles.uploadedItem} key={item.date}>
                <Text>
                    <Strong>{item.name}</Strong>{"\n"}
                    Uploaded {formatDate(item.date)}
                </Text>
                <Button buttonStyle={{ backgroundColor: "red", color: "white"}}
                        style={{alignSelf: "flex-end"}}
                        onPress={() => onDelete(item)}
                        disabled={item.deletionRequested} >
                {item.deletionRequested ? "Deletion Requested" : "Delete"}
                </Button>
            </View>
        )}
    />
);

const shareStoryText = () => (
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



export default class UploadPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            video: null,
            state: START,
            checked: false,
            myKey: null,
            uploaded: []
        };
    }



uploadPages = (type, state) => {
  let elements = {
    title: {
      START: "Share Your Story",
      CHOOSER: "Add Details",
      LOGGING_IN:"",
      UPLOADING: "",
      UPLOADED: "Thanks for Sharing!",
      MYVIDEOS: ""
    },
    bodyText: {
      START: shareStoryText(),
      CHOOSER: inputForm(),
      UPLOADING: "",
      LOGGING_IN:"",
      UPLOADED: thankYouText(),
      MYVIDEOS: ""
    },
    renderPage: {
      LOGGING_IN:"",
      UPLOADED: "",
      MYVIDEOS: ""
    },
    buttonFunction: {
      START: () => goToState(CHOOSER),
      CHOOSER: () => goToState(LOGGING_IN),
      LOGGING_IN: () => goToState(UPLOADING),
      UPLOADING: () => goToState(UPLOADED),
      UPLOADED: () => goToState(MYVIDEOS),
      MYVIDEOS: () => goToState(START),
    },
    buttonText: {
      START: "Start",
      CHOOSER: "Upload Video",
      LOGGING_IN:"",
      UPLOADING: "",
      UPLOADED: "home",
      MYVIDEOS: ""
    },
  }

  return  () => elements[type][state]  ;

  };

    componentDidMount() {
        this.getUploadedVideos().then((videos) => this.setState({uploaded: videos}),
                                        err => console.error(err));

        firebase.messaging().getToken()
        .then(fcmToken => {
            if (fcmToken) {
            // user has a device token
            console.log("user has a device token; fcmtoken = ", fcmToken);
            } else {
            // user doesn't have a device token yet
            console.log("user doesn't have a device token yet; fcmtoken = ", fcmToken);
            }
        }).catch(function(err) {
            console.error('An error occurred while retrieving token. ', err);
        });
        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
            // Process your token as required
            console.log("Process your token as required; refreshed token = ", fcmToken);
        });

        this.onTokenRefreshListener();
    }

    selectVideo = () => {
        ImagePicker.showImagePicker({
            title: "Video Picker",
            takePhotoButtonTitle: 'Take Video...',
            mediaType: "video",
            durationLimit: 5*60,
        }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled video picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else if (response.path) {
                this.setState({video: response});
            }
        });
    }

    saveVideoInfo(video) {
        var date = video.date || new Date().toISOString();

        if (typeof date !== "string")
            date = date.toISOString();

        return AsyncStorage.mergeItem("Aashiyaan:uploaded",
                                      JSON.stringify({
                                          [date]: video
                                      }))
                           .then(() => this.getUploadedVideos());
    }

    async getUploadedVideos() {
        var videos = await AsyncStorage.getItem("Aashiyaan:uploaded");

        if (videos) {
            videos = JSON.parse(videos);
            return Object.keys(videos).map(k => videos[k]);
        } else {
            return [];
        }
    }

    dummyUpload = () => {
        var transferred = 0, total = 100000000;
        this.setState({ state: UPLOADING, upload: { transferred: 0, total: total} });
        setInterval(() => {
            this.setState({
                upload: {
                    transferred: (transferred += 1000000),
                    total: total
                }
            })
        }, 500);
    }

    upload = () => {
        let {video} = this.state;

        if (video) {
            firebase.auth().signInAnonymouslyAndRetrieveData()
                    .then(creds => {
                        this.setState({
                            user: creds.user.toJSON()
                        });

                        let refpath = `${creds.user.uid}/${this.videoName(video)}`;
                        let ref = firebase.storage().ref(refpath);

                        var metadata = {
                            contentType: 'video/mp4',
                            customMetadata: {
                                'userAuthId': this.state.user.uid,
                                "notifyIfPublished": this.state.checked
                            }
                          };

                        let unsubscribe = ref.putFile(video.path, metadata).on(
                            firebase.storage.TaskEvent.STATE_CHANGED,
                            (event) => {
                                let {state, bytesTransferred, totalBytes} = event;
                                this.setState({
                                    upload: {
                                        transferred: bytesTransferred,
                                        total: totalBytes
                                    },
                                    state: UPLOADING
                                });

                                if (state === firebase.storage.TaskState.SUCCESS) {
                                    this.setState({
                                        state: UPLOADED,
                                        successMessage: "Your video was successfully uploaded."
                                    });
                                    video.name = this.videoName(video);
                                    video.size = totalBytes;
                                    video.date = new Date();
                                    this.saveVideoInfo(video).then(videos => this.setState({ uploaded: videos }),
                                                                   error => console.log(error));
                                    unsubscribe();
                                }
                            },
                            (error) => {
                                unsubscribe();
                                this.setState({
                                    state: CHOOSER,
                                    error: error
                                });
                                console.error(error);
                            }
                        );
                    });
        }
    }

    onDelete = (video) => {
        let {name, date} = video;
        firebase.firestore().collection("deletionRequests").add({
            videoName: name,
            videoDate: date
        }).then(_ => {
            video.deletionRequested = true;
            return this.saveVideoInfo(video);
        }).then(videos => this.setState({ videos: videos }));
    }

    videoName = (video) => {
        if (!video) video = this.state.video;

        return video ? video.path.split("/").slice(-1)[0] : "";
    }

    renderUploaded = () => {
        let {successMessage} = this.state;
        return (
            <View style={styles.contentWrapper}>
                {successMessage ? <P>{successMessage}</P> : null}
                <UploadsList videos={this.state.uploaded} onDelete={this.onDelete}/>
            </View>
        );
    }

    renderUploader = () => {
        let {total, transferred} = this.state.upload;

        return (
            <View style={styles.contentWrapper}>
                <P>Uploading {this.videoName()}</P>
                <Progress current={transferred}
                          total={total}
                          text={`${formatSize(transferred)}/${formatSize(total)} bytes uploaded`}
                          style={styles.progressBar}
                />
            </View>
        );
    }

    renderChooser = () => {
        let {checked, video, upload, uploaded} = this.state;
        return (
            <View style={styles.contentWrapper}>
                <P>
                    INSERT EXPLANATORY TEXT HERE
                </P>

                {uploaded.length > 0 && (
                     <P>
                         You have uploaded {uploaded.length} videos
                     </P>)}

                <View style={styles.buttonRow}>
                    <Button onPress={this.selectVideo}>
                        Select a Video
                    </Button>

                    <Button onPress={this.upload}
                            disabled={!video} >
                        Upload {this.videoName()}
                    </Button>
                    <Button onPress={() => this.setState({ state: UPLOADED })} disabled={!uploaded.length}>
                        View Previous Uploads
                    </Button>
                </View>
                    <TouchableWithoutFeedback onPress={() => this.setState({checked: !checked})}>
                        <View style={{ flexDirection: 'row' }}>
                            <CheckBox
                                value={checked}
                                disabled={!video}
                            />
                            <Text style={{marginTop: 5}}> Notify me if my video is uploaded to YouTube</Text>
                        </View>
                    </TouchableWithoutFeedback>
            </View>
        );
    }

    renderStart() {
      let { video, uploaded } = this.state;
      return (
      <View style={styles.contentWrapper}>
          {this.shareStoryText}
          <View style={styles.buttonRow}>
              <Button onPress={this.selectVideo}>
                  Select a Video
              </Button>

              <Button onPress={this.upload}
                      disabled={!video} >
                  Upload {this.videoName()}
              </Button>
              <Button onPress={() => this.setState({ state: UPLOADED })} disabled={!uploaded.length}>
                  View Previous Uploads
              </Button>
          </View>
      </View>
    )}

    renderContent() {
        switch(this.state.state) {
            case START:
                return this.renderStart();
            case CHOOSER:
                return this.renderChooser();
            case UPLOADING:
                return this.renderUploader();
            case UPLOADED:
                return this.renderUploaded();

            default:
                return this.renderStart();
        }
    }


    goToState = (newState) => {
      this.setState({ state: newState })
    }

    render() {
      let { state } = this.state;


      const title = () => "title";
      const bodyText = () => "bodyText";
      const buttonFunction = () => console.log("button pushed"); //uploadPages.buttonFunction[state];
      const buttonText = () =>"buttonText";
      const renderFunction = () =>"renderFunction";

        return (
          <View style={{alignItems: "center", justifyContent: "center"}}>
              <Image source={backgroundPicture}
                     style={styles.backImage}
                     resizeMode="stretch" />
              <View style={styles.innerView}>
                  <H2>{this.uploadPages(title, this.state.state)}</H2>
                    {this.renderContent()}
                    {bodyText}
                    <View style={styles.buttonRow}>
                        <Button
                            buttonStyle={styles.purpleButton}
                            style={styles.button}
                            onPress={() => goToState(CHOOSER)}
                            >Chooser</Button>
                        <Button
                            buttonStyle={styles.purpleButton}
                            style={styles.button}
                            onPress={() => goToState(LOGGING_IN)}
                            >Chooser</Button>
                        <Button
                            buttonStyle={styles.purpleButton}
                            style={styles.button}
                            onPress={() => goToState(UPLOADING)}
                            >Chooser</Button>
                        <Button
                            buttonStyle={styles.purpleButton}
                            style={styles.button}
                            onPress={() => goToState(UPLOADED)}
                            >Chooser</Button>
                        <Button
                            buttonStyle={styles.purpleButton}
                            style={styles.button}
                            onPress={() => goToState(MYVIDEOS)}
                            >Chooser</Button>
                        <Button
                            buttonStyle={styles.purpleButton}
                            style={styles.button}
                            onPress={() => goToState(START)}
                            >Chooser</Button>
                        <Button
                            buttonStyle={styles.purpleButton}
                            style={styles.button}
                            onPress={buttonFunction}>
                                {buttonText}
                            </Button>
                </View>
              </View>
            </View>
                );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentWrapper: {
        flexDirection: 'column',
        flex: 1
    },
    buttonRow: {
        flexDirection: "row"
    },
    progressBar: {
        backgroundColor: "#333",
        width: 500
    },

    uploads: {

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
        padding: "5%",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center"
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
  });


UploadPage.navConfig = {
    screen: UploadPage,

    navigationOptions: ({navigation}) => ({
        headerTitle: "About this Project"
    })
}
