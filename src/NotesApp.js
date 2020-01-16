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

export default props => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeVersion, setActiveVersion] = useState(null);

  function reducer(state, action) {
    switch (action.type) {
      case "register":
        return [...state, action.data];
      default:
        throw new Error();
    }
  }

  function localReducer(state, action) {
    switch (action.type) {
      case "register":
        console.log(state, action.data);
        return [...state, action.data];
      default:
        throw new Error();
    }
  }

  const [versions, versionsDispatcher] = useReducer(reducer, []);
  const [localVersions, localVersionDispatcher] = useReducer(localReducer, []);

  const saveNotes = (payload, versionId) =>
    fetch({
      endpoint: `/save?v=${versionId}`,
      response: payload
    });

  useEffect(() => {
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
      debounceTime(2000),
      distinctUntilChanged(),
      map(queryString => {
        console.log("REGISTER", queryString, localVersions);
        localVersionDispatcher({
          type: "register",
          data: {
            id: localVersions.length + 1,
            content: queryString
          }
        });
        return queryString;
      })
    );

    const result$ = titleText$
      .pipe(
        concatMap(queryString =>
          saveNotes(
            {
              id: localVersions.length + 1,
              content: queryString
            },
            localVersions.length + 1
          )
        ),
        distinctUntilChanged()
      )
      .subscribe(response => {
        versionsDispatcher({
          type: "register",
          data: response
        });
        console.log("RES ID", response.id);
        setActiveVersion(response.id);
        setIsLoading(false);
      });
    // return () => result$.unsubscribe();
  }, [localVersions]);

  console.log("LOCAL VERSIONS", localVersions);

  const handleTitleChange = text => {
    setTitle(text);
  };

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
            <h4 className="app-section_title">Local Versions</h4>
          </div>
          {localVersions.map((version, index) => (
            <p
              key={index}
              style={{ color: version.id === activeVersion ? "red" : "black" }}
            >
              {version.id}
            </p>
          ))}
        </div>
        <div>
          <div>
            <h4 className="app-section_title">Backend Versions</h4>
          </div>
          Active - {activeVersion}
          {versions.map((version, index) => (
            <p
              key={index}
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
