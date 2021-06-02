import React, {useState} from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import { FaCameraRetro } from 'react-icons/fa';
import {Dropbox} from 'dropbox';
import ReactPlayer from 'react-player';
import Logo from '../../Images/rbc-logo.png';
import Photo from '../../Images/sample-photo-rbc.png';
import Icon from '../../Images/rbc-icon4.png';
import { v4 as uuidv4 } from 'uuid';



const RecordView = () => {
  const {
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ video: true, audio: true, blobPropertyBag: {
    type: "video/mp4"
} });

  const [curStatus, setCurStatus] = useState(true);
  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);


  // Uploads selected file to dbx
  const uploadToDropbox = () => {
    // const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
    var ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
    var dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
    console.log('FILE:', selectedFile);
        dbx.filesUpload({path: '/' + selectedFile.name, contents: selectedFile})
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.error(error);
        });
    }

  // Starts recording of new video
  const startedRec = () => {
    startRecording();
    setCurStatus(false);
  }

  // Stops recording of new video and creates blob
  const stoppedRec = async () => {
    stopRecording();
    setCurStatus(true);
    const videoBlob = await fetch(mediaBlobUrl).then(r => r.blob());
    const url = new Blob ([videoBlob]);
    // Creates a video file with a randomized file name
    const videoFile = new File([videoBlob], `${uuidv4()}.${"mp4"}`, { type: "video/mp4" })

    console.log('Video File:', videoFile);
    console.log('Blob:', url);
      
    
    setSelectedFile(videoFile);
    setIsFilePicked(true);
  }

  // Handles input change and assigns input value to selectedFile variable
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log('ETF:', event.target.files[0]);
    setIsFilePicked(true);
  };


  return (
    <div>
      <img width="50%" height="50%" src={Logo} className="logo-mobile"></img>
      {!isFilePicked ?
        <div className='player-wrapper-mobile'>
          <img width="300" height="150" src={Photo}/>
        </div> :
        <video width="300" height="150" controls>
          <source src={URL.createObjectURL(selectedFile)}/>
        </video>
      }
      <h1
        className="icon"
      >
      <img width="50%" height="50%" src={Icon}/>
      </h1>
      {curStatus ?
      <span>     
        <label
          className="video-record-mobile" 
          for="video-record-mobile">
            RECORD VIDEO
        </label>
        <input 
          id="video-record-mobile"
          onClick={startedRec}
        />
      </span>  
      :
      <span>     
        <label
          className="video-record-mobile" 
          for="video-record-mobile">
            STOP RECORDING
        </label>
        <input 
          id="video-record-mobile"
          onClick={stoppedRec}
        />
      </span>  
      }
      {!isFilePicked ?
      <span>
        <label 
          className="file-upload-mobile"
          for="file-upload-mobile">
            UPLOAD VIDEO
        </label>
        <input 
          id="file-upload-mobile"
          type="file"
          onChange={changeHandler}
        /> 
      </span> :
      <span>
        <label 
          className="file-upload-mobile"
          for="confirm-upload-mobile">
            SUBMIT VIDEO
        </label>
        <input 
          id="confirm-upload-mobile"
          type="submit"
          onClick={() => uploadToDropbox()}
        /> 
      </span>}
    </div>
  );
};

export default RecordView;