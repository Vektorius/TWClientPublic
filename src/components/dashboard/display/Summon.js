import React from 'react'
import "../../../styles/Summon.css";
import TraitMap from "../../helpers/TraitMap.json";
import RewardsMap from "../../helpers/RewardsMap.json";
import Web3 from "web3";
import { useEffect, useState } from "react";
import {
  button_default,
  icon_Bg_D,
  icon_Body_D,
  icon_Cape_D,
  icon_Eye_D,
  icon_Hat_D,
  icon_Head_D,
  icon_Item_D,
  icon_minus,
  icon_Mouth_D,
  icon_no,
  icon_Pet_D,
  icon_plus,
  icon_yes,
  traitInv,
} from "../../../data/canvassrc";
import { drawSkeletoonFull } from '../../helpers/Renderer';
import { aTWG, aTWLogic, aTWSP, aTWT, cTWG, cTWLogic, cTWSP, cTWT } from '../../helpers/Groups';
import { displayLoader } from '../../helpers/Loader';
// Select each trait send tx
const Summon = (prop) => {
  const emptyTrait = {id: null, type:"000"}
  const [selectedGeneIndex, setselectedGeneIndex] = useState(0); // Req for TX
  const [traitIds, setTraitIds] = useState([]); // Needed For TX
  const [usedTraits, setUsedTraits] = useState([emptyTrait,emptyTrait,emptyTrait,emptyTrait,emptyTrait,emptyTrait,emptyTrait,emptyTrait,emptyTrait]);
  const [fetching, setFetching] = useState("None");
  const [approvalState, setApprovalState] = useState(0);

  const web3 = new Web3(Web3.givenProvider);

  const traitContract = cTWT;
  let geneIcons = [
    icon_Bg_D,
    icon_Pet_D,
    icon_Body_D,
    icon_Mouth_D,
    icon_Head_D,
    icon_Eye_D,
    icon_Hat_D,
    icon_Item_D,
    icon_Cape_D
  ];

  const previewCanvas = () => {
    return (
      <canvas id="skeletoon_summon_canvas" width="2000" height="2000"></canvas>
    )
  }

  const previewDraw = () => {
    let pStr = "000000000000000000000000000000000000000000000000000000";
    let summonArr = usedTraits
    let pGene = "";
    summonArr.forEach(trait => {
      let temp = trait.type;
      for (let i = 0; i<3 ;i++){
        if (temp.length < 3) {
          temp = "0" + temp
        }
      }
      pGene = pGene + temp + "000"
    });
    drawSkeletoonFull(pGene, pStr, 'skeletoon_summon_canvas', 0, 1, 500)
  } 

  const sendTX = () => {
    let approvals = approvalState;
    let usedTraitIDs = [];
    for (let i=0; i< 9; i++){
      usedTraitIDs[i] = usedTraits[i].id;
    }
    // check if approve trait all needed, check if approve all glyph needed, check if payed or not,
    if (approvals % 2  === 0){
      let txData = cTWT.methods.setApprovalForAll(aTWLogic, "1").encodeABI();
      web3.eth.sendTransaction(
        {
          from: prop.address,
          to: aTWT,
          data: txData,
        }).on('receipt', function(receipt) {
          setApprovalState(1)
        });
    } else 
    cTWLogic.methods.summonFee().call(async (err, result) => {

      if (approvals === 3){

        let txData = cTWLogic.methods.summonSkeletoon(usedTraitIDs).encodeABI();
        web3.eth.sendTransaction(
          {
            from: prop.address,
            to: aTWLogic,
            value: result,
            data: txData,
          }).on('receipt', function(receipt) {
            // ???
          });
      }
    })  
  }

  const actionButtons = () => {
    return (
      <div class="btn-group">
      <div class="button-wrapper" onClick={() => {
        var myCanvas = document.getElementById('skeletoon_summon_canvas');
        myCanvas.width = 2000;
        myCanvas.height = 2000;
        previewDraw()
        }}>
      <button><img src={button_default} alt="my image" /></button>
      <div class={"button_text"}>{"Preview"}</div>
      </div>
      { approvalState >= 2
      ?
      <div class="button-wrapper" id={"SingleViewButton"} onClick={() => {sendTX()}}>
      <button><img src={button_default} alt="my image" /></button>
      <div class={"button_text"} >{approvalState == 3 ? "Summon": "Approve Traits"}</div>
      </div>  
      : ""}
      </div> 
    )

}

  const traitBalance = () => {
    if (fetching != "None" ){
      //Throw Error to Div
      return;
    }
    if (traitIds.length > 0){
      return;
    }
    setFetching("Traits");
    setTraitIds([]);
    fetchInventoryTrait()
    return (
      "LOADING"
    )
  }

  const fetchInventoryTrait = () => {
    traitContract.methods.walletOfOwner(prop.address).call(async (err,result) => {
        if (!err){
          traitContract.methods.getTraitPropertiesBatch(result).call( async (err,result) => {
                let invTemp = [];
                for (let i = 0; i < result.length; i= i+2){
                    let temp = {id: result[i], type: result[i+1]}
                    invTemp = [...invTemp, temp];
                } 
                setTraitIds(invTemp);
                setFetching("Done");
            })
        }
    })
  }



  function filterTrait(trait) {
    let temp = trait.type
    for (let i = 0 ; i<3 ;i++){
      if (temp.length < 3)
      {temp = "0"+temp}
    }
    console.log(temp)
    console.log(typeof temp)
      return (TraitMap[temp]["1"][3] == selectedGeneIndex)
  }

  const traitSelectedFromInv = (trait) => {
    const newUsed = [...usedTraits];
    let index = selectedGeneIndex /2
    newUsed[index] = trait
    if (newUsed !== usedTraits)
    {
      setUsedTraits(newUsed)
    }
  }

  const traitInventoryDisplay = () => {
    let traits = traitIds;
    // FIX img src
    const inventoryTraitDiv = traits.filter(trait => filterTrait(trait)).map((trait, index) => (
      <il class={"invDiv"} id={"invTrait" + trait.id} key={trait.id}>
        <img src={traitInv + "/"+ trait.type + ".png"} onClick={() => {traitSelectedFromInv(trait)}}></img>
      </il>
    ));   
    return (<ul>{inventoryTraitDiv}</ul>)
  }

  const displayInventory = () => {
    if (fetching =="None") {
      traitBalance()
    }
    if (fetching == "Traits") {
      return (
        <div>{"LOADING"}</div>
      )
    } else if (fetching == "Done") {
      return (
       traitInventoryDisplay()
      )
    } else {return(<></>)}
   }

  const isTraitAdded = ( text ) => {
    let tempText = text
      for (let i=0; i<3; i++){
        if (tempText.length < 3) {
          return tempText = "0"+tempText
        }
      }
  } 



  const listItems = geneIcons.map((gene, index) => (
    <il class={"GeneRow"} id={"Gene" + index} key={gene}>
      <img src={gene} onClick={() => {setselectedGeneIndex((index*2))}}></img>
      {<>{(usedTraits[index].id !== null) ? 
      <><img src={traitInv + "/"+ usedTraits[index].type + ".png"} class={"addedTraitToSummon"} onClick={() => {setselectedGeneIndex((index*2))}}></img>
      <img class={"ValidityLong"} src={icon_yes} onClick={() => {setselectedGeneIndex((index*2))}}></img>
      </> :
      <><div class={"GeneTextAlt"} onClick={() => {setselectedGeneIndex((index*2))}}>{"Trait required"}</div><img class={"ValidityLong"} src={icon_no} onClick={() => {setselectedGeneIndex((index*2))}}></img></>}</>}
      <br></br>
    </il>
  ));

  const renderTraits = () => {
    return (
        <ul>{listItems}</ul>
    );
  };

  useEffect(()=>{
    let Arr = usedTraits
    let counter = 0;
    for (let i =0; i<9;i++){
      if (Arr[i].id !== null) {
        counter++;
        console.log(counter)
      }
    }
    let tempApproval = approvalState
    if (counter === 9 && (tempApproval % 2) == 0){
      traitContract.methods.isApprovedForAll(prop.address, aTWLogic).call( async(err, result) => {
        if (result == true) {
          setApprovalState(3)
        }
      });
    }
    else if (counter === 9 && tempApproval < 2){
      setApprovalState(2)
    }
  },[usedTraits, approvalState])

  return (
    <div>
      <div id="SummonHeaderM">{"Burn 9 Traits to Summon Skeletoon"}</div>
      <div id="SummonHeader1">Select Trait</div>
      <div id="SummonHeader2">Inventory</div>
      <div id={"TraitSelector"}>{renderTraits()}</div>
      <div id={"SummonInventory"}>{displayInventory()}</div>
      <div id={"SummonButtons"}>{actionButtons()}</div>
      <div id={"SummonCanvas"}>{previewCanvas()}</div>
    </div>
  )
}

export default Summon