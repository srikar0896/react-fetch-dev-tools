import React, { useState, useEffect } from "react";
import requestsService from "./requestService";
import Draggable from "react-draggable";
import RequestItem from "./RequestItem";

export default props => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const subscription = requestsService.subscriber.subscribe(
      debuggingRequests => {
        setRequests(debuggingRequests);
      }
    );

    return () => subscription.unsubscribe();
  });

  return (
    <React.Fragment>
      <Draggable
        handle=".debugger__container-drag_handle"
        defaultPosition={{ x: 0, y: 0 }}
        position={null}
        // grid={[25, 25]}
        scale={1}
        style={{ position: "fixed" }}
        // onStart={() => console.log("START")}
        // onDrag={() => console.log("DRAG")}
        // onStop={() => console.log("STOP")}
      >
        <div className="debugger__container vertical wrap">
          <div className="debugger__container-drag_handle">API DEV TOOLS</div>
          <div style={{ padding: 8 }}>
            {/* <Row
            className="vertically-center"
            style={{ display: "flex", marginBottom: 6 }}
          >
            <div style={{ flex: 1 }}>
              <Typography.Text>Api Debugger</Typography.Text>
            </div>
            <Icon type="drag" className="handle" />
          </Row> */}
            {requests.map((request, index) => (
              <RequestItem request={request} key={request.requestId} />
            ))}
          </div>
        </div>
      </Draggable>
    </React.Fragment>
  );
};
