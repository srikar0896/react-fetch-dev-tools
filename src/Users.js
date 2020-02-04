import React from "react";
import useDebuggableFetch from "./useDebuggableFetch";
import {
  List,
  Avatar,
  Empty,
  Collapse,
  Card,
  Alert,
  Icon,
  Result,
  Skeleton
} from "antd";
import User from "./User";

const { Panel } = Collapse;

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
              <Panel header="More details" key="1" style={customPanelStyle}>
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
        <Empty description="No  Members in this organization" />
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {response.map(user => (
        <User user={user} />
      ))}
    </div>
  );
};

export default Users;
