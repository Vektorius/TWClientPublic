import React from 'react'
import "../../../styles/Mint.css";
import TraitMap from "../../helpers/TraitMap.json";
import RewardsMap from "../../helpers/RewardsMap.json";
import Web3 from "web3";
import { useEffect, useState } from "react";
import {
  button_default,
} from "../../../data/canvassrc";
import { drawSkeletoonFull } from '../../helpers/Renderer';
import { aSPSK, cTWSP, aTWSP, ctestnetSPSK, atestnetSPSK, cSPSK } from '../../helpers/Groups';
import { displayLoader } from '../../helpers/Loader';

const Mint = (prop) => {
  const [constructor, setConstructor] = useState(0);
  const [SPSKbalance, setSPSKbalance] = useState([]);
  const [SPSKsupply, setSPSKsupply] = useState(null);
  const [claimedTokens, setClaimedTokens] = useState([]);
  const [mintAmount, setMintAmount] = useState(null);

  const contractSPSK = ctestnetSPSK;
  const contractTWSP = cTWSP;

  const web3 = new Web3(Web3.givenProvider);

  const mintTX = () => {

    // check if approve trait all needed, check if approve all glyph needed, check if payed or not,
    contractSPSK.methods.getPrice().call((err, result) => {
      if (!err)
      {
        let price = web3.utils.fromWei(result, 'ether')
        let priceInt = parseInt(price) * parseInt(mintAmount)
        price = web3.utils.toWei(priceInt.toString())
        let txData = contractSPSK.methods.mint(prop.address, mintAmount).encodeABI();
        web3.eth.sendTransaction(
          {
            from: prop.address,
            to: aSPSK,
            value: price,
            data: txData,
          }).on('receipt', function(receipt) {
            balanceSPSK()
            fetchSPSKbalance()
          });
      }
    })
  }

  const claimTX = () => {

    // check if approve trait all needed, check if approve all glyph needed, check if payed or not,
    let txData = contractTWSP.methods.claim(claimedTokens).encodeABI();
      web3.eth.sendTransaction(
        {
          from: prop.address,
          to: aTWSP,
          data: txData,
        }).on('receipt', function(receipt) {
          
        });
  }

  const balanceSPSK = () => {
    contractSPSK.methods.totalSupply().call((err,result) => {
      if(!err){
        setSPSKsupply(result)
      } else {
        console.log(err)
        return err
      }
    })
  }

  const calcCost = () => {
    /*
    contractSPSK.methods.getPrice().call((err,result) => {
      if(!err){
        return result
      } else {
        return err
      }
    })*/
  }

  const mintOriginal = () => {
    return(
      <>
      <div id={"DisplayOGSupply"}>
        {SPSKsupply + "/ 10 000 Spooky Skeletoons Minted"}
        <br></br>
        {"Enter amount you wish to mint and click Mint bellow"}
      </div>
      <div id={"InputBoxMint"}>
        <input className={"inputMint"} type="number" placeholder={"Amount"} onChange={e => {setMintAmount(e.target.value)}}/>
        {"Cost " + calcCost() + " FTM"}
      </div>
      <div id={"MintButton"}>
      <div class="btn-group">
      <div class="button-wrapper" onClick={() => {mintTX()}}>
        <button><img src={button_default} alt="my image" /></button>
        <div class={"button_text"}>{"Mint"}</div>
      </div>  
      </div>  
      </div>
      </>
    )
  }

  const setTokensToClaim = (idArr, amount) => {
    if (idArr !== null) {
      let splitArr = idArr.split(",")
      setClaimedTokens(splitArr)
    } 
    if (amount !== null){
      setClaimedTokens(SPSKbalance.slice(0, parseInt(amount)))
    }
  }

  const claimTWSP = () => {
    return (
      <>
      <div id={"ClaimInput"}>
        {SPSKbalance.length > 0 ? 
        <>
        <input className={"inputMint"} type="text" placeholder={"TokenId,TokenId,TokenId"} onChange={e => {setTokensToClaim(e.target.value, null)}}/>
        <input className={"inputMint"} type="number" placeholder={"Amount"} onChange={e => {setTokensToClaim(null, e.target.value)}}/>
        </>
        : ""}
      </div>
      <div id={"ClaimButton"}>
      <div class="btn-group">
      <div class="button-wrapper" onClick={() => {claimTX()}}>
        <button><img src={button_default} alt="my image" /></button>
        <div class={"button_text"}>{"Claim"}</div>
      </div>  
      </div> 
      </div>
      </>
    )
  }

  const infoBox = () => {
    return (
      <div id={"InfoBox"}>
        {SPSKbalance.length > 0 ? "You have " + SPSKbalance.length + " ToonWorld Skeletoons that you can claim, with Ids: [" + SPSKbalance + "] Enter Token Id or Amount of tokens that you wish to claim bellow and click \"Claim\"" : "You have no ToonWorld Skeletoons that can be claimed. Mint Spooky Skeletoon and claim your ToonWorld Skeletoon "}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        {SPSKbalance.length > 0 ?"Token IDs: ~~~~~~OR~~~~~~ Token Amount:": ""}
      </div>
    )
  }

  const fetchSPSKbalance = () => {
    contractSPSK.methods.walletOfOwner(prop.address).call(async (err, result) => {
      if (!err) {
        let temp = result
        let unclaimed = [];
        contractTWSP.methods.isTokenClaimedBatch(temp).call(async (err, result) => {
          if (!err){
            for (let i = 0; i < temp.length; i++){
              if (result[i] == 0){
                unclaimed = [...unclaimed, temp[i]];
              }
            }
            setSPSKbalance(unclaimed)
          }
        })
      } else {
        
      }
    });
  }

  useEffect( () => {
    fetchSPSKbalance()
    balanceSPSK()
  },[prop.address])

  return (
    <>
    {mintOriginal()}
    {claimTWSP()}
    {infoBox()}
    </>
  )
}

export default Mint