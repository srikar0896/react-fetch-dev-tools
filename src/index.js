import React from "react";
import ReactDOM from "react-dom";
import User from "./User";
import fetch from "./fetch";
import useDebuggableFetch from "./useDebuggableFetch";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

export const configurableFetch = fetch;
export const useConfigurableFetch = useDebuggableFetch;
