import React, { useEffect, useState } from "react";
import "../styles/Book.css";
import Inventory from "./Inventory";
import Profile from "./_Profile";
import abi from "../contracts/ABI.json";
import Web3 from "web3";
import { fetchMetadata } from "../scripts/Helper";
import Farm from './Farm'
import Ritual from './Ritual'
const contractAddress = "0x1dadaa7e55b2c7238ed04891ac182ea1468b79b9";
const { ethereum } = window;

const Book = (prop) => {
  const [skeletoons, updateSkeletoons] = useState([]);
  const [areSkeletoonsFetched, setFetch] = useState(0);
  const [selectedSkeletoonId, setselectedSkeletoonId] = useState(null);
  const [toggleMode, setToggleMode] = useState("book");
  const skeletoonList = [];
  const emptyArray = [];
  const web3 = new Web3(Web3.givenProvider);
  const contract = new web3.eth.Contract(abi, contractAddress);

  

  const goodFetcher = () => {
    setFetch(1);
    contract.methods.balanceOf(prop.address).call(async(err, result) => {
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

  const activeBook = () => {
    return(
      <div className={"skeletoonList"}>{areSkeletoonsFetched ? renderList() : fetchButton()}</div>
    )
  }

  const farmButton = () => {
    return (
      <button className={"farmButton"} onClick={() => {setToggleMode("farm")}} >
        Grinding Grounds
        </button>
    )
  }

  const bookButton = () => {
    return (
      <button className={"bookButton"} onClick={() => {setToggleMode("book-active")}} >
        Book of the Dead
        </button>
    )
  }

  const ritualButton = () => {
    return (
      <button className={"ritualButton"} onClick={() => {setToggleMode("ritual")}} >
        Summoning Ritual
        </button>
    )
  }

  useEffect(() => {
    
    ethereum.on("accountsChanged", function () {
      setFetch(0);
      setselectedSkeletoonId(null);
      updateSkeletoons(emptyArray);
    });
    if (prop.address !== null && prop.chain === 250 && !(toggleMode !== "farm" ^ toggleMode !=="ritual")) {
      setToggleMode("book-active");
    } else if (prop.chain !== 250){
      setToggleMode("book");
    } else if (prop.chain === 250 && selectedSkeletoonId === null) {
      setToggleMode("book-active")
    }
    
  });


  return (
    <div>
    <div className={"body"}>
      <div>{toggleMode === "book-active"  ? activeBook() : ""}</div>
    </div>
    <br/>
    {selectedSkeletoonId !== null && toggleMode !== "book" ? <Profile skeletoonId={selectedSkeletoonId} availableSkeletoons={skeletoons} mode={toggleMode}></Profile>: ""}
    {toggleMode !== "book" ? <Inventory address={prop.address}></Inventory> : ""}
    {selectedSkeletoonId !== null && toggleMode !== "farm" ? farmButton(): ""} 
    {selectedSkeletoonId !== null && toggleMode !== "ritual" ? ritualButton(): ""} 
    {(toggleMode === "farm" || toggleMode === "ritual") ? bookButton() : ""} 
    {toggleMode === "farm" ? <Farm></Farm> : ""}
    {toggleMode === "ritual" ? <Ritual></Ritual> : ""}
    </div>
  );
};

export default Book;
