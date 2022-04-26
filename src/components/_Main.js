import React, { useEffect, useState } from "react";
import "../styles/Main.css";
import Profile from "./_Profile";
import abi from "../contracts/ABI.json";
import Web3 from "web3";
import { fetchMetadata } from "../scripts/Helper";
const contractAddress = "0x1dadaa7e55b2c7238ed04891ac182ea1468b79b9";
const { ethereum } = window;

const Main = (prop) => {
  const [skeletoons, updateSkeletoons] = useState([]);
  const [areSkeletoonsFetched, setFetch] = useState(0);
  const [selectedSkeletoonId, setselectedSkeletoonId] = useState(null);
  const [toggleMode, setToggleMode] = useState("disconnected");
  const [page, setPage] = useState("default");
  const skeletoonList = [];
  const emptyArray = [];
  const web3 = new Web3(Web3.givenProvider);
  const contract = new web3.eth.Contract(abi, contractAddress);

  

  const goodFetcher = () => {
    setFetch(1);
    contract.methods.balanceOf(prop.address).call(async(err, result) => {
      if (result === "0") {
        setPage("mint");
      } else {
      for (let i = 0; i < result; i++) {
        console.log(i)
        contract.methods.tokenOfOwnerByIndex(prop.address, i).call(async(err, result) => {
          if (!err) {
            contract.methods.tokenURI( result).call( async(err, result) => {
              if (!err) {
                console.log(result)
                let tokenMetadata = await fetchMetadata( result);
                console.log(tokenMetadata)
                updateSkeletoons((skeletoonList) => [...skeletoonList, tokenMetadata]);
              } else {
                fetcherRetry(i)
              }
            });
          } else {
            fetcherRetry(i)
          }
        });
      }
    }
    });
  };

  const fetcherRetry = (tokenID) => {
    contract.methods.tokenOfOwnerByIndex(prop.address, tokenID).call(async(err, result) => {
      if (!err) {
        contract.methods.tokenURI( result).call( async(err, result) => {
          if (!err) {
            console.log(result)
            let tokenMetadata = await fetchMetadata( result);
            console.log(tokenMetadata)
            updateSkeletoons((skeletoonList) => [...skeletoonList, tokenMetadata]);
          } else {
            fetcherRetry(tokenID)
          }
        });
      } else {
        fetcherRetry(tokenID)
      }
    });
  }

  const renderList = () => {
    const listItems = skeletoons.map((token) => (
      <il key={token.id} onClick={() => {
          setselectedSkeletoonId((token.id))
          console.log(token.name)}}>
        {token.name}
        <br></br>
      </il>
    ));
    return (
      <div>
        {reFetchButton()}
        <ul>{listItems}</ul>   
      </div>
    );
  };

  const fetchButton = () => {
    return (
      <button onClick={() => goodFetcher()} className={"Skelly_BTN"}>
      "Summon Skeletoons"
      </button>
    )
  }

  const reFetchButton = () => {
    
    return (
      <button onClick={() => {setFetch(0)
        updateSkeletoons(emptyArray)
        goodFetcher()}} className={"Skelly_BTN"}>
        "Re-Summon Skeletoons"
      </button>
    )
  }

  const walletConnected = () => {
    return(
      <div className={"skeletoonList"}>{areSkeletoonsFetched ? renderList() : fetchButton()}</div>
    )
  }


  useEffect(() => {
    
    ethereum.on("accountsChanged", function () {
      setFetch(0);
      setselectedSkeletoonId(null);
      updateSkeletoons(emptyArray);
      setPage("default")
    });
    if (prop.address !== null && prop.chain === 250 && !(toggleMode !== "farm" ^ toggleMode !=="ritual")) {
      setToggleMode("connected");
    } else if (prop.chain !== 250){
      setToggleMode("disconnected");
    } else if (prop.chain === 250 && selectedSkeletoonId === null) {
      setToggleMode("connected")
    }
    
  });


  return (
    <div>
    <div className={"body"}>
      {selectedSkeletoonId == null && toggleMode === "disconnected" ? "Please connect your wallet" : ""}
      {selectedSkeletoonId == null && toggleMode === "connected" && page === "default" ? walletConnected() : ""}
      {selectedSkeletoonId == null && toggleMode === "connected" && page === "mint" ? "MINTER" : ""}
      {selectedSkeletoonId !== null && toggleMode !== "disconnected"? <Profile skeletoonId={selectedSkeletoonId} availableSkeletoons={skeletoons} mode={toggleMode}></Profile>: ""}
    </div>
    <br/>
    
    </div>
  );
};

export default Main;
