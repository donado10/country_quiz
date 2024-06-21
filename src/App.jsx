import { useState } from "react";

import "./App.css";
import Background from "./Components/Background";
import { Main } from "./Components/Main";

function App() {
  return (
    <div>
      <Background />
      <div className="flex items-center justify-center h-screen sm:w-full ">
        <Main />
      </div>
    </div>
  );
}

export default App;
