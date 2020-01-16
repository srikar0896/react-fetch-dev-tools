import React, { createRef, useEffect, useState } from "react";
import useDebuggableFetch from "./useDebuggableFetch";
import { Card, Empty, Alert, Collapse, Icon, Input } from "antd";
import Repo from "./Repo";

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

const { Panel } = Collapse;
const { Search } = Input;

const customPanelStyle = {
  background: "#f7f7f7",
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: "hidden"
};

const fetchResults = q => {
  return fetch({
    endpoint: `/search?q=${q}`,
    response: q
  });
};

export default props => {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const error = false;

  const searchInputRef = createRef();

  useEffect(() => {
    const searchText$ = fromEvent(
      document.querySelector(".search-input"),
      "keyup"
    ).pipe(
      map(event => event.target.value),
      map(s => {
        setIsLoading(true);
        return s;
      }),
      startWith(""),
      debounceTime(400),
      distinctUntilChanged()
    );

    const result$ = searchText$
      .pipe(switchMap(queryString => fetchResults(queryString)))
      .subscribe(value => {
        setResponse(value);
        setIsLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start"
      }}
    >
      <Search
        ref={searchInputRef}
        className="search-input"
        placeholder="input search text"
        // onSearch={value => console.log(value)}
        style={{ width: 200, marginBottom: 12 }}
      />
      <div>
        {(function() {
          if (error)
            return (
              <Alert
                message="Error"
                style={{ textAlign: "start" }}
                description={
                  <div>
                    <p>
                      There was an error processing the request, please try
                      again later
                    </p>
                    <Collapse
                      bordered={false}
                      defaultActiveKey={["2"]}
                      expandIcon={({ isActive }) => (
                        <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                      )}
                    >
                      <Panel
                        header="More details"
                        key="1"
                        style={customPanelStyle}
                      >
                        <div style={{ display: "flex" }}>
                          <label style={{ marginRight: 8 }}>Status:</label>
                          <p>{error.status}</p>
                        </div>
                        <div style={{ display: "flex" }}>
                          <label style={{ marginRight: 8 }}>Message:</label>
                          <p>{error.errorMessage}</p>
                        </div>
                      </Panel>
                    </Collapse>
                  </div>
                }
                type="error"
                showIcon
              />
            );

          if (isLoading)
            return (
              <div>
                <Card loading style={{ marginBottom: 10 }} />
                <Card loading style={{ marginBottom: 10 }} />
                <Card loading style={{ marginBottom: 10 }} />
              </div>
            );

          if (response.length === 0) {
            return (
              <Card>
                <Empty description="No  Members in this organization" />
              </Card>
            );
          }
          // return response.map(item => <p>{item}</p>);
          return (
            <div style={{ display: "flex" }}>
              {[1, 2, 3].map(_ => (
                <Repo
                  module={{
                    moduleName: `some result of ${response}`,
                    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer`,
                    labels: ["library", "ui", "declarative", "javascript"]
                  }}
                />
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
};
