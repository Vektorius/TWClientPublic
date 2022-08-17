import React from 'react'
import "../../../styles/Upgrade.css";
import TraitMap from "../../helpers/TraitMap.json";
import RewardsMap from "../../helpers/RewardsMap.json";
import Web3 from "web3";
import { useEffect, useState } from "react";
import {
  button_default,
  glyphDefault,
  glyphInv,
  icon_Bg_D,
  icon_Bg_M,
  icon_Body_D,
  icon_Body_M,
  icon_Cape_D,
  icon_Cape_M,
  icon_Eye_D,
  icon_Eye_M,
  icon_Hat_D,
  icon_Hat_M,
  icon_Head_D,
  icon_Head_M,
  icon_Item_D,
  icon_Item_M,
  icon_minus,
  icon_Mouth_D,
  icon_Mouth_M,
  icon_Pet_D,
  icon_Pet_M,
  icon_plus,
  traitInv,
} from "../../../data/canvassrc";
import { drawSkeletoonFull } from '../../helpers/Renderer';
import { aTWG, aTWLogic, aTWT, cTWG, cTWLogic, cTWSP, cTWT } from '../../helpers/Groups';
import { displayLoader } from '../../helpers/Loader';


const Upgrade = (prop) => {
  const [selectedGeneIndex, setselectedGeneIndex] = useState(null); // Req for TX
  const [usedPoints, setUsedPoints] = useState(0) //  Req for TX
  const [timeLocked, setTimeLocked] = useState({dateLock: new Date()}); // Req for Points
  const [availablePoints, setAvailablePoint] = useState(0); // Req for Points
  const [unlockDateString, setUnlockDateString] = useState(""); // Req for Points
  const [pointCost, setPointCost] = useState(""); // May be needed for TX ?

  const [traitIds, setTraitIds] = useState([]); // Needed For TX
  const [glyphIds, setGlyphIds] = useState([]); // Needed for TX
  const [inventoryState, setInventoryState] = useState("None");
  const [selectedTrait, setSelectedTrait] = useState("0");
  const [selectedGlyph, setSelectedGlyph] = useState("0");
  const [fetching, setFetching] = useState("None");
  const [approvalState, setApprovalState] = useState(0);


  const contract = cTWLogic;
  const traitContract = cTWT;
  const glyphContract = cTWG;
  const skeletoonContract = cTWSP;
  const web3 = new Web3(Web3.givenProvider);


  let geneIcons = [
    icon_Bg_D,
    icon_Pet_D,
    icon_Body_D,
    icon_Mouth_D,
    icon_Head_D,
    icon_Eye_D,
    icon_Hat_D,
    icon_Item_D,
    icon_Cape_D,
    icon_Bg_M,
    icon_Pet_M,
    icon_Body_M,
    icon_Mouth_M,
    icon_Head_M,
    icon_Eye_M,
    icon_Hat_M,
    icon_Item_M,
    icon_Cape_M,
  ];

  const strPointCost = () => {
    contract.methods.strPointCost().call(async (err, result) => {
      if (!err) {
          setPointCost(web3.utils.fromWei(result, 'ether'))
      } else {
          console.log("Error requesting price cost")
      }
    })
  };

  const listToGeneIndexer = (index) => {
    if (index < 9) {
      return index * 2;
    } else {
      return (index - 9) * 2 + 1;
    }
  };

  const geneIndexertoArr = (index) => {
    if (index % 2 == 0) {return index/2} else { return ((index - 1)/2)+9}
  }

  const listItems = geneIcons.map((gene, index) => (
    <il class={"GeneRow"} id={"Gene" + listToGeneIndexer(index)} key={gene}>
      <img src={gene} onClick={() => {setselectedGeneIndex(listToGeneIndexer(index))}}></img>
      <br></br>
    </il>
  ));

  const renderTraits = () => {
    return (
        <ul>{listItems}</ul>
    );
  };

  const selectedGene = () => {
    return (
      <>
      <img src={geneIcons[geneIndexertoArr(selectedGeneIndex)]}>      
      </img>
      <div class={"GeneText"}>
      {geneDisasaemblerMapped(prop.geneSeq, selectedGeneIndex * 3) + " " + strDissasermbler(prop.strSeq, selectedGeneIndex * 3) + "/100"}
      </div>
      </>
    )
  }

  const changeStrSeqSwap = () => {
    let prefix = "";
    if (selectedGeneIndex != 0)
    {prefix = prop.strSeq.substring(0, ((selectedGeneIndex-1)*3)+3)}
    let edited
    if (selectedGlyph != "0")
    {
      let glyphStr = glyphIds.find(({id}) => id === selectedGlyph)
      edited = (0 + parseInt(glyphStr.points)).toString()
    } else {
      edited = (0).toString()
    }
    edited = (parseInt(edited) + parseInt(usedPoints)).toString()
    for (let twj = edited.length; twj < 3 ;twj++) {edited = "0" + edited}
    let suffix =prop.strSeq.substring(((selectedGeneIndex)*3)+3,54);
     return (prefix+edited+suffix)
  }

  const upgradedGene = () => {
    let pGene 
    let pStr
    if (selectedTrait != "0"){
      pGene = changeGeneSeq();
      pStr = changeStrSeqSwap();
    } else {
      pGene = prop.geneSeq
      pStr = changeStrSeq();
    }
    if (parseInt(strDissasermbler(pStr, selectedGeneIndex * 3))> 100){
      return (
        <>
        <div id={"UpgradedGeneHeader"}>{"Upgraded Gene"}</div>
        <img src={geneIcons[geneIndexertoArr(selectedGeneIndex)]}>  
        </img>
        <div class={"GeneText"}>
        {geneDisasaemblerMapped(pGene, selectedGeneIndex * 3) + "100/100"}
        </div>
        </>
      )
    } else {
      return (
        <>
        <div id={"UpgradedGeneHeader"}>{"Upgraded Gene"}</div>
        <img src={geneIcons[geneIndexertoArr(selectedGeneIndex)]}>  
        </img>
        <div class={"GeneText"}>
        {geneDisasaemblerMapped(pGene, selectedGeneIndex * 3) + " " + strDissasermbler(pStr, selectedGeneIndex * 3) + "/100"}
        </div>
        </>
      )
    }
  }

  const previewCanvas = () => {
    return (
      <canvas id="skeletoon_preview_canvas" width="2000" height="2000"></canvas>
    )
  }
  const sendTX = async () => {
    let approvals = approvalState;
    let position = selectedGeneIndex;
    let points = usedPoints;
    let pointsFree = availablePoints;
    let costPerPoint = pointCost;
    let glyphID = selectedGlyph;
    let traitID = selectedTrait;
    let skeletoonID = prop.skeletoonTokenId;
    if (selectedTrait != "0" && (approvals % 2) == 0){
      let txData = cTWT.methods.setApprovalForAll(aTWLogic, "1").encodeABI();
      web3.eth.getGasPrice(function (error, result){
      web3.eth.sendTransaction(
        {
          from: prop.address,
          to: aTWT,
          data: txData,
          gasPrice: result
        }).on('receipt', function(receipt) {
          setApprovalState(approvals+1)
        });
      })
    } else 
    if (selectedGlyph != "0" && approvals < 2){
      let txData = cTWG.methods.setApprovalForAll(aTWLogic, "1").encodeABI();
      web3.eth.getGasPrice(function (error, result){
      web3.eth.sendTransaction(
        {
          from: prop.address,
          to: aTWG,
          data: txData,
          gasPrice: result
        }).on('receipt', function(receipt) {
          setApprovalState(approvals+2)
        });
      })
    } else 
    if (parseInt(points) > parseInt(pointsFree)){
      let txData = cTWLogic.methods.upgradeSkeletoonPayed(skeletoonID.toString(), glyphID, traitID, points, position).encodeABI();
      web3.eth.getGasPrice(function (error, result){
      web3.eth.sendTransaction(
        {
          from: prop.address,
          to: aTWLogic,
          value: ((parseInt(points) - parseInt(pointsFree)) * (parseInt(web3.utils.toWei(costPerPoint)))).toString(),
          data: txData,
          gasPrice: result
        }).on('receipt', function(receipt) {
          // ???
        });
      })
    } else {
      let txData = cTWLogic.methods.upgradeSkeletoon(skeletoonID.toString(), glyphID, traitID, points, position).encodeABI();
      web3.eth.getGasPrice(function (error, result){
      web3.eth.sendTransaction(
        {
          from: prop.address,
          to: aTWLogic,
          data: txData,
          gasPrice: result
        }).on('receipt', function(receipt) {
          // ???
        });
      })
    }
  }

  const drawPreview = () => {
    let pStr = prop.strSeq;
    let pGene = prop.geneSeq;
    if (selectedTrait != "0"){
      pGene = changeGeneSeq();
    }
    pStr = changeStrSeq();
    drawSkeletoonFull(pGene, pStr, 'skeletoon_preview_canvas', 0, 0, 1000)
  }

  const actionButtons = () => {
      return (
        <div class="btn-group">
        <div class="button-wrapper" onClick={() => {
          var myCanvas = document.getElementById('skeletoon_preview_canvas');
          myCanvas.width = 2000;
          myCanvas.height = 2000;
          drawPreview()
          }}>
        <button><img src={button_default} alt="my image" /></button>
        <div class={"button_text"}>{"Preview"}</div>
        </div>
        <div class="button-wrapper" onClick={() => {sendTX()}}>
        <button><img src={button_default} alt="my image" /></button>
        <div class={"button_text"}>{(selectedTrait != "0" && (approvalState % 2) == 0) ||  (selectedGlyph != "0" && approvalState < 2)? "Approve" : "Upgrade"}</div>
        </div>  
        </div> 
      )
  }

  const PointControl = () => {
    return(
      <div id={"PointControl"}>
          <div class="button-wrapper" id={"buttonMinus"} onClick={() => {
            if (usedPoints > 0) {
              setUsedPoints((parseInt(usedPoints)-1).toString())
            }
          }}>
          <button><img src={icon_minus} alt="my image" /></button>
          </div>
          <input id={"PointInput"} type="number" value={usedPoints} onChange={e => { if (parseInt(e.target.value) > 100) {setUsedPoints("100")} else {setUsedPoints(e.target.value)}}}/>
          <div class="button-wrapper" id={"buttonPlus"} onClick={() => {
            if (usedPoints < 101) {
              setUsedPoints((parseInt(usedPoints)+1).toString())
            }
          }}>
          <button><img src={icon_plus} alt="my image" /></button>
          </div>
      </div>
    )
  }

  const nextPointReq = () => {
    contract.methods.getTimeLocked(prop.skeletoonTokenId).call(async (err, result) => {
      if (!err) {
        setTimeLocked({dateLock: new Date(result*1000)})
      } else {
        console.log("ERROR getting timeLock");
      }
    });
  }

  const availablePointsReq = () => {
    contract.methods.getAvailablePoints(prop.skeletoonTokenId).call(async (err, result) => {
      if (!err) {
        setAvailablePoint(result)
      } else {
        console.log("ERROR getting timeLock");
      }
    });
  }

  const unixTimeStampToNextReward = (timeStamp) => {
    let claimedStamp
    if (availablePoints == 0) {
      claimedStamp = 3600 - timeStamp
    }
    if (availablePoints == 1) {
      claimedStamp = 14400 - timeStamp
    }
    if (availablePoints == 2) {
      claimedStamp = 28800 - timeStamp
    }
    if (availablePoints == 3) {
      claimedStamp = 57600 - timeStamp
    }
    if (availablePoints == 4) {
      claimedStamp = 115200 - timeStamp
    }
    if (availablePoints == 5) {
      return "Maximum points stacked. use points to reset point stacking."
    } else 
    {
      let hours = Math.floor(claimedStamp/3600).toString()
      if (hours.length == 1) {hours = "0" + hours}
      let minutes = Math.floor((claimedStamp - hours*3600)/60).toString()
      if (minutes.length == 1) {minutes = "0" + minutes}
      let seconds = Math.floor((claimedStamp - hours*3600)- minutes*60).toString()
      if (seconds.length == 1) {seconds = "0" + seconds}
      if (timeStamp / 3600 > 87600){
        return "Use your first point to stack Available Points"
      } else {
        return "Next point unlocked in: " + hours + ":" + minutes + ":" + seconds
      }
    }   
  }

  const availablePointsDisplay = () => {
    return (
      <div id={"AvailablePoints"}>
      {"This skeletoon has " + availablePoints + " free points"} 
      </div>
    )
  }

  const nextPointDisplay = () => {
    return (
      <div id={"NextPoint"}>
      {unlockDateString}
      </div>
    )
  }


  const pointCostDisplay = () => {
        let boughtPoints = parseInt(usedPoints) - parseInt(availablePoints)
        if (parseInt(usedPoints) < parseInt(availablePoints))
        {
          return (
          <div id={"PointCost"}>
          </div>
        )} else {return (
          <div id={"PointCost"}>
          {"Cost " + (boughtPoints) * parseFloat(pointCost)}
          </div>
        )}     
  }

  const strDisplay = () => {
      return (
        <>
        {availablePointsDisplay()}
        {nextPointDisplay()}
        {PointControl()}
        {pointCostDisplay()}
        </>
      )
  }

  const geneDisasaemblerMapped = (sequence, index) => {
    let geneSingle = sequence.substring(index, index + 3);
    geneSingle = TraitMap[geneSingle]["1"][2];
    return geneSingle;
  };

  const strDissasermbler = (sequence, index) => {
    let strSingle = sequence.substring(index, index + 3);
    return strSingle;
  };



  const traitBalance = () => {
    if (fetching != "None" ){
      return;
    }
    setInventoryState("Trait")
    if (traitIds.length > 0){
      return;
    }
    setFetching("Traits");
    setTraitIds([]);
    fetchInventoryTrait()
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
                setFetching("None");
            })
        }
    })
  }

  const glyphBalance = () => {
    if (fetching != "None"){
      return;
    }
    setInventoryState("Glyph")
    if (glyphIds.length > 0) {
      return;
    }
    setFetching("Glyph");
    setGlyphIds([]);
    fetchInventoryGlyph()
  }
  
  const fetchInventoryGlyph = () => {
    glyphContract.methods.walletOfOwner(prop.address).call(async (err,result) => {
        if (!err){
          glyphContract.methods.getGlyphPropertiesBatch(result).call( async (err,result) => {
                let invTemp = [];
                for (let i = 0; i < result.length; i= i+3){
                    let temp = {id: result[i], points: result[i+1], type:result[i+2]}
                    invTemp = [...invTemp, temp];
                } 
                setGlyphIds(invTemp);
                setFetching("None");
            })
        }
    })  
  }

  const findType = () => {
    let selectedTraitType;
    if (selectedTrait != "0" ) {
      selectedTraitType = traitIds.filter(obj => {
        return obj.id === selectedTrait
      })
      return selectedTraitType[0].type
    } else 
    return ""
  }

  const findApplies = () => {
    let selectedGlyphApplies;
    if (selectedGlyph != "0" ) {
          let selectedGlyphApplies = glyphIds.filter(obj => {
        return obj.id === selectedGlyph
      })
      return selectedGlyphApplies[0].type
    } else 
    return ""
  }

  const tokenSelector = () => {
    
    return (
      <div class="btn-group">
      <div class="button-wrapper" onClick={() => {traitBalance()}}>
      <button><img src={button_default} alt="my image" /></button>
      <div class={"button_text"}>{"Trait"}</div>
      </div>
      <div class="button-wrapper" onClick={() => {glyphBalance()}}>
      <button><img src={button_default} alt="my image" /></button>
      <div class={"button_text"}>{"Glyphs"}</div>
      </div>
      <div class="button-wrapper" onClick={() => {setSelectedGlyph("0"); setSelectedTrait("0"); setInventoryState("None")}}>
      <button><img src={button_default} alt="my image" /></button>
      <div class={"button_text"} id={"ClearSelecedButton"}>{"Clear"}</div>
      </div> 
      {selectedTrait != "0"? (<img src={traitInv + "/"+ findType() + ".png"} class={"selected"}></img>) : ""}
      {selectedGlyph != "0"? (<img src={glyphInv + "/" + findApplies() + ".png"} class={"selected"}></img>) : ""} 
      </div> 
    )
    
  }


  function filterTrait(trait) {
    let temp = trait.type
    for (let i = 0 ; i<3 ;i++){
      if (temp.length < 3)
      {temp = "0"+temp}
    }
      return (TraitMap[temp]["1"][3] == selectedGeneIndex || selectedGeneIndex % 2 == 1)
  }

  const traitInventoryDisplay = () => {
    let traits = traitIds;
    const inventoryTraitDiv = traits.filter(trait => filterTrait(trait)).map((trait, index) => (
      <il class={"invDiv"} id={"invTrait" + trait.id} key={trait.id}>
        <img src={traitInv + "/"+ trait.type + ".png"} onClick={() => {setSelectedTrait(trait.id)}}></img>
      </il>
    ));   
    return (<ul>{inventoryTraitDiv}</ul>)
  }

  function filterGlyph(glyph){
    let temp = parseInt(glyph.type)
    let tempgeneindex = selectedGeneIndex
    if (selectedGeneIndex % 2 == 1) 
    {tempgeneindex--} 

      return (parseInt(Math.floor(temp/(2**((18-tempgeneindex)/2)))%2) )
  }

  const glyphInventoryDisplay = () => {
    let glyphs = glyphIds;
    const inventoryGlyphDiv = glyphs.filter(glyph => filterGlyph(glyph)).map((glyph, index) => (
      <il class={"invDiv"} id={"invGlyph" + glyph.id} key={glyph.id}>
        <img src={glyphInv + "/" + glyph.type + ".png"} class={"GlyphIcon"} onClick={() => {setSelectedGlyph(glyph.id)}}></img>
      </il>
    ));
    return (<ul>{inventoryGlyphDiv}</ul>)
  }

  const displayInventory = () => {
   if (fetching != "None") {
     return (
       <div>{"LOADING"}</div>
     )
   } else if (inventoryState =="Trait") {
     return (
      traitInventoryDisplay()
     )
   } else if (inventoryState =="Glyph") {
     return (
      glyphInventoryDisplay()
     )
   } else {return(<></>)}
  }

  const upgradeDisplay = () => {
    return (
      <div className={"ActionDisplay"}>
      <div className={"SelectedGene"}> {selectedGene()}</div>
      <div className={"UpgradedGene"}>{upgradedGene()}</div>
      <div className={"PointsDisplay"}>{strDisplay()}</div>
      <div className={"ButtonsDisplay"}>{ actionButtons()}</div>
      <div className={"TokenSelector"}>{ tokenSelector()}</div>
      <div className={"TokenInventory"}>{ displayInventory()}</div>
      <div className={"UpgradeCanvasPreview"}>{ previewCanvas()}</div>
      </div>
    )
  }

  const changeStrSeq = () => {
    let prefix = "";
    if (selectedGeneIndex != 0)
    {prefix = prop.strSeq.substring(0, ((selectedGeneIndex-1)*3)+3)}
    let edited
    if (selectedGlyph != "0")
    {
      let glyphStr = glyphIds.find(({id}) => id === selectedGlyph)
      edited = (parseInt(prop.strSeq.substring((selectedGeneIndex)*3, ((selectedGeneIndex)*3)+3)) + parseInt(glyphStr.points)).toString()
    } else {
      edited = (parseInt(prop.strSeq.substring((selectedGeneIndex)*3, ((selectedGeneIndex)*3)+3))).toString()
    }
    edited = (parseInt(edited) + parseInt(usedPoints)).toString()
    for (let twj = edited.length; twj < 3 ;twj++) {edited = "0" + edited}
    let suffix =prop.strSeq.substring(((selectedGeneIndex)*3)+3,54);
     return (prefix+edited+suffix)
  }

  const changeGeneSeq = () => {
    let prefix = "";
    if (selectedGeneIndex != 0)
    {prefix = prop.geneSeq.substring(0, ((selectedGeneIndex-1)*3)+3)}
    let edited = traitIds.find(({id}) => id === selectedTrait)
    edited = edited.type
    for (let i = 0 ; i<3 ;i++){
      if (edited.length < 3)
      {edited = "0"+edited}
    }
    let suffix =prop.geneSeq.substring(((selectedGeneIndex)*3)+3,54);
     return (prefix+edited+suffix)
  }

  const traitSelector = () => {
    return (
      <>
      <div id={"GeneTextHeader"}>{"Select Gene to upgrade"}</div>
      <div className={"GeneSelector"}>{renderTraits()}</div>
      {selectedGeneIndex !== null ? upgradeDisplay() : ""}
      </>
    )
  }

  useEffect(() => {
    var today = new Date();
    let unixTimeLocked = ((new Date(today.getTime())) - timeLocked.dateLock.getTime()) / 1000
    setUnlockDateString(unixTimeStampToNextReward(unixTimeLocked))
  }, [usedPoints, availablePoints])

  useEffect(() => {
    let tempApproval = approvalState
    if (selectedTrait != "0" && (tempApproval % 2) == 0){
      traitContract.methods.isApprovedForAll(prop.address, aTWLogic).call( async(err, result) => {
        if (result == true) {
          setApprovalState(tempApproval + 1)
        }
      });
    }
    if (selectedGlyph != "0" && tempApproval < 2){
      glyphContract.methods.isApprovedForAll(prop.address, aTWLogic).call( async(err, result) => {
        if (result == true) {
          setApprovalState(tempApproval + 2)
        }
      });
    }
  }, [selectedTrait, selectedGlyph, approvalState])

  useEffect(() => {
    nextPointReq()
    availablePointsReq()
    strPointCost()
  }, [prop.skeletoonTokenId])
  

  return (
    <div>{traitSelector()}</div>
  )
}

export default Upgrade