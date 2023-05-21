import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  return (
    <div className={'bg-gray-800'}>
      <h1>Welcome to Tuner!</h1>
    </div>
  );
}

export default App;
