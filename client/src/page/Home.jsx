import React, { useState } from "react";
import { PageHOC, CustomInput, CustomButton } from "../components";
import { useGlobalContext } from "../context";

const Home = () => {
  const { contract, walletAddress, setShowAlert } = useGlobalContext();
  const [playerName, setPlayerName] = useState("");

  // NOTE This is the first function, which is intracting with our smart contract.
  const handleClick = async () => {
    try {
      const playerExists = await contract.isPlayer(walletAddress);

      // If no player is available then create one
      if (!playerExists) {
        await contract.registerPlayer(playerName, playerName);

        setShowAlert({
          status: true,
          type: "info",
          message: `${playerName} is being summoned!`,
        });
      }
    } catch (error) {
      setShowAlert({
        status: true,
        type: "failure",
        message: "something went wrong",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-xl text-white"></h1>
        <CustomInput
          Label="Name"
          placeholder="Enter you player name"
          value={playerName}
          handleValueChange={setPlayerName}
        />

        <CustomButton
          title="Register"
          handleClick={handleClick}
          restStyles="mt-4"
        />
      </div>
    </>
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
