import React, { useState, useEffect } from "react";
import { PageHOC, CustomInput, CustomButton } from "../components";
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { contract, walletAddress, setShowAlert, gameData, setErrorMessage } =
    useGlobalContext();
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  // NOTE This is the first function, which is intracting with our smart contract.
  const handleClick = async () => {
    try {
      const playerExists = await contract.isPlayer(walletAddress);

      // If no player is available then create one
      if (!playerExists) {
        await contract.registerPlayer(playerName, playerName, {
          gasLimit: 200000,
        });

        setShowAlert({
          status: true,
          type: "info",
          message: `${playerName} is being summoned!`,
        });
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };

  //  NOTE This useEffect will trigger when contract changes
  // the purpose of this useEffect is to check if a player is registered or not. If registered then move to player to new page.
  useEffect(() => {
    const checkForPlayerToken = async () => {
      const playerExists = await contract.isPlayer(walletAddress);

      // now checking if player token is created or not. Player token is created while we call register() on contract.
      const playerTokenExists = await contract.isPlayerToken(walletAddress);

      console.log(playerExists, playerTokenExists);

      // When both things exists then move the player to 'createBattle' page
      if (playerExists && playerTokenExists) navigate("/create-battle");
    };

    if (contract) {
      checkForPlayerToken();
    }
  }, [contract]);

  // SECTION ----- When a player is registered, has game token and in a activeBattle then navigate them to battle page -----
  useEffect(() => {
    if (gameData.activeBattle) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }
  }, [gameData]);

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
          restStyles="mt-6"
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
