import React, { Component } from 'react';
import './App.css';
import Logo from '../../Images/rbc-logo.png';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import RecordView from '../RecordView/RecordView';
import UploadView from '../UploadView/UploadView';

class App extends Component {

  render() {
    return (
      <div className="App">
        <img src={Logo} className="logo"></img>
          <div id='hero'>
            {/* <Hero/> */}
            <MobileView>
              <RecordView/>
            </MobileView>
            <BrowserView>
              <UploadView/>
            </BrowserView>
          </div>
      </div>
    );
  }
}

export default App;