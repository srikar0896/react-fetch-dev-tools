import React from "react";
import "./styles.css";
import Debugger from "./Debugger";

import Users from "./Users";
import Repos from "./Repos";
import SearchApp from "./SearchApp";

import "antd/dist/antd.css";

export default function App() {
  return (
    <div className="App">
      <SearchApp />
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
      <Debugger />
    </div>
  );
}
