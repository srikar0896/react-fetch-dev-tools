import { registerRequest } from "./requestService";

const fetch = options => {
  return registerRequest(options);
};

export default fetch;
