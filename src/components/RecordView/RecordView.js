import React, {useState} from 'react';
import {Dropbox} from 'dropbox';
import Logo from '../../Images/rbc-logo.png';
import Photo from '../../Images/sample-photo-rbc.png';
import Icon from '../../Images/rbc-icon4.png';

const RecordView = () => {

  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);


  // Uploads selected file to dbx
  const uploadToDropbox = () => {
    // const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
    // var ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
    var ACCESS_TOKEN = process.env.ACCESS_TOKEN;
    var dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
    console.log('FILE:', selectedFile);
        dbx.filesUpload({path: '/' + selectedFile.name, contents: selectedFile})
        .then(function(response) {
          console.log(response);
          setSelectedFile();
          setIsFilePicked(false);
        })
        .catch(function(error) {
          console.error(error);
        });
    }

  // Handles input change and assigns input value to selectedFile variable
  // This is called by both RECORD and UPLOAD buttons because on mobile, the camera
  // will automatically be triggered to open when clicking these inputs.
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
      <span>     
        <label
          className="video-record-mobile" 
          for="video-record-mobile">
            RECORD VIDEO
        </label>
        <input 
          id="video-record-mobile"
          type="file"
          onChange={changeHandler}
        />
      </span>  
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