import React, {useState}  from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import { FaCameraRetro } from 'react-icons/fa';
import {Dropbox} from 'dropbox';
import ReactPlayer from 'react-player';
import Photo from '../../Images/sample-photo-rbc.png';
import Icon from '../../Images/rbc-icon4.png';
import Logo from '../../Images/rbc-logo.png';
import { v4 as uuidv4 } from 'uuid';




const UploadView = () => {
  const {
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ video: true, audio: true, blobPropertyBag: {
    type: "video/mp4"
} });

  const [curStatus, setCurStatus] = useState(true);
  const [selectedFile, setSelectedFile] = useState();
  const [videoPreview, setPreview] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

  // Handles upload of selected file to Dropbox
  const uploadToDropbox = () => {
    // const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
    console.log('Selected File:', selectedFile);
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
      setIsFilePicked(true);
      setPreview(URL.createObjectURL(event.target.files[0]));
    };
  

  return (
    <div>
      <img src={Logo} className="logo"></img>
      {!isFilePicked ?
      <div className='player-wrapper'>
        <img src={Photo}/>
      </div> :
      <video width="700" height="350" controls>
        <source src={URL.createObjectURL(selectedFile)}/>
      </video>
      }
      <h1
        className="icon"
      >
        <img src={Icon}/>
      </h1>
      {curStatus ?
      <span>     
        <label
          className="video-record" 
          for="video-record">
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
          for="video-record">
            STOP RECORDING
        </label>
        <input 
          id="video-record"
          onClick={stoppedRec}
        />
      </span>  
      }
      {!isFilePicked ?
      <span>
        <label 
          className="file-upload"
          for="file-upload">
            UPLOAD VIDEO
        </label>
        <input 
          id="file-upload"
          type="file"
          onChange={changeHandler}
        /> 
      </span> :
      <span>
        <label 
          className="file-upload"
          for="confirm-upload">
            SUBMIT VIDEO
        </label>
        <input 
          id="confirm-upload"
          type="submit"
          onClick={() => uploadToDropbox()}
        /> 
      </span>}
    </div>
  );
};

export default UploadView;