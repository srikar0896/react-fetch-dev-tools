import React from "react";
import useDebuggableFetch from "./useDebuggableFetch";
import { List, Avatar, Icon, Alert, Card, Collapse, Empty } from "antd";
import Repo from "./Repo";
import moduleData from "./ModulesData.json";

const { Panel } = Collapse;

const customPanelStyle = {
  background: "#f7f7f7",
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: "hidden"
};

const Repos = props => {
  const { response, error, isLoading } = useDebuggableFetch({
    endpoint: "/repos",
    response: moduleData,
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
              <Panel header="More Details" key="1" style={customPanelStyle}>
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
        <Empty description="No public repositories found in this organization" />
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {response.map(item => (
        <Repo module={item} />
      ))}
    </div>
  );
};

export default Repos;
