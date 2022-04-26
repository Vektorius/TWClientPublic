import React, { useEffect, useState } from 'react'
import "../../styles/NFTcard.css";
import TraitMap from "../helpers/TraitMap.json"
import RewardsMap from "../helpers/RewardsMap.json";
import { aTWG, aTWMarket, aTWSP, aTWT, cTWG, cTWMarket, cTWSP, cTWT } from '../helpers/Groups';
import {
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
    icon_Mouth_D,
    icon_Mouth_M,
    icon_Pet_D,
    icon_Pet_M,
    traitInv
  } from "../../data/canvassrc";
import { drawSkeletoonFull } from '../helpers/Renderer';
import Web3 from "web3";

const NFTcard = (prop) => {
    const [renderImageType , setRenderImageType] = useState(null);
    const [renderPropertiesType ,setRenderPropertiesType] = useState(null)
    const [marketRender, setMarketRender] = useState(null);
    const [isApproved, setApproval] = useState(0);
    const [price, setPrice] = useState(null);
    const [seller, setSeller] = useState(null);
    const [salePrice, setSalePrice] = useState("0");

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
    let totalRewards = { TWB: 0, Traits: 0, Glyphs: [] };
    let TWBrewardMultis = [2, 1];

    const padder = (input) => {
        if (typeof input === "string"){let padded = input
        for (let i = 54 - padded.length; i >0 ; i--){
            padded = "0" + padded
        }
        return padded
    } else {
        return 
    }
    }

    const rewardMapper = (rewardGene, _str) => {
        let str = parseInt(_str);
        let RewardString = "";
        if (str != "000") {
        let tempValue = parseInt(str) * parseInt(rewardGene[1]) * TWBrewardMultis[0] * TWBrewardMultis[1];
        RewardString += tempValue + " $TWB ";
        totalRewards.TWB += tempValue;
        }
        if (rewardGene[0] == 4 || rewardGene[0] == 7) {
        totalRewards.Traits += str;
        if (str > 1) {
            RewardString += str + " Contest Entries";
        } 
        }
        if (rewardGene[0] == 6 || rewardGene[0] == 7) {
            if (Math.floor((str/10)* rewardGene[3]) > 1) {
                let tempString = " [Glyph: " + rewardGene[4] + " (STR: " +Math.floor((str/10)* rewardGene[3]) + ") ]";
                totalRewards.Glyphs.push(tempString.substring(1));
                RewardString += tempString;
              } 
        }
        return RewardString;
      };
    
      const geneDisasaemblerMapped = (sequence, index) => {
        let geneSingle = sequence.substring(index, index + 3);
        geneSingle = TraitMap[geneSingle]["1"][2];
        return geneSingle;
      };
    
      const strDissasermbler = (sequence, index) => {
        let strSingle = sequence.substring(index, index + 3);
        return strSingle;
      };
    
      const listToGeneIndexer = (index) => {
        if (index < 9) {
          return index * 2;
        } else {
          return (index - 9) * 2 + 1;
        }
      };
    
      
      
    
      const renderTraits = () => {
        const listItems = geneIcons.map((gene, index) => (
            <il class={"GeneRow"} id={"Gene" + listToGeneIndexer(index)} key={gene}>
              <img src={gene}></img>
              <div class={"GeneText"}>
                {geneDisasaemblerMapped(padder(prop.card.properties.gene), listToGeneIndexer(index) * 3) + " " + strDissasermbler(padder(prop.card.properties.str), listToGeneIndexer(index) * 3) + "/100"}
                <br></br>
                {rewardMapper(RewardsMap[padder(prop.card.properties.gene).substring(listToGeneIndexer(index) * 3, listToGeneIndexer(index) * 3 + 3)], strDissasermbler(padder(prop.card.properties.str), listToGeneIndexer(index) * 3))}
              </div>
              <br></br>
            </il>
          ));
        return (
          <div className={"TraitList"} id={"MarketTraitList"}>
            <ul>{listItems}</ul>
          </div>
        );
      };

      const renderTraitCard = () => {
          let traitType = prop.card.properties.type
          for (let i = 0; i < 3; i++){
              if (traitType.length < 3){
                traitType = "0"+traitType;
              }
          }
          return (
            <div className={"TraitList"} id={"GlyphList"}>
            {"Trait Name :" + TraitMap[traitType]["1"][2]}
            <br></br>
            <br></br>
            {"Applies To Major Gene : "}
            <br></br>
            <img src={geneIcons[(TraitMap[traitType]["1"][3])/2] }></img>
            </div>
          );
      }

      const renderGlyphCard = () => {
          let glyphApplies = prop.card.properties.applies
          let appliedPos = [false, false, false, false, false, false, false, false, false];
          let icons = geneIcons.slice(0,9)
          for (let i = 9; i>0 ; i--){
            if ((parseInt(glyphApplies) >> i)%2 ===1){
                appliedPos[9-i] = true
            } else {
                appliedPos[9-i] = false;
            }
          }
          const iconFiltered = icons.filter( item => appliedPos[icons.indexOf(item)]).map((gene, index) => (
            <il class={"GeneRow"} id={"Gene" + listToGeneIndexer(index)} key={gene}>
              <img src={gene}></img>
              <br></br>
            </il>
          ));
          return (
            <div className={"TraitList"} id={"GlyphList"}>
            {"Applies to trait types:"}
              <ul>{iconFiltered}</ul>
            {"Strength: " + prop.card.properties.str}
            </div>
          );
      }

    const displayImage = () => {
        if (prop.card.NFTtype === "Skeletoon"){
            return (
                <>
                <canvas id="market_canvas" width="2000" height="2000"></canvas>
                 {renderTraits()}
                </>
            )
        } else if (prop.card.NFTtype === "Trait") {
            return (
                <>
                <img id="market_img" src={(traitInv + "/"+prop.card.properties.type + ".png")}></img>
                {renderTraitCard()}
                </>
            )
        } else if (prop.card.NFTtype === "Glyph") {
            return (
                <>
                <img id="market_img" src={glyphInv + "/" + prop.card.properties.applies + ".png"}></img>
                {renderGlyphCard()}
                </>
            )
        } else {
            return (
                <></>
            )
        }
    }

    const listItem  = () => {
        let address;
        if (prop.card.NFTtype === "Glyph") {
            address = "2"
        }
        if (prop.card.NFTtype === "Trait") {
            address = "1"
        }
        if (prop.card.NFTtype === "Skeletoon") {
          address = "0"
        }
        if (salePrice !== "0")
        {let txData = cTWMarket.methods.createMarketItem(address, prop.card.tokenID, salePrice).encodeABI();
        web3.eth.sendTransaction(
          {
            from: prop.address,
            to: aTWMarket,
            value: "0",
            data: txData,
          }).on('receipt', function(receipt) {
  
          });}
      }

    const approveForSale  = () => {
        let address;
        let contract;
        if (prop.card.NFTtype === "Glyph") {
            address = aTWG
            contract = cTWG
        }
        if (prop.card.NFTtype === "Trait") {
            address = aTWT
            contract = cTWT
        }
        if (prop.card.NFTtype === "Skeletoon") {
          address = aTWSP
          contract = cTWSP
        }
        let txData = contract.methods.approve(aTWMarket, prop.card.tokenID).encodeABI();
        web3.eth.sendTransaction(
          {
            from: prop.address,
            to: address,
            data: txData,
          }).on('receipt', function(receipt) {
            setApproval(1)
          });
      }

    const buyListing  = () => {
        let address;
        if (prop.card.NFTtype === "Glyph") {
            address = aTWG
        }
        if (prop.card.NFTtype === "Trait") {
            address = aTWT
        }
        if (prop.card.NFTtype === "Skeletoon") {
          address = aTWSP
        }
        let txData = cTWMarket.methods.createMarketSale(address, prop.card.marketID).encodeABI();
        web3.eth.sendTransaction(
          {
            from: prop.address,
            to: aTWMarket,
            value: price,
            data: txData,
          }).on('receipt', function(receipt) {
  
          });
      }

    const cancelListing = () => {
      let address;
      if (prop.card.NFTtype === "Glyph") {
          address = aTWG
      }
      if (prop.card.NFTtype === "Trait") {
          address = aTWT
      }
      if (prop.card.NFTtype === "Skeletoon") {
        address = aTWSP
      }
      let txData = cTWMarket.methods.cancelMarketSale(address, prop.card.marketID).encodeABI();
      web3.eth.sendTransaction(
        {
          from: prop.address,
          to: aTWMarket,
          data: txData,
        }).on('receipt', function(receipt) {

        });
    }

    const displayMarket = () => {
        if (marketRender === "Buy" && price !==null) {
            return (
                <>
                <div className={"ItemPrice"}>{"Price:" + web3.utils.fromWei(price, 'ether') + "FTM"}</div>
                <div id={"ItemSeller"}>{"Seller: " + seller}</div>
                <button class={"FilterBtn"} id={"MarketBtn"} onClick={() => {
                    buyListing()
                }}>
                {"Buy"}
                </button>
                </>
            )
        }
        if (marketRender === "List") {
            return (
                <>
                <input class={"StrengthInput"} id={"PriceInput"} type="number" placeholder={"Price: 0.00 FTM"} onChange={e => {  setSalePrice(web3.utils.toWei(e.target.value))
                  }}/>
                {isApproved === 1 && salePrice !== "0"? 
                <button class={"FilterBtn"} id={"MarketBtn"} onClick={() => {
                    listItem()
                }}>
                {"List on market"}
                </button>
                :
                <></>
                }
                {isApproved === 0 ?
                  <button class={"FilterBtn"} id={"MarketBtn"} onClick={() => {
                      approveForSale()
                  }}>
                  {"Approve for sale"}
                  </button>
                  :<></>
                }
                </>
            )
        }
        if (marketRender === "Cancel" && price !==null) {
            return (
                <>
                <div className={"ItemPrice"}>
                {"Price:" + web3.utils.fromWei(price, 'ether') + "FTM"}</div>
                <div id={"ItemSeller"}>{"Seller: " + seller}<br></br>{"(You)"}</div>
                <button class={"FilterBtn"} id={"MarketBtn"} onClick={() => {
                    cancelListing()
                }}>
                {"Cancel Listing"}
                </button>
                </>
            )
        } else {
            return (<>
            </>)
        }
    }
    
    


  useEffect(() => {
      setRenderImageType(prop.card.NFTtype)
      let contract
      if (prop.card.NFTtype === "Skeletoon")
      { 

          let padGene = padder(prop.card.properties.gene)
          let padStr = padder(prop.card.properties.str)
          drawSkeletoonFull(padGene, padStr, 'market_canvas', 0, 1, 500)
          contract = cTWSP
      }
        if (prop.card.NFTtype === "Glyph") {
            contract = cTWG
        }
        if (prop.card.NFTtype === "Trait") {
            contract = cTWT
        }
        contract.methods.getApproved(prop.card.tokenID).call((err,result) => {
            if (result === aTWMarket){
                setApproval(1)
            } else {
                setApproval(0)
            }
        })
  }, [prop.card.NFTtype]) 


  useEffect(() => {
    if (prop.card.marketID !== null) {
        cTWMarket.methods.fetchSingle(prop.card.marketID).call(async (err,result) => { 
            if (!err){
                if (result[3].toLowerCase() === prop.address){
                    setMarketRender("Cancel")
                    setPrice(result[5])
                    setSeller(result[3])
                } else {
                    setMarketRender("Buy")
                    setPrice(result[5])
                    setSeller(result[3])
                }       
            }
        })
    } else {
        setMarketRender("List")
    }
  },[prop.card.marketID])
    
  return (
    <div id={"cardDisplay"}>
        {displayImage()}
        {displayMarket()}
    </div>
  )
}

export default NFTcard