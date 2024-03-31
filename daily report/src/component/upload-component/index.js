import { CloudUploadOutlined, CheckOutlined } from '@ant-design/icons';
// import { CheckOutlined } from '@ant-design/icons';
import { Button, Progress, Upload } from 'antd';
import React from 'react';
import './style.css';

function UploadComponent({
   accept = '',
   action = 'http://localhost:3001',
   files = [],
   // message: messageText = 'Click to upload or <b>drag</b> and drop',
   message: messageText = 'Click to upload or drag and drop',
   multiple = false,
   setFiles,
   style,
   width = '300px',
   method = 'post',
   iconSize = 60,
   progress = 0,
   setProgress = () => '',
   setResponseMessage = () => '',
   isValidFile = () => { return { status: true, message: 'success' }; },
}) {
   // Progress status while uploading an item

   // updates files on selecting new files
   function handleChange(file, newFileList) {
      const fileValidity = isValidFile(file);
      if (fileValidity.status) {
         console.log(fileValidity);
         setFiles(newFileList);
      if (file) setProgress(file.percent);
      } else {
         setResponseMessage(fileValidity.message);
      }
   }

   return (
      <>
         <div className="uploadFile" style={{ width, ...style }}>
            <Upload
              accept={accept}
              action={action}
              className="uploader"
              fileList={files}
              onChange={({ file, fileList: newFileList }) => handleChange(file, newFileList) }
              customRequest={({ file, onSuccess }) => onSuccess('ok', file)}
              multiple={multiple}
              beforeUpload={(file) => isValidFile(file).status}
              showUploadList={false}
              method={method}
              progress={{
                 style: {
                    display: 'none',
                 },
               }}
              onClick={() => setProgress(0)}
              onRemove={() => setProgress(0)}
            >
               <div className="uploadFileContainer">
                  <div className="uploadProgressBar">
                     <Progress
                       className="uploadProgress"
                       format={null}
                       width={ iconSize }
                       percent={ files.length > 0 ? progress : 0 }
                       strokeColor="#3bc171"
                       type="circle"
                       showInfo={false}
                     />
                     {progress !== 100 || files.length === 0 ? (               
                        <CloudUploadOutlined className="uploadIcon"
                        style={{ fontSize: 0.45 * iconSize, color: '#ddd' }}/>
                     ) : (
                        <CheckOutlined
                          className="uploadIcon"
                          style={{ fontSize: 0.45 * iconSize, color: '#3bc171' }}
                        />
                     )}
                     {/* <CloudUploadOutlined className="uploadIcon" /> */}
                  </div>
                  
                  <p
                    className="uploadText"
                  //   dangerouslySetInnerHTML={{ __html: messageText }}
                  //   children={messageText}
                  >{messageText}</p>
                  <div>
                     <Button
                       className="uploadButton"
                       size="middle"
                       type="default"
                     >
                        Browse File
                     </Button>
                  </div>
               </div>
            </Upload>
            {/* {showList && (
               <UploadList
                  file={files[0]}
                  files={files}
                  showList={true}
               />
            )} */}
         </div>
      </>
   );
}

export default UploadComponent;