import { useState } from "react";
import "./App.css";
import MainMint from "./MainMint";
import NewMint from "./MainMint";

function App() {
  return (
    <div className="overlay">
      <div className="App">
        <MainMint />
      </div>

      <div className="moving-background"></div>
    </div>
  );
}

export default App;
