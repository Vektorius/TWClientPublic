import React from 'react'
import { useEffect, useState } from "react";
import "../../styles/Market.css";
import TraitMap from "../helpers/TraitMap.json"
import { aTWG, aTWMarket, aTWSP, aTWT, cTWG, cTWMarket, cTWSP, cTWT } from '../helpers/Groups';
import { fetchMetadata } from '../../scripts/Helper';
import {
    gen1Placeholder,
    gen2Placeholder,
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
import NFTcard from './NFTcard';
import Web3 from "web3";

const Market = (prop) => {
    const [selectedDisplay, setSelectedDisplay] = useState("Market")
    const [selectedAddress, setSelectedAddress] = useState("Skeletoons")
    const [filter, setFilter] = useState({base: null, skeletoon: {
        0 : {genes: null, strength:null},
        1 : {genes: null, strength:null},
        2 : {genes: null, strength:null},
        3 : {genes: null, strength:null},
        4 : {genes: null, strength:null},
        5 : {genes: null, strength:null},
        6 : {genes: null, strength:null},
        7 : {genes: null, strength:null},
        8 : {genes: null, strength:null},
        9 : {genes: null, strength:null},
        10 : {genes: null, strength:null},
        11 : {genes: null, strength:null},
        12 : {genes: null, strength:null},
        13 : {genes: null, strength:null},
        14 : {genes: null, strength:null},
        15 : {genes: null, strength:null},
        16 : {genes: null, strength:null},
        17 : {genes: null, strength:null}
    }, trait: {type:null, applies:null}, glyph:{strength:null, applies:null}})
    const [constructor, setConstructor] = useState("default");
    const [page, setPage] = useState(0);
    const [cardOpen, setCardOpen] = useState(0);
    const [cardItem, setCardItem] = useState({NFTtype: null, tokenID: null, properties: [], marketID: null});
    const [marketItems, setMarketItems] = useState({skeletoons: [], traits: [], glyphs: []});
    const [inventory, setInventory] = useState({skeletoons: [], traits: [], glyphs: []})
    const [listings, setListings] = useState({skeletoons: [], traits: [], glyphs: []})
    const [filtered, setFiltered] = useState({skeletoons: [], traits: [], glyphs: []})
    const [filterBool, setFilterBool] = useState(0);


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

      let geneIconsTrait = [
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
      //TEMP
      const contract = cTWSP;
      const TWT = cTWT;
      const TWG = cTWG;
      const cMarket = cTWMarket;
      const aMarket = aTWMarket;

      const web3 = new Web3(Web3.givenProvider);

      const fetchInventoryGlyph = (inventoryLoadOld) => {
        TWG.methods.walletOfOwner(prop.address).call(async (err,result) => {
            if (!err){
                TWG.methods.getGlyphPropertiesBatch(result).call( async (err,result) => {
                    let invTemp = inventoryLoadOld
                    for (let i = 0; i < result.length; i= i+3){
                        let temp = {id: result[i], strength: result[i+1], appliesTo:result[i+2]}
                        invTemp.glyphs = [...invTemp.glyphs, temp];
                    } 
                    setInventory(invTemp);
                })
            }
        })  
      }

      const fetchInventoryTrait = (inventoryLoadOld) => {
        TWT.methods.walletOfOwner(prop.address).call(async (err,result) => {
            if (!err){
                TWT.methods.getTraitPropertiesBatch(result).call( async (err,result) => {
                    let invTemp = inventoryLoadOld
                    for (let i = 0; i < result.length; i= i+2){
                        let temp = {id: result[i], typeId: result[i+1]}
                        invTemp.traits = [...invTemp.traits, temp];
                    } 
                    setInventory(invTemp);
                    fetchInventoryGlyph(invTemp)
                })
            }
        })
      }

      const fetchInventory = () => {
          let inventoryLoad = {skeletoons: [], traits: [], glyphs: []}
          contract.methods.walletOfOwner(prop.address).call( async (err,result) => {
              if (!err){
                  contract.methods.getSkeletoonPropertiesBatch(result).call( async (err,result) => {
                      for (let i = 0; i < result.length; i= i+3){
                          let temp = {id: result[i], gene: result[i+1], str: result[i+2]}
                          inventoryLoad.skeletoons = [...inventoryLoad.skeletoons, temp];
                      }
                    setInventory(inventoryLoad);
                    fetchInventoryTrait(inventoryLoad)
                  })
              }
          })
      }

      const fetchListedGlyph = (marketLeft, marketOld) => {
        let glyphIds = marketLeft.filter(item => ((item[1] === aTWG)&& (item[6] === "0"))).map(item => item[2])
        let glyphsMarketID = marketLeft.filter(item => ((item[1] === aTWG)&& (item[6] === "0") )).map(item => item[0])
        let glyphsPrice = marketLeft.filter(item => ((item[1] === aTWG) && (item[6] === "0") )).map(item => item[5])
                TWG.methods.getGlyphPropertiesBatch(glyphIds).call( async (err,result) => {
                    if (!err){
                    let market = marketOld
                    for (let i = 0; i < result.length; i= i+3){
                        let temp = {id: result[i], strength: result[i+1], appliesTo:result[i+2], marketId:glyphsMarketID[i], price: glyphsPrice[i] }
                        market.glyphs = [...market.glyphs, temp];
                    } 
                    setMarketItems(market)
                }
                })
      }

      const fetchListedTrait = (marketLeft, marketOld) => {
        let traitIds = marketLeft.filter(item => ((item[1] === aTWT)&& (item[6] === "0"))).map(item => item[2])
        let traitsMarketID = marketLeft.filter(item => ((item[1] === aTWT)&& (item[6] === "0") )).map(item => item[0])
        let traitsPrice = marketLeft.filter(item => ((item[1] === aTWSP) && (item[6] === "0") )).map(item => item[5])
                TWT.methods.getTraitPropertiesBatch(traitIds).call( async (err,result) => {
                    if (!err){
                    let market = marketOld
                    for (let i = 0; i < result.length; i= i+2){
                        let temp = {id: result[i], typeId: result[i+1], marketId: traitsMarketID[i], price: traitsPrice[i]}
                        market.traits = [...market.traits, temp];
                    } 
                    setMarketItems(market)
                    fetchListedGlyph(marketLeft, market)
                }
                })
      }

      const fetchListed = () => {
          let market = {skeletoons: [], traits: [], glyphs: []}
          cMarket.methods.fetchMarketItems().call(async (err,result) => {
              if (!err){
                
                let marketItems = result
                //---------------------------------------------------------- && (item[6] === "0")
                let skeletoonsMarket = marketItems.filter(item => ((item[1] === aTWSP) && (item[6] === "0"))).map(item => item[2])
                let skeletoonsMarketID = marketItems.filter(item => ((item[1] === aTWSP) && (item[6] === "0") )).map(item => item[0])
                let skeletoonsPrice = marketItems.filter(item => ((item[1] === aTWSP) && (item[6] === "0") )).map(item => item[5])
                             
                contract.methods.getSkeletoonPropertiesBatch(skeletoonsMarket).call( async (err,result) => {
                    for (let i = 0; i < result.length; i= i+3){
                        let temp = {id: result[i], gene: result[i+1], str: result[i+2], marketId: skeletoonsMarketID[i], price:skeletoonsPrice[i]}
                        market.skeletoons = [...market.skeletoons, temp];
                    }
                  setMarketItems(market)
                  fetchListedTrait(marketItems, market)
                })
              }
          })
      }

      const fetchListingsGlyph = (marketLeft, marketOld) => {
        let glyphIds = marketLeft.filter(item => ((item[1] === aTWG)&& (item[6] === "0") &&(item[3].toLowerCase() === prop.address))).map(item => item[2])
        let glyphsMarketID = marketLeft.filter(item => ((item[1] === aTWG)&& (item[6] === "0") &&(item[3].toLowerCase() === prop.address))).map(item => item[0])
        let glyphsPrice = marketLeft.filter(item => ((item[1] === aTWG) && (item[6] === "0") && (item[3].toLowerCase() === prop.address))).map(item => item[5])
        TWG.methods.getGlyphPropertiesBatch(glyphIds).call( async (err,result) => {
            if (!err){
            let market = marketOld
            for (let i = 0; i < result.length; i= i+3){
                let temp = {id: result[i], strength: result[i+1], appliesTo:result[i+2], marketId:glyphsMarketID[i], price: glyphsPrice[i]}
                market.glyphs = [...market.glyphs, temp];
            } 
            setListings(market)
        }
        })
        }

        const fetchListingsTrait = (marketLeft, marketOld)  => {
            let traitIds = marketLeft.filter(item => ((item[1] === aTWT)&& (item[6] === "0") &&(item[3].toLowerCase() === prop.address))).map(item => item[0])
            let traitsMarketID = marketLeft.filter(item => ((item[1] === aTWT)&& (item[6] === "0") &&(item[3].toLowerCase() === prop.address))).map(item => item[2])
            let traitsPrice = marketLeft.filter(item => ((item[1] === aTWT) && (item[6] === "0") && (item[3].toLowerCase() === prop.address))).map(item => item[5])
                TWT.methods.getTraitPropertiesBatch(traitIds).call( async (err,result) => {
                    if (!err){
                    let market = marketOld
                    for (let i = 0; i < result.length; i= i+2){
                        let temp = {id: result[i], typeId: result[i+1], marketId: traitsMarketID[i], price:traitsPrice[i]}
                        market.traits = [...market.traits, temp];
                    } 
                    setListings(market)
                    fetchListingsGlyph(marketLeft, market)
                }
                })
        }

        const fetchListings = () => {
        let market = {skeletoons: [], traits: [], glyphs: []}
        cMarket.methods.fetchMarketItems().call(async (err,result) => {
            if (!err){
                
                let marketItems = result
                //---------------------------------------------------------- && (item[6] === "0")
                let skeletoonsMarket = marketItems.filter(item => ((item[1] === aTWSP) && (item[6] === "0") && (item[3].toLowerCase() === prop.address))).map(item => item[2])
                let skeletoonsMarketID = marketItems.filter(item => ((item[1] === aTWSP) && (item[6] === "0") && (item[3].toLowerCase() === prop.address))).map(item => item[0])
                let skeletoonsPrice = marketItems.filter(item => ((item[1] === aTWSP) && (item[6] === "0") && (item[3].toLowerCase() === prop.address))).map(item => item[5])


               
                contract.methods.getSkeletoonPropertiesBatch(skeletoonsMarket).call( async (err,result) => {
                    for (let i = 0; i < result.length; i= i+3){
                        let temp = {id: result[i], gene: result[i+1], str: result[i+2], marketId: skeletoonsMarketID[i], price:skeletoonsPrice[i]}
                        market.skeletoons = [...market.skeletoons, temp];
                    }
                setListings(market)
                fetchListingsTrait(marketItems, market)
                })
            }
        })
        }

        const padder = (input) => {
            if (typeof input === "string")
            {let padded = input
                for (let i = 54 - padded.length; i >0 ; i--){
                    padded = "0" + padded
                }
                return padded
            } else {
                return 
            }
        }


        function skeletoonFilterer(skele){
            let passFail = 0;
            for (let i = 0; i <18; i++){
                let tempFilterGene = (filter.skeletoon[i].genes)
                let tempFilterStr = (filter.skeletoon[i].strength)
                let tempGene = parseInt(padder(skele.gene).substring(i*3,(i*3)+3))
                let tempStr = parseInt(padder(skele.str).substring(i*3,(i*3)+3))

                if (tempFilterGene === null) {
                    passFail++;
                } else 
                {
                    tempFilterGene = parseInt(tempFilterGene)
                    if (tempGene === tempFilterGene) {
                    passFail++;
                }}
                if (tempFilterStr === null) {
                    passFail++;
                } else 
                {
                    tempFilterStr = parseInt(tempFilterStr)
                    if (tempStr >= tempFilterStr) {
                    passFail++;
                }}
            }

            return (passFail === 36)              
          }
        
          const filterSkeletoonsDisplay = () => {
            let itemTemp= {skeletoons: [], traits: [], glyphs: []};
            let marketCopy = marketItems
            let invCopy = inventory
            let listedCopy = listings
            if (selectedDisplay === "Market"){
                itemTemp = marketCopy
            }
            if (selectedDisplay === "Inventory"){
                itemTemp = invCopy
            }
            if (selectedDisplay === "Listings"){
                itemTemp = listedCopy
            }
            //FIX img src

            let itemsFiltered = {skeletoons: [], traits: [], glyphs: []}
            itemsFiltered.skeletoons = itemTemp.skeletoons.filter(skeletoon => skeletoonFilterer(skeletoon))
            //itemTemp.skeletoons = itemsFiltered.skeletoons

            if (selectedDisplay === "Market"){
                itemsFiltered.traits = marketCopy.traits
                itemsFiltered.glyphs = marketCopy.glyphs
            }
            if (selectedDisplay === "Inventory"){
                itemsFiltered.traits = invCopy.traits
                itemsFiltered.glyphs = invCopy.glyphs
            }
            if (selectedDisplay === "Listings"){
                itemsFiltered.traits = listedCopy.traits
                itemsFiltered.glyphs = listedCopy.glyphs
            }
            setFiltered(itemsFiltered)
        }

        //TEMP
    const selectDisplay = () => {
        if (prop.address !== null) {
            return (
                <div id={"SelectDisplayBtnGroup"}>
                    <button class={"MarketBtn"} id={"MarketListings"}onClick={() => {
                    setSelectedDisplay("Market")
                    }}>{"Market"}
                    </button>
                    <button class={"MarketBtn"} id={"MyInventory"} onClick={() => {
                    setSelectedDisplay("Inventory")
                    }}>{"My Inventory"}
                    </button>
                    <button class={"MarketBtn"} id={"MyListings"} onClick={() => {
                    setSelectedDisplay("Listings")
                    }}>{"My Listings"}
                    </button>
                </div>
            ) 
        } else {
            return (
                <div id={"SelectDisplayBtnGroup"}>
                    <button class={"MarketBtn"} id={"MarketListings"}onClick={() => {
                    setSelectedDisplay("Market")
                    }}>{"Market"}
                    </button>
                </div>
            ) 
        }
        
    }

    const selectAddress = () => {
        return (
            <div id={"SelectAddressBtnGroup"}>
                <button class={"MarketBtn"} id={"Skeletoons"} onClick={() => {
                setSelectedAddress("Skeletoons")
                }}>{"Skeletoons"}
                </button>
                <button class={"MarketBtn"} id={"Traits"} onClick={() => {
                setSelectedAddress("Traits")
                }}>{"Traits"}
                </button>
                <button class={"MarketBtn"} id={"Glyphs"} onClick={() => {
                setSelectedAddress("Glyphs")
                }}>{"Glyphs"}
                </button>
            </div>
        )
    }

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => TraitMap[key]["1"][2].toLowerCase().includes(value));
    }

    const skeleFilterInput = (geneValue,strValue, position) => {
        let filterFlag = false;
        let filtertemp = filter
        let positionfiltered
        if (position > 8){
            positionfiltered = parseInt(((position - 9)*2)+1)
        }
        if (position <=8) {
            positionfiltered = parseInt(position*2)
        }
        // jei null pakeist str i 0, jei 100+ pakeist i 100
        if (strValue !== null & strValue <= 100 && strValue >= 0) {
            filtertemp.skeletoon[positionfiltered].strength = strValue
            filterFlag = true;
            if (strValue === ""){
                filtertemp.skeletoon[positionfiltered].strength = null; 
            }
        }
        if (geneValue !== null){
            filtertemp.skeletoon[positionfiltered].genes = getKeyByValue(TraitMap, geneValue.toLowerCase())
            if (geneValue === "") {
                filterFlag = true;
                filtertemp.skeletoon[positionfiltered].genes = null; 
            }
        }
        setFilter(filtertemp)
        setFilterBool(1)
        filterSkeletoonsDisplay()
        
    }

    const listItems = geneIcons.map((gene, index) => (
        <il class={"GeneRow"} id={"Gene" + (index)} key={gene}>
          <img src={gene}></img>
          <input class={"TraitInput"} type="text" placeholder={"Trait name"} onChange={e => {skeleFilterInput(e.target.value, null, index)}}/>
          <input class={"StrengthInput"} type="number" placeholder={"Strength"} onChange={e => {skeleFilterInput(null ,e.target.value , index)}}/>
          <br></br>
          <br></br>
        </il>
      ));
    

    const skeletoonFilter = () => {
        // list 18 - input search + volume for str
        
        return (
          <div className={"TraitFilter"}>
            {"Search Skeletoon by trait values"}
            <ul>{listItems}</ul>
          </div>
        )
    }

    function traitFilterer(trait){
        return (parseInt(trait.typeId) === parseInt(filter.trait.type))              
      }
    
      const filterTraitsDisplay = () => {
        let itemTemp= {skeletoons: [], traits: [], glyphs: []};
        let marketCopy = marketItems
        let invCopy = inventory
        let listedCopy = listings
        if (selectedDisplay === "Market"){
            itemTemp = marketCopy
        }
        if (selectedDisplay === "Inventory"){
            itemTemp = invCopy
        }
        if (selectedDisplay === "Listings"){
            itemTemp = listedCopy
        }
        //FIX img src
        let itemsFiltered = {skeletoons: [], traits: [], glyphs: []}
        itemsFiltered.traits = itemTemp.traits.filter(trait => traitFilterer(trait))
        //itemTemp.skeletoons = itemsFiltered.skeletoons
        if (selectedDisplay === "Market"){
            itemsFiltered.skeletoons = marketCopy.skeletoons
            itemsFiltered.glyphs = marketCopy.glyphs
        }
        if (selectedDisplay === "Inventory"){
            itemsFiltered.skeletoons = invCopy.skeletoons
            itemsFiltered.glyphs = invCopy.glyphs
        }
        if (selectedDisplay === "Listings"){
            itemsFiltered.skeletoons = listedCopy.skeletoons
            itemsFiltered.glyphs = listedCopy.glyphs
        }
        setFiltered(itemsFiltered)
    }



    const traitFilterInput = (type) => {
        let filterFlag = false;
        let filtertemp = filter
        // jei null pakeist str i 0, jei 100+ pakeist i 100
        if (type !== null) {
            filtertemp.trait.type = getKeyByValue(TraitMap, type.toLowerCase())
            if (type === "") {
                filterFlag = true;
                filtertemp.trait.type = null; 
            }
        }
        setFilter(filtertemp)
        setFilterBool(1)
        filterTraitsDisplay()

    }

    /* Corner Cut  traitFilter
                <br></br>
                <br></br>
                <input class={"TraitInput"} type="text" placeholder={"Trait Type"} onChange={e => {traitFilterInput(null, e.target.value)}}/>
    
    */


    const traitFilter = () => {
        // input type checkbox applies to search bar
        return (
            <div className={"TraitFilter"}>
                {"Search Trait by type or applied position"}
                <br>
                </br>
                <input class={"TraitInput"} type="text" placeholder={"Trait name"} onChange={e => {traitFilterInput(e.target.value)}}/>
            </div>
        )
    }

    function getKeyByValueGlyph (value) {
        let obj = {_512: "background", _256: "pet", _128: "body", _64:"mouth", _32: "head", _16: "eyes", _8: "hat" , _4:"item", _2 : "cape"}
        return Object.keys(obj).find(key => obj[key].includes(value));
    }

    function glyphFilterer(glyph){
        let filterPass = 0;
        if (filter.glyph.strength === null){
            filterPass++
        } else {
            if (parseInt(filter.glyph.strength) <= parseInt(glyph.strength)){
                filterPass++
            }
        }
        if (filter.glyph.applies === null){
            filterPass++
        } else {
            if ( (parseInt(Math.floor(glyph.appliesTo/filter.glyph.applies)%2) ) === 1 ) {
                filterPass++
            }

        }
        return (filterPass === 2)              
      }
    
      const filterGlyphsDisplay = () => {
        let itemTemp= {skeletoons: [], traits: [], glyphs: []};
        let marketCopy = marketItems
        let invCopy = inventory
        let listedCopy = listings
        if (selectedDisplay === "Market"){
            itemTemp = marketCopy
        }
        if (selectedDisplay === "Inventory"){
            itemTemp = invCopy
        }
        if (selectedDisplay === "Listings"){
            itemTemp = listedCopy
        }
        let itemsFiltered = {skeletoons: [], traits: [], glyphs: []}
        itemsFiltered.glyphs = itemTemp.glyphs.filter(glyph => glyphFilterer(glyph))
        if (selectedDisplay === "Market"){
            itemsFiltered.skeletoons = marketCopy.skeletoons
            itemsFiltered.traits = marketCopy.traits
        }
        if (selectedDisplay === "Inventory"){
            itemsFiltered.skeletoons = invCopy.skeletoons
            itemsFiltered.traits = invCopy.traits
        }
        if (selectedDisplay === "Listings"){
            itemsFiltered.skeletoons = listedCopy.skeletoons
            itemsFiltered.traits = listedCopy.traits
        }
        setFiltered(itemsFiltered)
    }

    const glyphFilterInput = (str, appliesTo) => {
        let filterFlag = false;
        let filtertemp = filter
        // jei null pakeist str i 0, jei 100+ pakeist i 100
        if (str !== null) {
            filtertemp.glyph.strength = str
            if (str === "") {
                filterFlag = true;
                filtertemp.glyph.strength = null; 
            }
        }
        if (appliesTo !== null) {
            let tempHelper = getKeyByValueGlyph(appliesTo.toLowerCase())
            if (typeof tempHelper === "string" && tempHelper.length >1)
            {
                filtertemp.glyph.applies = tempHelper.substring(1)
            }
            if (appliesTo === "") {
                filterFlag = true;
                filtertemp.glyph.applies = null; 
            }
        }
        setFilter(filtertemp)
        setFilterBool(1)
        filterGlyphsDisplay()
    }

    const glyphFilter = () => {
        return (
            <div className={"TraitFilter"}>
                {"Search Glyph by strength or applied position"}
                <br>
                </br>
                <input class={"TraitInput"} type="number" placeholder={"Glyph Strength min."} onChange={e => {glyphFilterInput(e.target.value, null)}}/>
                <br></br>
                <br></br>
                <input class={"TraitInput"} type="text" placeholder={"Glyph Applied position"} onChange={e => {glyphFilterInput(null, e.target.value)}}/>
            </div>
        )
    }

    const clearFilter = () => {
        setFilter({base: null, skeletoon: {
            0 : {genes: null, strength:null},
            1 : {genes: null, strength:null},
            2 : {genes: null, strength:null},
            3 : {genes: null, strength:null},
            4 : {genes: null, strength:null},
            5 : {genes: null, strength:null},
            6 : {genes: null, strength:null},
            7 : {genes: null, strength:null},
            8 : {genes: null, strength:null},
            9 : {genes: null, strength:null},
            10 : {genes: null, strength:null},
            11 : {genes: null, strength:null},
            12 : {genes: null, strength:null},
            13 : {genes: null, strength:null},
            14 : {genes: null, strength:null},
            15 : {genes: null, strength:null},
            16 : {genes: null, strength:null},
            17 : {genes: null, strength:null}
        }, trait: {type:null, applies:null}, glyph:{strength:null, applies:null}})
        setFilterBool(0);
        filterSkeletoonsDisplay()
    }

    /*
            <button class={"FilterBtn"} id={"LowPrice"} onClick={() => {
                
                filtertemp.base = "MinPrice"
                setFilter(filtertemp)
                }}>
        {"Price - Low"}
        </button>
        <button class={"FilterBtn"} id={"HighPrice"} onClick={() => {
                filtertemp.base = "MaxPrice"
                setFilter(filtertemp)
                }}>
        {"Price - High"}
        </button>
        <br></br>
        <br></br>
        <br></br>
    */

    const baseFilter = () => {
        let filtertemp = filter
        return (
        <>

        <button class={"FilterBtn"} id={"Clear"} onClick={() => {
                clearFilter()
                }}>
        {"Clear Filters"}
        </button>
        </>
        )
    }

    const selectFilter = () => {
        return (
            <div id={"Filters"}>
                {baseFilter()}
                {(selectedAddress == "All" || selectedAddress == "Skeletoons")? skeletoonFilter() : ""}
                {(selectedAddress == "All" || selectedAddress == "Traits")? traitFilter() : ""}
                {(selectedAddress == "All" || selectedAddress == "Glyphs")? glyphFilter() : ""}            
            </div>
        )
    }

    const openCard = (NFType, tokenId, index, marketId) => {
        let displayArr
        if (filterBool == 1){
            displayArr = filtered
        } else {
            if (selectedDisplay === "Listings")
            {
                displayArr = listings
            } else if (selectedDisplay === "Inventory") {
                displayArr = inventory
            } else if (selectedDisplay === "Market") {
                displayArr = marketItems
            }
        }
        setCardOpen(1);
        let card = {NFTtype: null, tokenID: null, properties: []}
        card.NFTtype = NFType
        card.tokenID = tokenId
        card.marketID = marketId
        if (NFType === "Skeletoon"){
            let properties ={gene: null, str:null}
            properties.gene = displayArr.skeletoons[(index  + (14*page))].gene
            properties.str = displayArr.skeletoons[(index  + (14*page))].str
            card.properties = properties
        }
        if (NFType === "Trait"){
            let properties ={type: null}
            properties.type = displayArr.traits[(index  + (14*page))].typeId
            card.properties = properties
        }
        if (NFType === "Glyph"){
            let properties ={applies: null ,str: null}
            properties.applies = displayArr.glyphs[(index  + (14*page))].appliesTo
            properties.str = displayArr.glyphs[(index  + (14*page))].strength
            card.properties = properties
        }
        setCardItem(card);

    }

    const createCard = () => {
        return (
            <div id="CardOverlay">
                <button class= {"MarketBtn"} id={"closeCard"} onClick={() => {
                    setCardOpen(0);
                }}>{"X"}</button>
                <NFTcard card={cardItem} address={prop.address} chain={prop.chain}></NFTcard>
            </div>
        )
    }

    const cardsDisplay = () => {
        let pagedNFT 
        let length
        let displayArr
        if (filterBool == 1){
            displayArr = filtered
        } else {
            displayArr = marketItems
        }
        if (selectedAddress === "Skeletoons")
        {pagedNFT =  displayArr.skeletoons.slice(page*14, (page*14)+14)
            var renderedOutput = pagedNFT.map((item, index) => <div className={"card"} onClick={() => {openCard("Skeletoon", item.id, index, item.marketId)}}>
            <img src={parseInt(item.id) <= 10000 ? gen1Placeholder : gen2Placeholder }></img>
             {"Token Id: " + item.id}
             <br></br> 
             {item.price !== null  && item.price !== undefined ? "Price: " + web3.utils.fromWei(item.price) + " FTM" : "Error Requesting price"}
             </div>)
             length = displayArr.skeletoons.length
        }
        if (selectedAddress === "Traits")
        {pagedNFT =  displayArr.traits.slice(page*14, (page*14)+14)
            var renderedOutput = pagedNFT.map((item, index )=> <div className={"card"} onClick={() => {openCard("Trait", item.id, index, item.marketId)}}>
            <img src={(traitInv + "/"+item.typeId + ".png")}></img>
             {"Token Id: " + item.id}
             <br></br> 
             {item.price !== null  && item.price !== undefined ? "Price: " + web3.utils.fromWei(item.price) + " FTM" : "Error Requesting price"}
             </div>)
             length = displayArr.traits.length
        }
        if (selectedAddress === "Glyphs")
        {pagedNFT =  displayArr.glyphs.slice(page*14, (page*14)+14)
            var renderedOutput = pagedNFT.map((item, index) => <div className={"card"} onClick={() => {openCard("Glyph", item.id, index, item.marketId)}}>
            <img src={glyphInv + "/" + item.appliesTo + ".png"}></img>
             {"Token Id: " + item.id}
             <br></br> 
             {item.price !== null  && item.price !== undefined ? "Price: " + web3.utils.fromWei(item.price) + " FTM" : "Error Requesting price"}
             </div>)
             length = displayArr.glyphs.length
        }

        //add cost into card bellow name
        
        return (
            <div id={"CardsDisplay"}>
                <div id={"PageNav"}>
                    <button id={"PrevPage"} onClick={() => {
                if (page > 0)
                {setPage(page-1)}
                }}>{"<"}</button>
                    {"  " + ((page*15)) + "..." + ((page*15)+14) + "  "}
                    <button id={"NextPage"} onClick={() => {
                if (page*15 < length)
                setPage(page+1)
                }}>{">"}</button>
                </div>
                {renderedOutput}
            </div>
        )
    }

    const cardsInventory = () => {
        let pagedNFT 
        let length
        let displayArr
        if (filterBool == 1){
            displayArr = filtered
        } else {
            displayArr = inventory
        }
        if (selectedAddress === "Skeletoons")
        {pagedNFT =  displayArr.skeletoons.slice(page*14, (page*14)+14)
            var renderedOutput = pagedNFT.map((item, index) => <div className={"card"} onClick={() => {openCard("Skeletoon", item.id, index, null)}}>
            <img src={parseInt(item.id) <= 10000 ? gen1Placeholder : gen2Placeholder }></img>
            {"Token Id: " + item.id}
             </div>)
             length = displayArr.skeletoons.length
        }
        if (selectedAddress === "Traits")
        {pagedNFT =  displayArr.traits.slice(page*14, (page*14)+14)
            var renderedOutput = pagedNFT.map((item, index )=> <div className={"card"} onClick={() => {openCard("Trait", item.id, index, null)}}>
            <img src={(traitInv + "/"+item.typeId + ".png")}></img>
            {"Token Id: " + item.id} 
             </div>)
             length = displayArr.traits.length
        }
        if (selectedAddress === "Glyphs")
        {pagedNFT =  displayArr.glyphs.slice(page*14, (page*14)+14)
            var renderedOutput = pagedNFT.map((item, index) => <div className={"card"} onClick={() => {openCard("Glyph", item.id, index, null)}}>
            <img src={glyphInv + "/" + item.appliesTo + ".png"}></img>
            {"Token Id: " + item.id}
             </div>)
             length = displayArr.glyphs.length
        }

        //add cost into card bellow name
        
        return (
            <div id={"CardsDisplay"}>
                <div id={"PageNav"}>
                    <button id={"PrevPage"} onClick={() => {
                if (page > 0)
                {setPage(page-1)}
                }}>{"<"}</button>
                    {"  " + ((page*15)) + "..." + ((page*15)+14) + "  "}
                    <button id={"NextPage"} onClick={() => {
                if (page*15 < length)
                setPage(page+1)
                }}>{">"}</button>
                </div>
                {renderedOutput}
            </div>
        )
    }

    const cardsListings = () => {
        let pagedNFT 
        let length
        let displayArr
        if (filterBool == 1){
            displayArr = filtered
        } else {
            displayArr = listings
        }
        if (selectedAddress === "Skeletoons")
        {pagedNFT =  displayArr.skeletoons.slice(page*14, (page*14)+14)
            var renderedOutput = pagedNFT.map((item, index) => <div className={"card"} onClick={() => {openCard("Skeletoon", item.id, index, item.marketId)}}>
            <img src={parseInt(item.id) <= 10000 ? gen1Placeholder : gen2Placeholder }></img>
            {"Token Id: " + item.id}
             <br></br> 
             {item.price !== null  && item.price !== undefined ? "Price: " + web3.utils.fromWei(item.price) + " FTM" : "Error Requesting price"}
             </div>)
             length = displayArr.skeletoons.length
        }
        if (selectedAddress === "Traits")
        {pagedNFT =  displayArr.traits.slice(page*14, (page*14)+14)
            var renderedOutput = pagedNFT.map((item, index )=> <div className={"card"} onClick={() => {openCard("Trait", item.id, index, item.marketId)}}>
            <img src={(traitInv + "/"+item.typeId + ".png")}></img>
            {"Token Id: " + item.id}
             <br></br> 
             {item.price !== null  && item.price !== undefined ? "Price: " + web3.utils.fromWei(item.price) + " FTM" : "Error Requesting price"}
             </div>)
             length = displayArr.traits.length
        }
        if (selectedAddress === "Glyphs")
        {pagedNFT =  displayArr.glyphs.slice(page*14, (page*14)+14)
            var renderedOutput = pagedNFT.map((item, index) => <div className={"card"} onClick={() => {openCard("Glyph", item.id, index, item.marketId)}}>
            <img src={glyphInv + "/" + item.appliesTo + ".png"}></img>
            {"Token Id: " + item.id}
             <br></br> 
             {item.price !== null  && item.price !== undefined ? "Price: " + web3.utils.fromWei(item.price) + " FTM" : "Error Requesting price"}
             </div>)
             length = displayArr.glyphs.length
        }

        //add cost into card bellow name
        
        return (
            <div id={"CardsDisplay"}>
                <div id={"PageNav"}>
                    <button id={"PrevPage"} onClick={() => {
                if (page > 0)
                {setPage(page-1)}
                }}>{"<"}</button>
                    {"  " + ((page*15)) + "..." + ((page*15)+14) + "  "}
                    <button id={"NextPage"} onClick={() => {
                if (page*15 < length)
                setPage(page+1)
                }}>{">"}</button>
                </div>
                {renderedOutput}
            </div>
        )
    }

    
    useEffect(() => {
        fetchListings()
        fetchListed()
        if (prop.address !== null) {
            fetchInventory()    
        }
    },[constructor, prop.address])

    

  return (
    <div id={"SelectDisplay"}>
        {cardOpen ? createCard() : ""}
        {selectDisplay()}
        {selectAddress()}
        {selectFilter()}
        {(selectedDisplay === "Listings")? cardsListings():""}
        {(selectedDisplay === "Inventory") ? cardsInventory():""}
        {(selectedDisplay === "Market") ? cardsDisplay():""}
    </div>
  )
}

export default Market