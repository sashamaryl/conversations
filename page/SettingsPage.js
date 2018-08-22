import React, { Component } from 'react';
import ReactNative, { Text, View , StyleSheet, Dimensions, PixelRatio, ImageBackground, ScrollView} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import styles , {InsetView, InsetText, P,H1,H2,H3,HR, BullHeaderMain, height, width, homeScreenImage, color, BullHeader} from "././styles.js";
import {getLocalizedString} from ".././Languages/LanguageChooser";
import {ProjectDescription, ProjectCredits} from "./AboutDescriptions";
import {saveSetting, getSetting} from ".././StorageUtils";


const pr = PixelRatio.get();
const radioToLanguageMap = {
  0: 'English',
  1 : 'Hindi'
};

const languageToRadioMap = {
  'English': 0,
  'Hindi': 1
};

const englishLocalization = getLocalizedString(radioToLanguageMap[0]);
const hindiLocalization = getLocalizedString(radioToLanguageMap[1]);

var radio_props = [
  {label: englishLocalization["languageName"], value: 0 },
  {label: hindiLocalization["languageName"], value: 1 }
];

export default class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.handleSettingsChanged = this.handleSettingsChanged.bind(this);
    this.state = {language: global.LANG};
  }

  handleSettingsChanged(value) {
      global.LANG = radioToLanguageMap[value];
      this.setState({language: global.LANG});
      saveSetting({name: "languagePreference", value: global.LANG});
  }

  _scrollTo(name, animated=false) {
    let child = this.refs[name]

    if (child != null) {
      let nodeHandle = ReactNative.findNodeHandle(this._scroller);
      child.measureLayout(nodeHandle, (_x, y) => {
        this._scroller.scrollTo({x: 0, y: y, animated: animated});
      }, (error) => {
        console.log(error)
      })
    }
  }

  // componentDidUpdate(prevProps) {
  //   let target = this.props.navigation.state.params.targetSection;
  //   if (target != null) this._scrollTo(target)
  // }


  render() {

    let localizedStrMap = getLocalizedString(global.LANG);
    let AboutDescription = ProjectDescription[global.LANG];

    return (
      <ImageBackground
          source={ homeScreenImage }
          imageStyle={{resizeMode: 'cover'}}
          style={{width: width, height: height}}
      >

        <ScrollView>
          <View style={[styles.insetView, styles.insetArea]}>
                 <H1>{localizedStrMap["settingsTitle"]}</H1>
                 <H2>{localizedStrMap["chooseLanguageOption"]}</H2>
                 <RadioForm
                    radio_props={radio_props}
                    buttonColor={color.buttons.background}
                    selectedButtonColor={color.buttons.selected}
                    initial={languageToRadioMap[global.LANG]}
                    buttonStyle={styles.settingsRadioButton}
                    labelStyle={[styles.settingsRadioFormLabel]}
                    onPress={(value) => {this.handleSettingsChanged(value)}}
                />
                <HR />

                  <H1>{localizedStrMap["aboutTheProjectTitle"]}</H1>
                  <AboutDescription />

                <HR />

                  <BullHeaderMain>{localizedStrMap["acknowledgementsTitle"]}</BullHeaderMain>
                  <ProjectCredits>{localizedStrMap}</ProjectCredits>

            </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

SettingsPage.navConfig = {
  screen: SettingsPage
}
