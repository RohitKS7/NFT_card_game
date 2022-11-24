import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useNavigate } from "react-router-dom";
import { ABI, ADDRESS } from "../contract";
import { createEventListeners } from "./createEventListeners";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState("");
  const [provider, setProvider] = useState("");
  const [showAlert, setShowAlert] = useState({
    status: false, // false means alert is not showing
    type: "info",
    message: "",
  });
  const [battleName, setBattleName] = useState("");
  const [gameData, setGameData] = useState({
    players: [],
    pendingBattles: [],
    activeBattle: null,
  });

  const navigate = useNavigate();

  // NOTE Series of useEffects to connect with our smart contract as soon as possible with website load

  // SECTION ------------- Sets the Wallet Account -------------
  const updateCurrentWalletAddress = async () => {
    const accounts = await window?.ethereum?.request({
      method: "eth_accounts",
    });

    if (accounts) setWalletAddress(accounts[0]);
  };

  useEffect(() => {
    updateCurrentWalletAddress();

    window?.ethereum?.on("accountsChanged", updateCurrentWalletAddress);
  }, []);

  // SECTION ------------- Sets the Smart Contract and Provider -------------
  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const newProvider = new ethers.providers.Web3Provider(connection);
      const signer = newProvider.getSigner();
      const newContract = new ethers.Contract(ADDRESS, ABI, signer);

      setProvider(newProvider);
      setContract(newContract);
    };

    setSmartContractAndProvider();
  }, []);

  // SECTION ------------- EventListeners  -------------
  useEffect(() => {
    if (contract) {
      // providing all the props we need to use in eventListeners page
      createEventListeners({
        navigate,
        contract,
        provider,
        walletAddress,
        setShowAlert,
      });
    }
  }, [contract]);

  // SECTION ------------- Notification -------------
  useEffect(() => {
    // if alert is already showing then close it in 5 seconds
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: "info", message: "" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // SECTION ------------- Keep Track of Active Battles -------------
  // set the game data to the state whenever the contract changes
  useEffect(() => {
    const fetchGameData = async () => {
      const fetchedBattles = await contract.getAllBattles();
      // battleStatus === 0 , means battle is in pending state
      const pendingBattles = fetchedBattles.filter((battle) => {
        battle.battleStatus === 0;
      });

      let activeBattle = null;

      // Find if the current player has created a battle or not
      fetchedBattles.forEach((battle) => {
        // if the players address is similar to their browser's wallet address
        if (
          battle.players.find(
            (player) => player.toLowerCase() === walletAddress.toLowerCase()
          )
        ) {
          // if the winner is 0x00 address that means the battle is still in process
          if (battle.winner.startsWith("0x00")) {
            activeBattle = battle; // actual battle
          }
        }
      });

      // start with index 1 battles coz index 0 is always empty
      setGameData({ pendingBattles: pendingBattles.slice(1), activeBattle });
    };

    if (contract) fetchGameData();
  }, [contract]);

  return (
    // This tag takes 1 prop that is "value" which will contain all the values we want to pass on other components(values of smart contract etc.)
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
        setShowAlert,
        showAlert,
        battleName,
        setBattleName,
        gameData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// SECTION ------------- Helper Function -----------------
export const useGlobalContext = () => useContext(GlobalContext);
