import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateBattle, Home, JoinBattle, Battle, BattleGround } from "./page";
import { OnboardModal } from "./components";
import "./index.css";
import { GlobalContextProvider } from "./context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GlobalContextProvider>
      <OnboardModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-battle" element={<CreateBattle />} />
        <Route path="/join-battle" element={<JoinBattle />} />
        <Route path="/battle/:battleName" element={<Battle />} />
        <Route path="/battleground" element={<BattleGround />} />
        {/* <Route path="/onboardModal" element={<OnboardModal />} /> */}
      </Routes>
    </GlobalContextProvider>
  </BrowserRouter>
);
