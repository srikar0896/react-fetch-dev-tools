import React from "react";
import useDebuggableFetch from "./useDebuggableFetch";
import { List, Avatar, Icon, Alert, Card, Collapse, Empty, Result } from "antd";
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

  const getErrorMessage = (err) => {
    console.log(err);
    switch (err.status) {
      case 401:
        return "Not authenticated."
      case 404:
        return "Orgnization not found."
      case 403:
        return "Not enough permission to access this organization or this organization might be private organization and you are not a memeber of it."
      case 404:
        return "Orgnization not found."
      case 500:
      return "Something went wrong while processing the request, Please try again later."
      default:
        return "Internal server error, Please try again later."
    }
  };

  if (error)
    return (
      <>
      <Result
        status={error.status.toString()}
        // title="500"
        // subTitle="Sorry, the server is wrong."
        // extra={<Button type="primary">Back Home</Button>}
      />
      <Alert
        message="Error"
        style={{ textAlign: "start" }}
        description={
          <div>
            <p>
              {getErrorMessage(error)}
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
      </>
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
