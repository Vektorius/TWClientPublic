import React, {useEffect, useState} from 'react'
import "../../styles/TombstoneMeniu.css";
import abi from "../../contracts/ABI.json";
import Web3 from "web3";
import { fetchMetadata } from "../../scripts/Helper";
import { drawSingleCanvas, drawSkeletoonFull } from "../helpers/Renderer"
import { cTWSP, getGenes, getGroup, getStrength } from "../helpers/Groups"
import { button_dark, button_default, button_mini, button_mini2h, button_next, button_prev, icon_refresh, meniu_default } from '../../data/canvassrc';

//DELET this import defore publish
import geneDataAll from "../helpers/geneDataAll.json";

import GetTrait from './display/GetTrait';
import Mint from './display/Mint';
import Profile from './display/Profile';
import Rewards from './display/Rewards';
import Summon from './display/Summon';
import Upgrade from './display/Upgrade';
import Vote from './display/Vote';


const contractAddress = "0x1dadaa7e55b2c7238ed04891ac182ea1468b79b9";
const { ethereum } = window;

const TombstoneMeniu = (prop) => {

    const [skeletoons, setSkeletoons] = useState([]);
    const [selectedSkeletoonId, setSelectedSkeletoonId] = useState(null);
    const [selectedMeniu, setSelectedMeniu] = useState();
    const [availableMenius, setAvalableMenius] = useState([]);
    const [isDisplayProfiled, setDisplayProfiled] = useState(true);
    const [areSkeletoonsFetched, setFetch] = useState(0);
    const [meniuConstructor, setmeniuConstructor] = useState("default");
    const [gene, setGeneSeq] = useState(null);
    const [strength, setStrSeq] = useState(null);
    const [refresh, setRefresh] = useState(false);

    //let geneSequence = "017000012000021000041000043000036011028000000045000000";
    //let strengthSequence ="017000012000021000041000043000036011028000000045000000";
    

    const web3 = new Web3(Web3.givenProvider);

    //  Contracts
    //const contract = new web3.eth.Contract(abi.SPSK, contractAddress);
    const contract = cTWSP;

    const goodFetcher = () => {
        contract.methods.balanceOf(prop.address).call(async(err, result) => {   
          for (let i = 0; i < result; i++) {
            fetcherRetry(i)
          }
        });
      };
    
      const fetcherRetry = (tokenID) => {
        contract.methods.tokenOfOwnerByIndex(prop.address, tokenID).call(async(err, result) => {
          if (!err) {
            contract.methods.tokenURI( result).call( async(err, result) => {
              if (!err) {
                let tokenMetadata = await fetchMetadata( result);
                setSkeletoons((skeletoonList) => [...skeletoonList, tokenMetadata]);
              } else {
                fetcherRetry(tokenID)
              }
            });
          } else {
            fetcherRetry(tokenID)
          }
        });
      }

      const displaySkeletoonProfile = () => {
        return (
            <div>
                  
              <div id={isDisplayProfiled ? "skeletoonProfileDisplay" :  "skeletoonProfileDisplay_hidden"}>  
                {displaySkeletoon()}
                <div className={"navigationBtns"}>{selectedSkeletoonId !== null ? navigation() : ""}</div>
              </div>
            </div>
          );
      }

      const meniuButton = (selector, text) => {
          return (
            <div class="button-wrapper" onClick={() => {setSelectedMeniu(selector)}}>
            <button><img src={button_dark} alt="my image" /></button>
            <div class={"button_text"}>{text}</div>
            </div> 
          )
      }


      const navigation =  () => {
        return (
            <div className={"miniHeader"}>
              {skeletoons.length > 1 ? <div className= {"bwrap"} onClick={() => {
                  if (selectedSkeletoonId !== 0) {
                    setSelectedSkeletoonId(selectedSkeletoonId - 1);
                  } else {
                    setSelectedSkeletoonId((skeletoons.length)-1);
                  }
                }}>
              <button id={"prev_nav"}>
              <img src={button_prev} alt="my image" />    
              </button></div> : ""}
              {selectedMeniu === "List"?
              <div className= {"bwrap"} onClick={() => {
                setFetch(0);
                setSelectedSkeletoonId(null);
                setSkeletoons([]);
                goodFetcher()  
            }}>

            <button id={"middle_nav"}>
            <img src={button_mini2h} alt="my image" />    
            </button></div>
              
              :
              <div className= {"bwrap"} onClick={() => {
                setRefresh(!refresh)
              }}>
            <button id={"middle_nav"}>
            <img src={button_mini2h} alt="my image" />    
            </button></div>}

            {skeletoons.length > 1 ? <div className= {"bwrap"} onClick={() => {
                  if (skeletoons.length - 1 !== selectedSkeletoonId) {
                    setSelectedSkeletoonId(selectedSkeletoonId + 1);
                  } else {
                    setSelectedSkeletoonId(0);
                  }
                }}>
            <button id={"next_nav"}>
            <img src={button_next} alt="my image" />    
            </button></div> : ""}
            </div>
        );
      }

      const displaySkeletoon = () => {

          return (
            <div>
                <canvas id="skeletoon_profile_canvas" width="2000" height="2000"></canvas>
                <div className={"skeletoonDisplayName"}>{selectedSkeletoonId !== null ? skeletoons[selectedSkeletoonId].name : ""}</div>
            </div>
          )
      }

      /*   Swap out for Skeletoon builder*/

      const listToonWorldSkeletoons = () => {
        const listItems = skeletoons.map((token) => (
          <il class={"SkeletoonListItem"}
            key={token.id}
            onClick={() => {
              setSelectedSkeletoonId(skeletoons.map((object) => object.id).indexOf(token.id));
            }}
          >
            {token.name}
            <br></br>
          </il>
        ));
        return (
          <div className={"skeletoonListMini"}>
            {"My Skeletoons"}
            <ul>{listItems}</ul>
            
          </div>
        );
      };

      const mainDisplay = () => {
          switch (selectedMeniu) {
              case "List":
                return (
                    listToonWorldSkeletoons()
                )
              case "Mint":
                  return (
                      <Mint address = {prop.address}></Mint>
                  )
              case "Summon":  
                  return (
                      <Summon address = {prop.address}></Summon>
                  )
              case "Profile":
                  return (
                      <Profile skeletoonTokenId = {skeletoons[selectedSkeletoonId].id} geneSeq = {gene} strSeq = {strength} ></Profile>
                  )
              case "Upgrade":
                  return (
                      <Upgrade skeletoonTokenId = {skeletoons[selectedSkeletoonId].id} geneSeq = {gene} strSeq = {strength} address = {prop.address}></Upgrade>
                  )
              case "MintTrait":  
                  return (
                      <GetTrait skeletoonTokenId = {skeletoons[selectedSkeletoonId].id} geneSeq = {gene} strSeq = {strength} address = {prop.address}></GetTrait>
                  ) 
              case "Rewards":
                  return (
                      <Rewards skeletoonTokenId = {skeletoons[selectedSkeletoonId].id} geneSeq = {gene} strSeq = {strength} address = {prop.address}></Rewards>
                  ) 
              case "Vote":
                  return (
                      <Vote></Vote>
                  )
          }
      }

      const meniuDisplay = () => {
          return(
            
            <div class="btn-group">
                {meniuButton("Mint","Mint")}
                
                
            
                {availableMenius.includes("Toonworld Skeletoon Profile") ? <div>
                {meniuButton("Summon","Summon")}
                {meniuButton("Profile","Profile")}
                {meniuButton("Upgrade","Upgrade")}   
                {meniuButton("List","List")}
                {meniuButton("MintTrait","Extract Trait")} 
                </div>: ""}
                {availableMenius.includes("ToonWorldSpecials") || availableMenius.includes("ShyFeet") || availableMenius.includes("SinfulCreattons") || availableMenius.includes("Skeletoons") || availableMenius.includes("Toonworld Skeletoon Profile")? meniuButton("Rewards","Rewards")  : ""}
                {availableMenius.includes("Skeletoons") ? meniuButton("Vote","Vote"): ""}
            </div>
          )
      }

    useEffect(() => {
        drawSingleCanvas(meniu_default, 'tombstoneMeniu_canvas');
    }, [meniuConstructor]);

    useEffect(() => {
        setFetch(0);
        setSelectedSkeletoonId(null);
        setSkeletoons([]);
        goodFetcher()
        setAvalableMenius(getGroup(prop.address))
    }, [prop.address]);

    useEffect(() => {
        if (selectedMeniu === "Profile" || selectedMeniu === "Upgrade" || selectedMeniu === "MintTrait" || selectedMeniu === "List" ){
            setDisplayProfiled(true)
        } else if (selectedMeniu === "Rewards" && availableMenius.includes("Toonworld Skeletoon Profile")){
            setDisplayProfiled(true)
        } else {
            setDisplayProfiled(false)
        }
    }, [selectedMeniu])

    useEffect(() => {
        if (availableMenius.includes("Toonworld Skeletoon Profile")){
            setSelectedMeniu("List")
            } else {
            setSelectedMeniu("Mint")    
            }
    }, [availableMenius.length])

    useEffect(() =>{
        if (selectedSkeletoonId !== null){

            // Change to get gene and stregth data from on chain
            
            cTWSP.methods.getStrength(skeletoons[selectedSkeletoonId].id).call(async(err, result) =>{
                if (!err)
                {    
                    for (let i = 54 - result.length; i >0 ; i--){
                        result = "0" + result
                    }
                    setStrSeq(result)
                    cTWSP.methods.getGenes(skeletoons[selectedSkeletoonId].id).call(async(err, result) =>{
                      if (!err)
                      {    
                          for (let i = 54 - result.length; i >0 ; i--){
                              result = "0" + result
                          }
                          setGeneSeq(result)
                      }
                      else 
                      {console.log(err)}
                  })
                }
                else 
                {console.log(err)}
            })    
        }
    }, [selectedSkeletoonId ,refresh])

    useEffect(() => {
        if (areSkeletoonsFetched == 0 && skeletoons.length === 1) {
            setSelectedSkeletoonId(0)
            setFetch(1)
        }
    }, [skeletoons])

    useEffect(() => {
        if (typeof gene === "string" && typeof strength === "string"){
            var myCanvas = document.getElementById('skeletoon_profile_canvas');
            myCanvas.width = 2000;
            myCanvas.height = 2000;
            drawSkeletoonFull(gene, strength, 'skeletoon_profile_canvas', 0, 2, 250);
        }
    },[gene])



  return (
    <div id={"tombstoneMeniu_container"}>
            <canvas id={"tombstoneMeniu_canvas"} width="300" height="1140"></canvas>
            <div id={"tombstoneMeniu_overlay"}>
                {meniuDisplay()}          
            </div> 
            <div id={isDisplayProfiled?"tombstoneDisplay_overlay_small": "tombstoneDisplay_overlay_large"}>
                {displaySkeletoonProfile()}
                {mainDisplay()}
            </div>         
    </div>
  )
}

export default TombstoneMeniu