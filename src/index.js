import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <ChakraProvider resetCSS theme={theme}>
    <App />
  </ChakraProvider>,
  document.getElementById("root")
);
