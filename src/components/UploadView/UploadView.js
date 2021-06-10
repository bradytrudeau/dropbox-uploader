import React, {useState }  from 'react';
import {Dropbox} from 'dropbox';
import Photo from '../../Images/sample-photo-rbc.png';
import Icon from '../../Images/rbc-icon4.png';
import RecordingIcon from '../../Images/recording-icon.png';
import Logo from '../../Images/rbc-logo.png';
import { TextField } from '@material-ui/core';

const UploadView = () => {

  const [constraintObj, setContraintObj] = useState({ 
    audio: true, 
    video: true
  });
  const [vid, setVideo] = useState();
  const [photoHidden, setPhotoHidden] = useState(false);
  const [name, setName] = useState('');
  const [savedName, setSavedName] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState();
  const [curStatus, setCurStatus] = useState(true);
  const [selectedFile, setSelectedFile] = useState();
  const [chunks, setChunks] = useState([]);
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);

  // Handles upload of selected file to Dropbox
  const uploadToDropbox = () => {
    setIsFilePicked(false);
    setPhotoHidden(false);
    console.log('Selected File:', selectedFile);
    var ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
    
    var dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
    console.log('FILE:', selectedFile);
        dbx.filesUpload({path: '/' + selectedFile.name, contents: selectedFile})
        .then(function(response) {
          console.log(response);
          setMediaRecorder();
          setSelectedFile();
          setName('');
          setSavedName('');
        })
        .catch(function(error) {
          console.error(error);
        });    
    }

    // Turn on camera for recording
    const initRec = () => {
      setPhotoHidden(true);
      navigator.mediaDevices.getUserMedia(constraintObj)
      .then(function(stream) {
        setMediaRecorder(new MediaRecorder(stream));
        setVideo(stream);
        let video = document.querySelector('video');
            if ("srcObject" in video) {
                video.srcObject = stream;
            } else {
                //old version
                video.src = window.URL.createObjectURL(stream);
            }            
            video.onloadedmetadata = function(ev) {
                //show in the video element what is being captured by the webcam
                video.play();
            };
      })
      .catch(function(err) { 
          console.log(err.name, err.message); 
      });
    }

    // Starts recording of new video
    const startedRec = () => {
      setSelectedFile();
      setIsFilePicked(false);
      mediaRecorder.start();
      console.log('Recorder Status:', mediaRecorder.state);
      setCurStatus(false);
    }
    
    // Stops recording of new video and creates blob
    const stoppedRec = () => {
      mediaRecorder.stop();
      console.log('Recorder Status:', mediaRecorder.state);
      setCurStatus(true);

      mediaRecorder.ondataavailable = (e) => {
        console.log('RECORDING IS DONEEEEEEEE');
        chunks.push(e.data);
        console.log('EDATA:', e.data);        
      }
  
      mediaRecorder.onstop = (e) => {
        const blob = new Blob(chunks, { 'type' : 'video/mp4' });
        setChunks([]);
        const videoFile = new File([blob], `RBC WAFA 2021 ${savedName}.${"mp4"}`, { type: "video/mp4" })
        console.log('File:', videoFile);
        setMediaRecorder(null);
        setSelectedFile(videoFile);
        setIsFilePicked(true);
        setUploadVisible(false);
      }
    }

    // Handles input change and assigns input value to selectedFile variable
    const changeHandler = (event) => {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
      setUploadVisible(false);
      setPhotoHidden(true);
    };

    // Handles input change and assigns input value to selectedFile variable
    const nameChange = (event) => {
      setName(event.target.value);
      console.log('NAME:', name);
    };

    const saveName = () => {
      setSavedName(name);
      setUploadVisible(true);
    }
  
  return (
    <div>
      <img src={Logo} className="logo"></img>
      {/* Render either photo, live stream, or video file depending on state */}
      {!photoHidden ?
      <div className='player-wrapper'>
        <img src={Photo}/>
      </div> :
      null}
      {mediaRecorder ?
      <div className='player-wrapper'>
        <video src={vid} width="700" height="350" controls autoPlay muted/>
      </div> :
      null}
      {isFilePicked ?
      <video width="700" height="350" controls>
        <source src={URL.createObjectURL(selectedFile)}/>
      </video> :
      null}
      
      {/* Render icon if not recording and icon with RECORDING text over it if recording */}
      {!curStatus ?
      <h1
        className="icon"
      >
        <img src={RecordingIcon}/>
      </h1> :
      <h1
        className="icon"
      >
        <img src={Icon}/>
      </h1>}


      {!savedName ? 
        <span>
          <TextField 
            size='small'
            label="Your Name?"
            variant='outlined'
            value={name}
            onChange={nameChange} 
          />
        </span>
      :
      !mediaRecorder ?
      <span>     
        <label
          className="init-record" 
          htmlFor="init-record">
            INITIALIZE RECORDING
        </label>
        <input 
          id="init-record"
          onClick={initRec}
        />
      </span>  
      :
      curStatus ?
      <span>     
        <label
          className="video-record" 
          htmlFor="video-record">
            RECORD VIDEO
        </label>
        <input 
          id="video-record"
          onClick={startedRec}
        />
      </span>  
      :
      <span>     
        <label
          className="video-record" 
          htmlFor="video-record">
            STOP RECORDING
        </label>
        <input 
          id="video-record"
          onClick={stoppedRec}
        />
      </span>  
      }

      {!savedName ? 
      <span>
        <label 
          className="name-input-btn"
          htmlFor="confirm-name">
            SUBMIT NAME
        </label>
        <input 
          id="confirm-name"
          onClick={() => saveName()}
        /> 
      </span>
      :
      null}
      {uploadVisible ?
      <span>
        <label 
          className="file-upload"
          htmlFor="file-upload">
            UPLOAD VIDEO
        </label>
        <input 
          id="file-upload"
          type="file"
          onChange={changeHandler}
        /> 
      </span> :
      null}
      {isFilePicked ?
      <span>
        <label 
          className="file-upload"
          htmlFor="confirm-upload">
            SUBMIT VIDEO
        </label>
        <input 
          id="confirm-upload"
          type="submit"
          onClick={() => uploadToDropbox()}
        /> 
      </span> :
      null}
    </div>
  );
};

export default UploadView;