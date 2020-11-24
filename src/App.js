import React from "react";
import { ReactQueryDevtools } from "react-query-devtools";
import "./App.css";
import Main from "./components/Main";
import { QueryCache, ReactQueryCacheProvider } from "react-query";

const queryCache = new QueryCache();

function App() {
  return (
      <ReactQueryCacheProvider queryCache={queryCache}>
        <Main />
        <ReactQueryDevtools initialIsOpen />
      </ReactQueryCacheProvider>
  );
}

export default App;
