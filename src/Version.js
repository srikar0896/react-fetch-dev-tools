import React, { useState } from "react";
import { Avatar, Icon, Tag, Button } from "antd";
import moment from "moment";

const Version = ({ version, isCurrentVersion, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        background: !isHovered ? "white" : "#fafafa",
        padding: "5px",
        justifyContent: "flex-start",
        alignItems: "center",
        borderBottom: "1px solid #e8e8e8"
      }}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div style={{ display: "flex", alignContent:"center", color: "white" }}>
        <Button type="link">
          {moment(version.timestamp).format('ddd, Do MMM YYYY, h:mm A')}
        </Button>
        <div style={{ alignSelf: "center", width: 86 }}>
          {isCurrentVersion && <Tag color="orange">Current</Tag>}
        </div>
      </div>
      <div style={{ height: 18, display: 'flex', justifyContent: 'flex-start', alignSelf: 'flex-start', paddingLeft: 15 }}>
        { isHovered ? (
          <span style={{ fontSize: 11, color: "#595959" }}>
           ➥ jump to this version
          </span>
        ) : ""}
      </div>
      {/* {
          isHovered && (
            <div style={{ margin: "0 10px" }}>
                <Icon type="enter" style={{ color: "#fff" }} />
            </div>
          )
      } */}
    </div>
  );
};

export default Version;
