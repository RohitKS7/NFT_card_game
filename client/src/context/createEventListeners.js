import { ethers } from "ethers";
import { ABI } from "../contract";

// cb = "callback"
const AddNewEvent = (eventFilter, provider, cb) => {
  provider.removeListener(eventFilter); // unsuring not have multiple listeners for the same events.

  provider.on(eventFilter, (logs) => {
    const parsedLog = new ethers.utils.Interface(ABI).parseLog(logs);

    cb(parsedLog);
  });
};

export const createEventListeners = ({
  navigate,
  contract,
  provider,
  walletAddress,
  setShowAlert,
  setUpdateGameData,
}) => {
  // SECTION -------- Event After Player Register -----------
  const newPlayerEventFilter = contract.filters.NewPlayer();
  //  destructuring the parsedLog passed in "cb()"
  AddNewEvent(newPlayerEventFilter, provider, ({ args }) => {
    console.log("New Player Created", args);

    if (walletAddress === args.owner) {
      setShowAlert({
        status: true,
        type: "success",
        message: "Player has been successfully registered",
      });
    }
  });

  // SECTION -------- Event After JoinBattle -----------
  const NewBattleEventFilter = contract.filters.NewBattle();
  //  destructuring the parsedLog passed in "cb()"
  AddNewEvent(NewBattleEventFilter, provider, ({ args }) => {
    console.log("new battle started", args, walletAddress);

    // checking if our player exists or not
    if (
      walletAddress.toLowerCase() === args.player1.toLowerCase() ||
      walletAddress.toLowerCase() === args.player2.toLowerCase()
    ) {
      navigate(`/battle/${args.battleName}`);
    }

    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });
};
