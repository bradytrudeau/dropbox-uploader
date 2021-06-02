import React, {useState}  from 'react';
import { FaCameraRetro } from 'react-icons/fa';
import {Dropbox} from 'dropbox';
import ReactPlayer from 'react-player';
import Photo from '../../Images/sample-photo-rbc.png';
import Icon from '../../Images/rbc-icon4.png';


const UploadView = () => {

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