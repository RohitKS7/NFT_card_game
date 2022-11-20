import React from "react";
import { PageHOC } from "../components";

const CreateBattle = () => {
  return <></>;
};

// NOTE Here we are using HOC as the wrapper of second component that is home and title and also description.
export default PageHOC(
  CreateBattle,
  <>
    Create <br /> a New Battle{" "}
  </>,
  <>Create you own battle and wait for other players to join you</>
);
