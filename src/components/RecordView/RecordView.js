import React, {useState} from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import { FaCameraRetro } from 'react-icons/fa';
import {Dropbox} from 'dropbox';
import ReactPlayer from 'react-player';
import Logo from '../../Images/rbc-logo.png';
import Photo from '../../Images/sample-photo-rbc.png';
import Icon from '../../Images/rbc-icon4.png';



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
  const [isCameraOn, setCameraOn] = useState(false);


  // Uploads existing file to dbx
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

  // Uploads newly recorded video to dbx
  const uploadNewVideoToDropbox = (file) => {
    // const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
    var ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;    
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
    let newBlob = new File([blob], "rbc-wafa3.mp4", {
      type: "video/mp4",
    });
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

  const selectCamera = () => {
    setCameraOn(true);
    const stream = navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });
    const mimeType = 'video/mp4';
              let chunks = [];
              const recorder = new MediaRecorder(stream, { type: mimeType });
              recorder.addEventListener('dataavailable', event => {
                if (typeof event.data === 'undefined') return;
                if (event.data.size === 0) return;
                chunks.push(event.data);
              });
              recorder.addEventListener('stop', () => {
                const recording = new Blob(chunks, {
                  type: mimeType
                });
              });
  
  }




  return (
    <div>
      <img width="50%" height="50%" src={Logo} className="logo-mobile"></img>
      {!isFilePicked ?
        <div className='player-wrapper-mobile'>
          <img width="350" height="175" src={Photo}/>
        </div> :
        <video width="700" height="350" controls>
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
          id="file-upload"
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
          id="confirm-upload"
          type="submit"
          onClick={() => uploadToDropbox()}
        /> 
      </span>}
    </div>
  );
};

export default RecordView;

// import React, { useEffect } from 'react';

// const RecordView = (props) => {
//     useEffect(() => {
//         var constraints = {
//             video: true,
//             audio: true
//         };
//         async function getMedia(constraints) {
//             let stream = null;
//             try {
//                 stream = await navigator.mediaDevices.getUserMedia(constraints);
//                 // console.log(stream.getAudioTracks()[0].getCapabilities()) ;
//                 localVideoref.current.srcObject = stream;
//                 localVideoref.current.muted = true;
//             } catch (err) {
//                 /* handle the error */
//                 console.log(err);
//             }
//         }

//         getMedia(constraints);
//     }, []);
//     var localVideoref = React.createRef();

//     return (
//         <div>
//             peer component
//             <video ref={localVideoref} autoPlay ></video>
//         </div>);
// }

// export default RecordView;