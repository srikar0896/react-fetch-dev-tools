import React, { useState } from "react";
import { Icon, Row, Typography, Popover, Tooltip, Drawer } from "antd";
import { resolveRequest, rejectRequest } from "./requestService";
import RequestSettings from "./RequestSettings";

export default ({ request }) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [response, setResponse] = useState(request.requestOptions.response);
  const [error, setError] = useState(request.requestOptions.error);

  return (
    <div className="request__item" key={request.requestId}>
      <div>
        <Tooltip title="Resolve">
          <Icon
            type="check-circle"
            style={{ color: "green" }}
            onClick={() =>
              resolveRequest({
                requestId: request.requestId,
                customResponse: response
              })
            }
          />
        </Tooltip>
        <Tooltip title="Reject">
          <Icon
            type="close-circle"
            style={{ color: "red", marginLeft: 6 }}
            onClick={() =>
              rejectRequest({
                requestId: request.requestId,
                customError: error
              })
            }
          />
        </Tooltip>
      </div>
      <div className="request_status_container">
        <span className="request_name" style={{ flex: 1 }}>
          {request.requestOptions.endpoint}
        </span>
        <Popover
          content={
            <RequestSettings
              request={request}
              error={error}
              onUpdateError={setError}
              onUpdateResponse={setResponse}
              closePopover={() => setIsPopoverVisible(false)}
            />
          }
          trigger="click"
          placement="right"
          visible={isPopoverVisible}
          onVisibleChange={setIsPopoverVisible}
        >
          <Icon type="setting" />
        </Popover>
      </div>
    </div>
  );
};
