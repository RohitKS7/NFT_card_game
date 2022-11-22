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

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState("");
  const [provider, setProvider] = useState("");

  // NOTE Series of useEffects to connect with our smart contract as soon as possible with website load

  // SECTION ------------- Sets the Wallet Account -------------
  const updateCurrentWalletAddress = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
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
      const connection = web3Modal.connect();
      const newProvider = new ethers.providers.Web3Provider(connection);
      const signer = newProvider.getSigner();
      const newContract = new ethers.Contract(ADDRESS, ABI, signer);

      setProvider(newProvider);
      setContract(newContract);
    };

    setSmartContractAndProvider();
  }, []);

  return (
    // This tag takes 1 prop that is "value" which will contain all the values we want to pass on other components(values of smart contract etc.)
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// SECTION ------------- Helper Function -----------------
export const useGlobalContext = () => useContext(GlobalContext);
