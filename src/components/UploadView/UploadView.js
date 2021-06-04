import React, {useState, useEffect}  from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import {Dropbox} from 'dropbox';
import Photo from '../../Images/sample-photo-rbc.png';
import Icon from '../../Images/rbc-icon4.png';
import RecordingIcon from '../../Images/recording-icon.png';
import Logo from '../../Images/rbc-logo.png';
import { v4 as uuidv4 } from 'uuid';

const UploadView = () => {

  const [constraintObj, setContraintObj] = useState({ 
    audio: true, 
    video: true
  });
  const [vid, setVideo] = useState();
  const [mediaRecorder, setMediaRecorder] = useState();
  const [curStatus, setCurStatus] = useState(true);
  const [selectedFile, setSelectedFile] = useState();
  const [chunks, setChunks] = useState([]);
	const [isFilePicked, setIsFilePicked] = useState(false);

  // Handles upload of selected file to Dropbox
  const uploadToDropbox = () => {
    // const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
    console.log('Selected File:', selectedFile);
    // var ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
    var ACCESS_TOKEN = process.env.ACCESS_TOKEN;
    console.log('AT:', ACCESS_TOKEN);
    
    var dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
    console.log('FILE:', selectedFile);
        dbx.filesUpload({path: '/' + selectedFile.name, contents: selectedFile})
        .then(function(response) {
          console.log(response);
          setMediaRecorder();
          setSelectedFile();
          setIsFilePicked(false);
        })
        .catch(function(error) {
          console.error(error);
        });    
    }

    // Turn on camera for recording
    const initRec = () => {
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
        const videoFile = new File([blob], `${uuidv4()}.${"mp4"}`, { type: "video/mp4" })
        console.log('File:', videoFile);
        setSelectedFile(videoFile);
        setIsFilePicked(true);
      }
    }

    // Handles input change and assigns input value to selectedFile variable
    const changeHandler = (event) => {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
    };
  
  return (
    <div>
      <img src={Logo} className="logo"></img>
      {!mediaRecorder ?
      <div className='player-wrapper'>
        <img src={Photo}/>
      </div> :
      !isFilePicked ?
      <div className='player-wrapper'>
        <video src={vid} width="700" height="350" controls autoPlay/>
      </div> :
      <video width="700" height="350" controls>
        <source src={URL.createObjectURL(selectedFile)}/>
      </video>
      }
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
      {!mediaRecorder ?
      <span>     
        <label
          className="init-record" 
          for="init-record">
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



// import React, {useState}  from 'react';
// import { useReactMediaRecorder } from "react-media-recorder";
// import {Dropbox} from 'dropbox';
// import Photo from '../../Images/sample-photo-rbc.png';
// import Icon from '../../Images/rbc-icon4.png';
// import Logo from '../../Images/rbc-logo.png';
// import { v4 as uuidv4 } from 'uuid';




// const UploadView = () => {
//   const {
//     startRecording,
//     stopRecording,
//     mediaBlobUrl,
//   } = useReactMediaRecorder({ video: true, audio: true, blobPropertyBag: {
//     type: "video/mp4"
// } });

//   const [curStatus, setCurStatus] = useState(true);
//   const [selectedFile, setSelectedFile] = useState();
//   const [videoPreview, setPreview] = useState();
// 	const [isFilePicked, setIsFilePicked] = useState(false);

//   // Handles upload of selected file to Dropbox
//   const uploadToDropbox = () => {
//     // const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
//     console.log('Selected File:', selectedFile);
//     var ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
//     var dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
//     console.log('FILE:', selectedFile);
//         dbx.filesUpload({path: '/' + selectedFile.name, contents: selectedFile})
//         .then(function(response) {
//           console.log(response);
//         })
//         .catch(function(error) {
//           console.error(error);
//         });
    
//     }

//     // Starts recording of new video
//     const startedRec = () => {
//       startRecording();
//       setCurStatus(false);
//     }

//     // Stops recording of new video and creates blob
//     const stoppedRec = async () => {
//       stopRecording();
//       setCurStatus(true);
//       const videoBlob = await fetch(mediaBlobUrl).then(r => r.blob());
//       const url = new Blob ([videoBlob]);
//       // Creates a video file with a randomized file name
//       const videoFile = new File([videoBlob], `${uuidv4()}.${"mp4"}`, { type: "video/mp4" })

//       console.log('Video File:', videoFile);
//       console.log('Blob:', url);
        
      
//       setSelectedFile(videoFile);
//       setIsFilePicked(true);
//     }

//     // Handles input change and assigns input value to selectedFile variable
//     const changeHandler = (event) => {
//       setSelectedFile(event.target.files[0]);
//       setIsFilePicked(true);
//       setPreview(URL.createObjectURL(event.target.files[0]));
//     };
  

//   return (
//     <div>
//       <img src={Logo} className="logo"></img>
//       {!isFilePicked ?
//       <div className='player-wrapper'>
//         <img src={Photo}/>
//       </div> :
//       <video width="700" height="350" controls>
//         <source src={URL.createObjectURL(selectedFile)}/>
//       </video>
//       }
//       <h1
//         className="icon"
//       >
//         <img src={Icon}/>
//       </h1>
//       {curStatus ?
//       <span>     
//         <label
//           className="video-record" 
//           for="video-record">
//             RECORD VIDEO
//         </label>
//         <input 
//           id="video-record"
//           onClick={startedRec}
//         />
//       </span>  
//       :
//       <span>     
//         <label
//           className="video-record" 
//           for="video-record">
//             STOP RECORDING
//         </label>
//         <input 
//           id="video-record"
//           onClick={stoppedRec}
//         />
//       </span>  
//       }
//       {!isFilePicked ?
//       <span>
//         <label 
//           className="file-upload"
//           for="file-upload">
//             UPLOAD VIDEO
//         </label>
//         <input 
//           id="file-upload"
//           type="file"
//           onChange={changeHandler}
//         /> 
//       </span> :
//       <span>
//         <label 
//           className="file-upload"
//           for="confirm-upload">
//             SUBMIT VIDEO
//         </label>
//         <input 
//           id="confirm-upload"
//           type="submit"
//           onClick={() => uploadToDropbox()}
//         /> 
//       </span>}
//     </div>
//   );
// };

// export default UploadView;