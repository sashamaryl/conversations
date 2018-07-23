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

import { H2, H3, P, Bull, Strong, InsetText, InsetView, TextContainer, FancyButton } from "./styles.js";

import { uploadText, InputField, uploadPages } from "./uploadHelper.js"

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
                <View style={{padding: "10%"}}>{uploadText.inputForm()}</View>

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
                    <Button onPress={() => this.setState({ state: UPLOADED })}
                            disabled={!uploaded.length}>
                        View Previous Uploads
                    </Button>
                </View>
            </View>
        );
    }

    renderStart() {
      let { video, uploaded, state} = this.state;
      return (
      <InsetView>
        <ScrollView style={{flex: 5}}>
          <H2>{uploadPages.title.START}</H2>
          {uploadPages.bodyText.START()}
        <FancyButton
          FancyButtonStyle={styles.purpleButton}
          style={styles.button}
          onPress={() => this.setState({ state: CHOOSER })}>
          {uploadPages.buttonText.START()}
        </FancyButton>
      </ScrollView>
    </InsetView>
    )}

    renderContent() {
      // return this.renderStart()
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


    render() {
      let { state } = this.state;
      return (
          <View style={styles.container}>
              <Image source={backgroundPicture}
                     style={styles.backImage}
                     resizeMode="stretch" />
            <InsetView>

                {this.renderContent()}

            </InsetView>
          </View>
                );
    }
}


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


UploadPage.navConfig = {
    screen: UploadPage,

    navigationOptions: ({navigation}) => ({
        headerTitle: "About this Project"
    })
}
