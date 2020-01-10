import React from "react";
import useDebuggableFetch from "./useDebuggableFetch";
import { List, Avatar, Collapse, Card, Alert, Icon, Skeleton } from "antd";
import ModuleWithDescription from "./ModuleWithDescription";
import User from "./User";

const { Panel } = Collapse;

import moduleData from "./ModulesData.json";

const { Meta } = Card;

const customPanelStyle = {
  background: "#f7f7f7",
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: "hidden"
};

const Users = props => {
  const { response, error, isLoading } = useDebuggableFetch({
    endpoint: "/authors",
    response: [
      "Sebastian Markbåge",
      "Andrew Clark",
      "Dan Abramov",
      "Andrew Loe",
      "Brandon Dail",
      "Brian Dolhansky"
    ],
    error: {
      status: 401,
      errorMessage: "Not Authorized"
    }
  });

  if (error)
    return (
      <Alert
        message="Error"
        style={{ textAlign: "start" }}
        description={
          <div>
            <p>
              There was an error processing the request, please try again later
            </p>
            <Collapse
              bordered={false}
              defaultActiveKey={["2"]}
              expandIcon={({ isActive }) => (
                <Icon type="caret-right" rotate={isActive ? 90 : 0} />
              )}
            >
              <Panel header="Detailed Error" key="1" style={customPanelStyle}>
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

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {response.map(user => (
        <User user={user} />
      ))}
    </div>
  );
};

export default Users;
