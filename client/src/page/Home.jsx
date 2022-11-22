import React, { useState } from "react";
import { PageHOC, CustomInput, CustomButton } from "../components";
import { useGlobalContext } from "../context";

const Home = () => {
  const { contract, walletAddress } = useGlobalContext();
  const [playerName, setPlayerName] = useState("");

  return (
    <div className="flex flex-col">
      <h1 className="text-xl text-white"></h1>
      <CustomInput
        Label="Name"
        placeholder="Enter you player name"
        value={playerName}
        handleValueChange={setPlayerName}
      />

      <CustomButton />
    </div>
  );
};

// NOTE Here we are using HOC as the wrapper of second component that is home and title and also description.
export default PageHOC(
  Home,
  <>
    Welcome to Avax Gods <br /> a Web3 NFT Card Game{" "}
  </>,
  <>
    Connect you wallet to start playing <br /> the ultimate Web3 Battle Card
    Game.{" "}
  </>
);
