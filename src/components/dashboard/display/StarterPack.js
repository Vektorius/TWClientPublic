import React from 'react'
import { button_default, glyphInv, traitInv } from '../../../data/canvassrc';
import "../../../styles/StarterPack.css";
import Web3 from "web3";
import { aTWStarter, cTWStarter } from '../../helpers/Groups';



const StarterPack = (prop) => {
    const web3 = new Web3(Web3.givenProvider);

    const sendTX = () => {
    let txData = cTWStarter.methods.claimSingleReward(prop.skeletoonTokenId).encodeABI();
      web3.eth.getGasPrice(function (error, result){
        web3.eth.sendTransaction(
            {
              from: prop.address,
              to: aTWStarter,
              data: txData,
              gasPrice: result
            }).on('receipt', function(receipt) {
              
            });
      })
      
    }

  return (
    <div id={"Pack"}>
        {"Following items will be airdroped to your wallet. Each Skeletoon can claim 1 starter pack."}
        <br></br>
        <img class={"packImg"} src={traitInv+ "/53.png"}></img>
        <img class={"packImg"} src={traitInv+ "/54.png"}></img>
        <img class={"packImg"} src={traitInv+ "/56.png"}></img>
        <img class={"packImg"} src={traitInv+ "/57.png"}></img>
        <img class={"packImg"} src={traitInv+ "/58.png"}></img>
        <img class={"packImg"} src={traitInv+ "/59.png"}></img>
        <img class={"packImg"} src={traitInv+ "/60.png"}></img>
        <img class={"packImg"} src={traitInv+ "/61.png"}></img>
        <img class={"packImg"} src={traitInv+ "/62.png"}></img>
        <img class={"packImg"} src={traitInv+ "/63.png"}></img>
        <br></br>
        <div class="btn-group">
        <div class="button-wrapper" id={"StarterPackClaim"} onClick={() => {sendTX()}}>
        <button><img src={button_default} alt="my image" /></button>
        <div class={"button_text"} >{"Claim"}</div>
        </div>
        </div>
    </div>
    
  )
}

export default StarterPack