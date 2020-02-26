import React from "react";
import { Field, reduxForm } from "redux-form";
import Dropzone from "react-dropzone";
import * as api from "../../../functions/api.jsx";
import { Button, Panel, Grid, Row } from "react-bootstrap";
import "./PictureUploadForm.css";

const FILE_FIELD_NAME = "picture";

const renderDropzoneInput = field => {
  const files = field.input.value;
  let dropzoneRef;
  return (
    <div className="text-center">
      <Grid>
        <Row>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Dropzone
              style={{
                width: "200px",
                height: "200px",
                borderWidth: "2px",
                borderColor: "rgb(102, 102, 102)",
                borderStyle: "solid",
                borderRadius: "5px",
                padding: "20px"
              }}
              name={field.name}
              onDrop={(filesToUpload, e) =>
                function() {
                  console.log(filesToUpload);
                  return field.input.onChange(filesToUpload);
                }
              }
              ref={node => {
                dropzoneRef = node;
              }}
              maxSize={5242880}
              multiple={false}
              accept={"image/*"}
              className="drop-zone"
            >
              {({
                isDragActive,
                isDragReject,
                acceptedFiles,
                rejectedFiles
              }) => {
                if (isDragActive) {
                  return "This file is authorized";
                }
                if (isDragReject) {
                  return "This file is not authorized";
                }
                return acceptedFiles.length || rejectedFiles.length
                  ? `Accepted ${acceptedFiles.length}, rejected ${rejectedFiles.length} files`
                  : "Try dropping some files.";
              }}
            </Dropzone>
          </div>
          {field.meta.touched && field.meta.error && (
            <span className="error">{field.meta.error}</span>
          )}
          {files && Array.isArray(files) && (
            <ul>
              {files.map((file, i) => (
                <li key={i}>
                  <img
                    className="img"
                    height={300}
                    width={300}
                    key={i}
                    src={file.preview}
                    onLoad={api.blobToCanvas(file.preview)}
                    alt="preview"
                  />
                  <p>{file.name}</p>
                </li>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <input
                  id="ibrightnessbtn"
                  value="Increase Brightness"
                  type="button"
                />
                <input
                  id="dbrightnessbtn"
                  value="Decrease Brightness"
                  type="button"
                />
                <br />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <input
                  id="icontrastbtn"
                  value="Increase Contrast"
                  type="button"
                />
                <input
                  id="dcontrastbtn"
                  value="Decrease Contrast"
                  type="button"
                />
                <br />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <input id="smoothbtn" value="Smooth" type="button" />
                <input id="grayscalebtn" value="Grayscale" type="button" />
                <input id="invertbtn" value="Invert" type="button" />
              </div>
              <p>Brightness</p>
              <input type="range" className="brightness" id="customRange1" />
            </ul>
          )}
          <canvas className="canvas" height={300} width={300}></canvas>
        </Row>
        <Row>
          <Button
            type="button"
            style={{ margin: "5px" }}
            onClick={() => {
              dropzoneRef.open();
            }}
          >
            Add An Image
          </Button>
        </Row>
      </Grid>
    </div>
  );
};
const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = "Required";
  } else if (values.name.length > 200) {
    errors.name = "Must be 200 characters or less";
  }
  if (!values.description) {
    errors.description = "Required";
  } else if (values.description.length > 200) {
    errors.description = "Must be 200 characters or less";
  }

  if (!values.url) {
    errors.url = "Required";
  } else if (values.url.length > 150) {
    errors.url = "Must be 150 characters or less";
  }
  if (!values.about) {
    errors.about = "Required";
  } else if (values.about.length > 500) {
    errors.about = "Must be 500 characters or less";
  }
  if (!values.picture) {
    errors.picture = "Required";
  }

  return errors;
};

const PictureUploadForm = props => {
  return (
    <Grid style={{ margin: "20px" }}>
      <Row className="text-left">
        <Panel>
          <form>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
              }}
            >
              <Field name={FILE_FIELD_NAME} component={renderDropzoneInput} />
            </div>
          </form>
        </Panel>
      </Row>
    </Grid>
  );
};

export default reduxForm({
  form: "syncValidation", // a unique identifier for this form
  validate // <--- validation function given to redux-form
})(PictureUploadForm);
