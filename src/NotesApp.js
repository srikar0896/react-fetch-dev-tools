import React, { useState, useEffect, useReducer, useCallback } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import { fromEvent } from "rxjs";
import {
  map,
  forkJoin,
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  mergeMap,
  concatMap
} from "rxjs/operators";
import fetch from "./fetch";
import uuid from "uuid";
import versionService, { registerVersion } from "./versionService";

let count = 0;

const saveNotes = (text, versionId) => {
  count +=1;
  const version = {
    content: text,
    id: uuid(),
    timestamp: Date.now(),
  };

  return fetch({
    endpoint: `/save?v=${count}`,
    response: version
  });
}

function registerListener(setIsLoading, onNewVersionAdd){
  const titleText$ = fromEvent(
    document.querySelector("#editor-notes-title"),
    "keyup"
  ).pipe(
    map(event => event.target.value),
    map(notes => {
      setIsLoading(true);
      return notes;
    }),
    // startWith(""),
    debounceTime(600),
    distinctUntilChanged()
  );

  const result$ = titleText$
    .pipe(
      concatMap(saveNotes)
      )
    .subscribe(response => {
      console.log({response});
      registerVersion(response);
      onNewVersionAdd(response.id);
      setIsLoading(false);
    });
}

export default props => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeVersion, setActiveVersion] = useState(null);

  const [versions, setVersions] = useState([]);

  
  useEffect(() => {
    registerListener(setIsLoading, (version) => {
      setActiveVersion(version)
    });
  }, []);

  useEffect(() => {
    versionService.subscribe((versions) => {
      console.log(versions);
      setVersions(versions);
    });
  }, []);

  const handleTitleChange = text => {
    setTitle(text);
  };
    
  console.log({activeVersion});
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flexBasis: "80%" }}>
        <div style={{ display: "flex" }}>
          <span className="app-section_title">Notes</span>
          <div>{isLoading && "Saving..."}</div>
        </div>
        <div className="editor" style={{ margin: 8 }}>
          <Editor
            textareaId="editor-notes-title"
            value={title}
            onValueChange={value => handleTitleChange(value)}
            highlight={code => highlight(code, languages.js)}
            padding={10}
            placeholder="Add a title"
            style={{
              fontFamily: '"Lato", sans-serif;',
              fontSize: 44,
              color: "black",
              lineHeight: 1.137,
              // borderRadius: 8,
              // fontStyle: "bold"
              fontWeight: 900
            }}
          />
        </div>
        <div className="editor" style={{ margin: 8 }}>
          <Editor
            value={notes}
            onValueChange={value => setNotes(value)}
            textareaId="editor-notes-content"
            highlight={code => highlight(code, languages.js)}
            padding={10}
            controlled
            placeholder="Enter your text here. You can gather notes, files, links, or anything else you want."
            style={{
              fontFamily: '"Lato", sans-serif;',
              fontSize: 18,
              lineHeight: 1.5,
              color: "black",
              outline: "none",
              height: 300,
              // borderRadius: 8,
              // fontStyle: "bold"
              fontWeight: 400
            }}
          />
        </div>
      </div>
      <div>
        <div>
          <div>
            <h4 className="app-section_title">Versions</h4>
          </div>
          {versions.map((version, index) => (
            <p
              key={index}
              onClick={() => {
                setTitle(version.content);
                setActiveVersion(version.id);
              }}
              style={{ color: version.id === activeVersion ? "red" : "black" }}
            >
              {version.id}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
