import React, {useState} from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import { FaCameraRetro } from 'react-icons/fa';
import {Dropbox} from 'dropbox';

const RecordView = () => {
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ video: true });

  const [curStatus, setCurStatus] = useState(true);

  const uploadToDropbox = () => {
    const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
    var ACCESS_TOKEN = 'sl.AxuAvN9xOeuB-kp6McDD4go1gVq_ZJSar4AFtlEZ28MDwEnvVO-Vwe7fRKigttuaH_UBfC20RYKD9pbT53A_DmLl_2nPuJ8M1QN0BzvBbI3iQSUKXb35LSfILx84wYjem85vAQ7j';
    var dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
    var fileInput = document.getElementById('file-upload');
    var file = fileInput.files[0];
    console.log('FILE:', file);
        dbx.filesUpload({path: '/' + file.name, contents: file})
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.error(error);
        });
    }

  const uploadNewVideoToDropbox = (file) => {
    const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
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

  const blobToFile = (blob) => {
    let newBlob = new File([blob], "rbc-wafa2.mp4");
    console.log('BLOB FILE:', newBlob);
    uploadNewVideoToDropbox(newBlob);
  }

  const startedRec = () => {
    startRecording();
    setCurStatus(false);
  }

  const stoppedRec = async () => {
    stopRecording();
    setCurStatus(true);
    const audioBlob = await fetch(mediaBlobUrl).then(r => r.blob());

    const url = new Blob ([audioBlob]);

    let audioFile = url;
    console.log('Audio File:', audioFile);
    console.log('BLOB:', audioBlob);
    
    blobToFile(url);
  }

  return (
    <div>
      <div>
        <video src={mediaBlobUrl} controls/>
      </div>
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
      <label 
        className="file-upload"
        for="file-upload">
          UPLOAD VIDEO
      </label>
      <input 
        id="file-upload"
        type="file"
      /> 
    </div>
  );
};

export default RecordView;