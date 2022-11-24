import React, { useState, useEffect } from "react";
import { PageHOC, CustomButton, CustomInput } from "../components";
import { useNavigate } from "react-router-dom";
import styles from "../styles";
import { useGlobalContext } from "../context";

const handleClick = async () => {
  if (!battleName || !battleName.trim()) return null;

  try {
    await contract.createBattle(battleName);
  } catch (error) {
    console.log(error);
  }
};

const CreateBattle = () => {
  const navigate = useNavigate();
  const { contract, battleName, setBattleName } = useGlobalContext();

  return (
    <>
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
