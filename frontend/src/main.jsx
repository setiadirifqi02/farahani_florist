import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </Provider>
  </React.StrictMode>
);
