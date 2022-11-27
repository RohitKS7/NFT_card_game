import React, { useState, useEffect } from "react";
import { PageHOC, CustomButton, CustomInput, GameLoad } from "../components";
import { useNavigate } from "react-router-dom";
import styles from "../styles";
import { useGlobalContext } from "../context";

const CreateBattle = () => {
  const navigate = useNavigate();
  const [waitBattle, setWaitBattle] = useState(false);
  const { contract, battleName, setBattleName, gameData, setErrorMessage } =
    useGlobalContext();

  // Trigger when the GameData changes
  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    } else if (gameData?.activeBattle?.battleStatus === 0) {
      setWaitBattle(true);
    }
  }, [gameData]);

  const handleClick = async () => {
    if (battleName === "" || battleName.trim() === "") return null;

    try {
      await contract.createBattle(battleName);

      setWaitBattle(true);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <>
      {waitBattle && <GameLoad />}

      <div className="flex flex-col mb-5">
        <CustomInput
          Label="Battle"
          placeholder="Enter battle name"
          value={battleName}
          handleValueChange={setBattleName}
        />

        <CustomButton
          title="Create Battle"
          handleClick={handleClick}
          restStyles="mt-6"
        />
      </div>
      <p className={styles.infoText} onClick={() => navigate("/join-battle")}>
        Or join already existing battles
      </p>
    </>
  );
};

// NOTE Here we are using HOC as the wrapper of second component that is home and title and also description.
export default PageHOC(
  CreateBattle,
  <>
    Create <br /> a New Battle{" "}
  </>,
  <>Create you own battle and wait for other players to join you</>
);
