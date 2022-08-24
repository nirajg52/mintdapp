import { useState } from "react";
import "./App.css";
import NewMint from "./Newmint";

function App() {
  const [accounts, setAccounts] = useState([]);
  return (
    <div className="overlay">
      <div className="App">
        <NewMint accounts={accounts} setAccounts={setAccounts} />
      </div>

      <div className="moving-background"></div>
    </div>
  );
}

export default App;
