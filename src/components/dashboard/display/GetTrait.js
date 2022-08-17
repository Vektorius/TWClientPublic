import React from 'react'
import "../../../styles/GetTrait.css";
import "../../../styles/Upgrade.css";
import TraitMap from "../../helpers/TraitMap.json";
import Web3 from "web3";
import { useEffect, useState } from "react";
import {
  button_default,
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
  icon_no,
  icon_Pet_D,
  icon_Pet_M,
  icon_plus,
  icon_yes,
  traitInv,
} from "../../../data/canvassrc";
import { drawSingleCanvas, drawSkeletoonFull } from '../../helpers/Renderer';
import { aTWLogic, cTWLogic} from '../../helpers/Groups';
import { displayLoader } from '../../helpers/Loader';
const GetTrait = (prop) => {
  const [displaySettings, setDisplaySettings] = useState(null);
  const [selectedGeneIndex, setselectedGeneIndex] = useState(null);
  const [messageStatus, setMessageStatus] = useState(null);

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

  const web3 = new Web3(Web3.givenProvider);
  const strCost = "100";

  const listToGeneIndexer = (index) => {
    if (index < 9) {
      return index * 2;
    } else {
      return (index - 9) * 2 + 1;
    }
  };

  const changeStrSeq = () => {
    let prefix = "";
    if (selectedGeneIndex != 0)
    {prefix = prop.strSeq.substring(0, ((selectedGeneIndex-1)*3)+3)}
    let edited = "000"
    for (let twj = edited.length; twj < 3 ;twj++) {edited = "0" + edited}
    let suffix =prop.strSeq.substring(((selectedGeneIndex)*3)+3,54);
     return (prefix+edited+suffix)
  }

  const drawPreview = () => {
    let selectedGene = selectedGeneIndex

    let pStr = changeStrSeq();
    let pGene = prop.geneSeq;

    let geneSingle = pGene.substring((selectedGene*3), (selectedGene*3 )+ 3);



    let tStr = "000000000000000000000000000000000000000000000000000000"
    let tGene = "000000000000000000000000000000000000000000000000"+ geneSingle +"000"
    drawSkeletoonFull(pGene, pStr, 'skeletoon_preview_canvas', 0, 2, 250);
    drawSingleCanvas((traitInv + "/"+ geneSingle.substring(1) + ".png"), 'trait_preview_canvas');
  }

  const sendTX = async () => {
    let position = selectedGeneIndex;
    let skeletoonID = prop.skeletoonTokenId;
    if (skeletoonID <= 10000 && parseInt(strDissasermbler(prop.strSeq, position * 3)) == 100 && prop.geneSeq.substring((position*3), (position*3 )+ 3) != "000"){
      let txData = cTWLogic.methods.getGene(skeletoonID, position).encodeABI();
      web3.eth.getGasPrice(function (error, result){
        web3.eth.sendTransaction(
          {
            from: prop.address,
            to: aTWLogic,
            data: txData,
            gasPrice: result
          }).on('receipt', function(receipt) {
            setMessageStatus("Trait Extracted Successfully")
          });
      })
    }
    
  }

  
  const actionButtons = () => {
    
    return (
      <div class="btn-group">
      <div class="button-wrapper" onClick={() => {
        var myCanvas = document.getElementById('skeletoon_preview_canvas');
        myCanvas.width = 2000;
        myCanvas.height = 2000;
        var traitCanvas = document.getElementById('trait_preview_canvas');
        traitCanvas.width = 250;
        traitCanvas.height = 250;
        drawPreview()
        }}>
      <button><img src={button_default} alt="my image" /></button>
      <div class={"button_text"}>{"Preview"}</div>
      </div>
      <div class="button-wrapper" onClick={() => {
        sendTX()
        }}>
      <button><img src={button_default} alt="my image" /></button>
      <div class={"button_text"}>{"Extract Trait"}</div>
      </div> 
      <div>{messageStatus}</div> 
      </div> 
    )
}

const geneIndexertoArr = (index) => {
  if (index % 2 == 0) {return index/2} else { return ((index - 1)/2)+9}
}

const selectedGene = () => {
  let geneIndex = selectedGeneIndex;
  return (
    <>
    <img src={geneIcons[geneIndexertoArr(geneIndex)]}>      
    </img>
    <div class={"GeneText"}>
    {geneDisasaemblerMapped(prop.geneSeq, geneIndex * 3) + " " + strDissasermbler(prop.strSeq, geneIndex * 3) + "/100"}
    </div>
    {(parseInt(strDissasermbler(prop.strSeq, geneIndex * 3)) == 100 && prop.geneSeq.substring(geneIndex*3, (geneIndex*3 )+ 3) !== "000") ? <img class={"ValidityLong"} src={icon_yes}></img> :<img class={"ValidityLong"} src={icon_no}></img>}
    </>
  )
}


  const extractDisplay = () => {
    let geneIndex = selectedGeneIndex;
    return (
      <>
      <div className={"SelectedGene"} id={"GetTraitSelectedGene"}> {selectedGene()}</div>
      
      <div className={"UpgradeCanvasPreview"} id={"PreviewCanvasTrait"}>
        <div className={"TextHeaderDiv"}>Extracted Skeletoon preview:</div>
        <canvas id="skeletoon_preview_canvas" width="2000" height="2000"></canvas></div>
      <div className={"UpgradeCanvasPreview"} id={"TraitCanvas"}>
        <div className={"TextHeaderDiv"}>Extracted Trait preview:</div>
        <canvas id="trait_preview_canvas" width="2000" height="2000"></canvas></div>
      <div className={"ButtonsDisplay"} id={"ButtonsTrait"}>{actionButtons()}</div>
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

  const allDisplaySingle = (geneIndex) => {
    return (
      <div class={"GetSingleTrait"} >
      <img src={(geneIcons[geneIndexertoArr(geneIndex)])} onClick={() => {setselectedGeneIndex(((geneIndex))); setDisplaySettings("Single")}}>      
      </img>
      <div class={"GeneText"} onClick={() => {setselectedGeneIndex(((geneIndex))); setDisplaySettings("Single")}}>
      {geneDisasaemblerMapped(prop.geneSeq, geneIndex * 3) + " " + strDissasermbler(prop.strSeq, geneIndex * 3) + "/100"}
      </div>
      {(parseInt(strDissasermbler(prop.strSeq, geneIndex * 3)) == 100 && prop.geneSeq.substring(geneIndex*3, (geneIndex*3 )+ 3) !== "000")? <img class={"Validity"} src={icon_yes} onClick={() => {setselectedGeneIndex(((geneIndex))); setDisplaySettings("Single")}}></img> :<img class={"Validity"} src={icon_no} onClick={() => {setselectedGeneIndex(((geneIndex))); setDisplaySettings("Single")}}></img>}
      </div>
    )
  }

  const listAllItemsf = geneIcons.map((gene, index) => (
    <il class={"GeneRow"} id={"Gene" + listToGeneIndexer(index)} key={gene}>
      {allDisplaySingle(index)}
      <br></br>
    </il>
  ));

  const allDisplay = () => {
    
    return (
      <div className={"TraitList"} id={"TraitListGetTrait"}>
            <ul>{listAllItemsf}</ul>
      </div>
    )
  }

  const settings = () => {
      return (
        <div class="btn-group">
        <div class="button-wrapper" onClick={() => {setDisplaySettings("All")}}>
        <button><img src={button_default} alt="my image" /></button>
        <div class={"button_text"}>{"All"}</div>
        </div>
        <div class="button-wrapper" id={"SingleViewButton"} onClick={() => {setDisplaySettings("Single")}}>
        <button><img src={button_default} alt="my image" /></button>
        <div class={"button_text"} >{"Single"}</div>
        </div>  
        </div> 
      )
  
  }

  const actionDisplay = () => {
    if (displaySettings === "All") {
      return (
        allDisplay()
      )
    } else {
      return (
        extractDisplay()
      )
    }

  }

  const traitSelector = () => {
    return (
      <>
      <div id={"GeneTextHeader"}>{displaySettings === "Single" ? "Select Gene to extract:" : "Your Genome:"}</div>
      <div className={"GeneSelector"}>{renderTraits()}</div>      

      <div className={"ActionDisplay"} id={"GetTraitDisplay"}>
      {displaySettings !== null ? actionDisplay() : ""}
      </div>
      <div className={"DisplayManager"}>{settings()}</div>
      </>
    )
  }

  const listItems = geneIcons.map((gene, index) => (
    <il class={"GeneRow"} id={"Gene" + listToGeneIndexer(index)} key={gene}>
      <img src={gene} onClick={() => {setselectedGeneIndex(listToGeneIndexer(index)); setDisplaySettings("Single")}}></img>
      <br></br>
    </il>
  ));

  

  const renderTraits = () => {
    return (
        <ul>{listItems}</ul>
    );
  };

  useEffect(() => {
    let index = selectedGeneIndex
    if (prop.skeletoonTokenId >= 10000) {
      setMessageStatus("Only original 10 000 Skeletoons can extract traits")
    } else 
    if (prop.geneSeq.substring(index*3, (index*3 )+ 3) == "000") {
      setMessageStatus("Can't extract Non-existing trait")
    } else
    if (parseInt(strDissasermbler(prop.strSeq, index * 3)) < 100) {
      setMessageStatus("Gene needs strength of 100 to be extracted")
    } else  {
      setMessageStatus("Gene Extraction costs 100 Strength")
    }
  }, [selectedGeneIndex, prop.skeletoonTokenId, prop.geneSeq, prop.strSeq])
  return (
    <div>{traitSelector()}</div>
  )
}

export default GetTrait