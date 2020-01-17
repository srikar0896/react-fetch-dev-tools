import React, { useState, useEffect, useReducer, useCallback } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import { fromEvent, throwError } from "rxjs";
import {
  map,
  forkJoin,
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  mergeMap,
  concatMap,
  retry,
  catchError
} from "rxjs/operators";
import fetch from "./fetch";
import uuid from "uuid";
import versionService, { registerVersion, currentVersionSubscriber, setCurrentVersion } from "./versionService";
import Version from "./Version";
import { Button } from "antd";

let count = 0;

const saveNotes = (content) => {
  count +=1;
  const version = {
    notes: content,
    id: uuid(),
    timestamp: Date.now(),
  };

  return fetch({
    endpoint: `/save?v=${count}`,
    response: version,
  });
}

function registerChangeListener(editorId, setIsLoading, onNewVersionAdd){
  const titleText$ = currentVersionSubscriber.pipe(
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
      concatMap(() => {
        console.log(document.querySelector("#editor-notes-title").textContent);
        console.log(document.querySelector("#editor-notes-content").textContent);
        return saveNotes({
          title: document.querySelector("#editor-notes-title").textContent,
          content: document.querySelector("#editor-notes-content").textContent,
        })
      }),
      catchError(err => {
        console.log('Handling error locally and rethrowing it...', err);
        count -= 1;
        return throwError(err);
      }),
      retry(2),
      )
    .subscribe(response => {
      console.log({response});
      registerVersion(response);
      onNewVersionAdd(response.id);
      setIsLoading(false);
    });
}

export default props => {
  const [notes, setNotes] = useState({ title: "", content: ""});
  const [isLoading, setIsLoading] = useState(false);
  const [activeVersion, setActiveVersion] = useState(null);
  const [showSavedLabel, setShowSavedLabel] = useState(false);
  const [versions, setVersions] = useState([]);
  
  
  useEffect(() => {
    registerChangeListener("editor-notes-title", setIsLoading, (version) => {
      setActiveVersion(version)
    });

  }, []);

  useEffect(() => {
    if(!isLoading) {
      setShowSavedLabel(true);
      setTimeout(() => {
        setShowSavedLabel(false);
      }, 600);

    }
  }, [isLoading]);

  useEffect(() => {
    versionService.subscribe((versions) => {
      console.log(versions);
      setVersions(versions);
    });
  }, []);

  const handleTitleChange = text => {
    const version = {
      title: text,
      content: notes.content
    };
    currentVersionSubscriber.next(version);
    setNotes(version);
  };


  console.log({versions});
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flexBasis: "80%" }}>
        <div style={{ display: "flex", alignItems: 'baseline' }}>
          <span className="app-section_title">Notes</span>
          <div>
            {isLoading && !showSavedLabel && (
              <Button loading  type="link" size="small">
                Saving
              </Button>
            )}
            {showSavedLabel && (
              <Button type="link" size="small" icon="check" style={{ color: "green" }}>
                Saved
              </Button>
            )}
          </div>
        </div>
        <div className="editor" style={{ margin: 8 }}>
          <Editor
            autoFocus
            autoSave
            textareaId="editor-notes-title"
            value={notes.title}
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
            value={notes.content}
            onValueChange={value => {
                const version = {
                  title: notes.title,
                  content: value
                };
                currentVersionSubscriber.next(version);
                setNotes(version)
              }
            }
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
            <h4 className="app-section_title">Version History</h4>
          </div>
          {versions.map((version, index) => (
            <Version
              key={version.id}
              version={version}
              isCurrentVersion={version.id === activeVersion}
              onClick={() => {
                console.log(version);
                setNotes(version.notes);
                setActiveVersion(version.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
