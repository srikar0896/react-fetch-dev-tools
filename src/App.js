import React, { useState } from "react";
import "./styles.css";
import { Radio } from "antd";

import Debugger from "./Debugger";

import Users from "./Users";
import Repos from "./Repos";
import SearchApp from "./SearchApp";
import NotesApp from "./NotesApp";

import "antd/dist/antd.css";
import { cancelAllRequests } from "./requestService";

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="App">
      <Radio.Group
        buttonStyle="solid"
        style={{ marginBottom: 6 }}
        onChange={e => {
          cancelAllRequests();
          setActiveTab(e.target.value);
        }}
        defaultValue={0}
      >
        <Radio.Button value={0}>Usage</Radio.Button>
        <Radio.Button value={1}>Search</Radio.Button>
        <Radio.Button value={2}>Notes</Radio.Button>
      </Radio.Group>
      {(function(activeTab) {
        switch (activeTab) {
          case 0:
            return (
              <div className="app_container">
                <div style={{ justifyContent: "flex-start" }}>
                  <h4 className="app-section_title">Repositories</h4>
                  <Repos />
                </div>
                <div style={{ justifyContent: "flex-start" }}>
                  <h4 className="app-section_title">Members</h4>
                  <Users />
                </div>
              </div>
            );
          case 1:
            return <SearchApp />;
          case 2:
            return <NotesApp />;
          default:
            return "App Not found";
        }
      })(activeTab)}

      <Debugger />
    </div>
  );
}
