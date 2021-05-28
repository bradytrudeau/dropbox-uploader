import React, {useState} from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import { FaCameraRetro } from 'react-icons/fa';
import {Dropbox} from 'dropbox';
import ReactPlayer from 'react-player';


const RecordView = () => {
  const {
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ video: true });

  const [curStatus, setCurStatus] = useState(true);
  const [selectedFile, setSelectedFile] = useState();
  const [videoPreview, setPreview] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

  // Uploads existing file to dbx
  const uploadToDropbox = () => {
    // const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
    var ACCESS_TOKEN = 'sl.AxuAvN9xOeuB-kp6McDD4go1gVq_ZJSar4AFtlEZ28MDwEnvVO-Vwe7fRKigttuaH_UBfC20RYKD9pbT53A_DmLl_2nPuJ8M1QN0BzvBbI3iQSUKXb35LSfILx84wYjem85vAQ7j';
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

  // Uploads newly recorded video to dbx
  const uploadNewVideoToDropbox = (file) => {
    // const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
    var ACCESS_TOKEN = 'sl.AxuAvN9xOeuB-kp6McDD4go1gVq_ZJSar4AFtlEZ28MDwEnvVO-Vwe7fRKigttuaH_UBfC20RYKD9pbT53A_DmLl_2nPuJ8M1QN0BzvBbI3iQSUKXb35LSfILx84wYjem85vAQ7j';
    var dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
    console.log('FILE:', file);
        dbx.filesUpload({path: '/' + file.name, contents: file})
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.error(error);
        });
    }

  // Converts blob to file for upload to dbx
  const blobToFile = (blob) => {
    let newBlob = new File([blob], "rbc-wafa2.mp4");
    console.log('BLOB FILE:', newBlob);
    uploadNewVideoToDropbox(newBlob);
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
    const audioBlob = await fetch(mediaBlobUrl).then(r => r.blob());
    const url = new Blob ([audioBlob]);
    let audioFile = url;
    console.log('Audio File:', audioFile);
    console.log('BLOB:', audioBlob);

    // Calls function to convert blob to file
    blobToFile(url);
  }

  // Handles input change and assigns input value to selectedFile variable
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
    setPreview(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div>
      {!isFilePicked ?
      <div className='player-wrapper'>
        <ReactPlayer 
          className='react-player'
          url='https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          width='50%'
          height='100%' />
      </div> :
      <div className='player-wrapper'>
        <ReactPlayer 
          className='react-player'
          url={videoPreview}
          width='50%'
          height='100%' />
      </div>}
      <h1
        className="icon"
      >
        <FaCameraRetro/>
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

export default RecordView;