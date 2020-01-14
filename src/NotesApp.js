import React, { useState, useEffect, useReducer } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import { fromEvent } from "rxjs";
import {
  map,
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

  function reducer(state, action) {
    switch (action.type) {
      case "register":
        return [...state, action.data];
      default:
        throw new Error();
    }
  }

  const [versions, versionsDispatcher] = useReducer(reducer, []);

  const saveNotes = notes => {
    return fetch({
      endpoint: `/save`,
      response: {
        id: versions.length + 1,
        content: notes
      }
    });
  };

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
      startWith(""),
      debounceTime(400),
      distinctUntilChanged()
    );

    console.log("kleup,", versions);
    const result$ = titleText$
      .pipe(concatMap(queryString => saveNotes(queryString)))
      .subscribe(response => {
        versionsDispatcher({
          type: "register",
          data: response
        });

        setIsLoading(false);
      });
    // return () => result$.unsubscribe();
  }, []);

  console.log(versions);

  return (
    <div>
      <div>
        <div style={{ display: "flex" }}>
          <span className="app-section_title">Notes</span>
          <div>{isLoading && "Saving..."}</div>
        </div>
        <div className="editor" style={{ margin: 8 }}>
          <Editor
            textareaId="editor-notes-title"
            value={title}
            onValueChange={value => setTitle(value)}
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
          <h4 className="app-section_title">Notes</h4>
        </div>
        {versions.map((versionContent, index) => (
          <p key={index}>{index}</p>
        ))}
      </div>
    </div>
  );
};
