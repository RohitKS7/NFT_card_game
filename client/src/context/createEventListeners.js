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
}) => {
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
};
