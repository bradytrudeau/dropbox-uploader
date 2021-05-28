import React, {useState}  from 'react';
import { FaCameraRetro } from 'react-icons/fa';
import {Dropbox} from 'dropbox';

const UploadView = () => {

  const [newFile, setNewFile] = useState(null);

  // Handles upload of selected file to Dropbox
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

    // Handles input change
    const handleInputChangeFor = (newFile) => (event) => {
      setNewFile(event.target.value)
      console.log('ETV:', event.target.value);
      
    };

  return (
    <div>
      <div>
        {/* <video src={newFile} controls/> */}
      </div>
      <h1
        className="icon"
      >
        <FaCameraRetro/>
      </h1>
      <label 
        className="file-upload"
        for="file-upload">
          UPLOAD VIDEO
      </label>
      <input 
        id="file-upload"
        type="file"
        onChange={handleInputChangeFor(newFile)}
      />
      <button
        onClick={() => this.uploadToDropbox()}>
          Upload
      </button>
    </div>
  );
};

export default UploadView;