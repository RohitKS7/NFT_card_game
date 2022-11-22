import React from "react";
import { PageHOC } from "../components";
import styles from "../styles";

const CreateBattle = () => {
  return (
    <>
      <div className="flex flex-col mb-5"></div>
      <p className={styles.infoText}>Or join already existing battles</p>
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
