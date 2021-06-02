import React, { Component } from 'react';
import './App.css';
import Logo from '../../Images/rbc-logo.png';
import {
  BrowserView,
  MobileView,
} from "react-device-detect";
import RecordView from '../RecordView/RecordView';
import UploadView from '../UploadView/UploadView';
import RecordingAPI from "../TestComponent/TestComponent";

class App extends Component {

  render() {
    return (
      <div className="App">
          {/* <RecordingAPI/> */}
          <MobileView>
            <div className='mobile'>
              <div id='mobile-inner'>
                <RecordView/>
              </div>
            </div>
          </MobileView>
          <BrowserView>
            <div className='browser'>
              <div id='browser-inner'>
                <UploadView/>
              </div>
            </div>
          </BrowserView>
      </div>
    );
  }
}

export default App;