import React, { useState, useEffect, useRef } from "react";
import { resolveRequest, rejectRequest } from "./requestService";
import { Input, Button, Drawer, message, Alert, Divider, Select } from "antd";
import JSONInput from "react-json-editor-ajrm";
import MonacoEditor from "react-monaco-editor";
import Editor from "@monaco-editor/react";

const { Option } = Select;

const { TextArea } = Input;

const RequestSettings = ({
  request,
  closePopover,
  onUpdateResponse,
  error,
  onUpdateError
}) => {
  const [isCustomResponseWindowOpen, setIsCustomResponseWindowOpen] = useState(
    false
  );

  const [responseData, setResponseData] = useState(
    JSON.stringify(request.requestOptions.response, null, 2)
  );

  const [
    isCustomResponseInvalidMsgShown,
    setIsCustomResponseInvalidMsgShown
  ] = useState(false);

  const [isEditorReady, setIsEditorReady] = useState(false);
  const valueGetter = useRef();

  function handleEditorDidMount(_valueGetter) {
    setIsEditorReady(true);
    valueGetter.current = _valueGetter;
  }

  const options = {
    selectOnLineNumbers: true,
    colorize: true
    // formatOnType: true
  };

  return (
    <div>
      <h4>Resolve:</h4>
      <div>
        <label>Payload:</label>
        <Button
          type="ghost"
          style={{ margin: "8px 8px 8px 44px" }}
          onClick={() => {
            closePopover();
            setIsCustomResponseWindowOpen(true);
          }}
        >
          view/edit response
        </Button>
      </div>
      <Divider />
      <div>
        <h4>Reject:</h4>
        <div>
          <label>Status code:</label>
          <Select
            defaultValue={error.status || 400}
            style={{
              // margin: "8px 8px 8px 30px",
              margin: 8,
              width: 120,
              borderRadius: 0,
              borderColor: "black"
            }}
            onChange={val => {
              onUpdateError({
                ...error,
                status: val
              });
            }}
          >
            <Option value={400}>400</Option>
            <Option value={401}>401</Option>
            <Option value={402}>402</Option>
            <Option value={403}>403</Option>
            <Option value={404}>404</Option>
            <Option value={500}>500</Option>
          </Select>
        </div>

        <div style={{ display: "flex" }}>
          <label>Error Message:</label>
          <TextArea
            style={{ marginLeft: 34 }}
            value={
              error.errorMessage ||
              "Something went wrong, please try again later"
            }
            onChange={e => {
              onUpdateError({
                ...error,
                errorMessage: e.target.value
              });
            }}
          />
        </div>
      </div>
      <Drawer
        title="Response"
        placement="right"
        width={500}
        closable={false}
        onClose={() => setIsCustomResponseWindowOpen(false)}
        visible={isCustomResponseWindowOpen}
      >
        {isCustomResponseInvalidMsgShown && (
          <Alert
            message="Invalid JSON"
            description="Looks like the json is invalid, please check it."
            type="error"
            showIcon
            closeText="close"
            closable
            onClose={() => {
              setIsCustomResponseInvalidMsgShown(false);
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "6px 0"
          }}
        >
          <Button
            type="dashed"
            size="small"
            style={{
              // border: "1px solid black",
              borderColor: "grey",
              borderRadius: 0,
              fontFamily: '"Source Code Pro", monospace'
            }}
            onClick={() => {
              const getCode = valueGetter.current;

              try {
                const code = JSON.parse(getCode());
                onUpdateResponse(code);
                setIsCustomResponseWindowOpen(false);
                message.success("Response updated");
              } catch {
                setIsCustomResponseInvalidMsgShown(true);
              }
            }}
          >
            Save Response
          </Button>
        </div>
        <Editor
          height="90vh"
          language="json"
          theme="vs-dark"
          value={responseData}
          options={{
            codeLens: false,
            autoIndent: true,
            autoClosingQuotes: "languageDefined",
            autoClosingOvertype: "always",
            colorDecorators: true,
            formatOnType: true,
            formatOnPaste: true,
            suggest: {
              showFields: true
            },
            minimap: {
              enabled: false
            }
          }}
          editorDidMount={handleEditorDidMount}
        />
      </Drawer>
    </div>
  );
};

export default RequestSettings;
