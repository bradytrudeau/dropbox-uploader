import React, {useState}  from 'react';
import { FaCameraRetro } from 'react-icons/fa';
import {Dropbox} from 'dropbox';
import ReactPlayer from 'react-player';

const UploadView = () => {

  const [selectedFile, setSelectedFile] = useState();
  const [videoPreview, setPreview] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

  // Handles upload of selected file to Dropbox
  const uploadToDropbox = () => {
    // const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
    console.log('Selected File:', selectedFile);
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
      {!isFilePicked ?
      <div>
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
      </div> :
      <div>
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
      </div>}
    </div>
  );
};

export default UploadView;