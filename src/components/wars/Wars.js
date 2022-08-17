import React from 'react'
import { useEffect, useState } from "react";
import "../../styles/Wars.css";
import TraitMap from "../helpers/TraitMap.json"
import { aTWG, aTWMarket, aTWSP, aTWT, cTWG, cTWMarket, cTWSP, cTWT, aTWWarsTest, cTWWars, aTWRewardsv2Test, cTWRewards } from '../helpers/Groups';
import { fetchMetadata } from '../../scripts/Helper';
import Web3 from "web3";
import { drawSingleCanvas, drawSkeletoonFull } from '../helpers/Renderer';
import { button_default, icon_minus, icon_plus, TWWDevil, TWWZombie, TWWSkelly, gen1Placeholder, TWWBackgrounds, TWWarsUI } from '../../data/canvassrc';


const Wars = (prop) => {
  const [rendered, setRenderer] = useState(null)
  const [walletFraction, setWalletFraction] = useState(null);
  const [walletPoints, setWalletPoints] = useState(null)
  const [pfp, setpfp] = useState({token: null, gene:null, str:null})
  const [walletsParticipating, setWalletsParticipating] = useState(null);
  const [skeletoonsInWallet, setSkeletoonsInWallet] = useState([]);
  const [skeletoonSelected, setSkeletoonSelected] = useState(null);
  const [usedPoints, setUsedPoints] = useState("0");
  const [usedAttackPoints, setUsedAttackPoints] = useState("0");
  const [cardOpen, setCardOpen] = useState(null);
  const [fractionCardOpen, setFractionCardOpen] = useState(null);
  const [totalPointsUsable, setTotalPointsUsable] = useState(null);
  const [attackPointsUSable, setAttackPointsUsable] = useState(null);
  const [fractionPointsTotal, setFractionPointsTotal] = useState([0,0,0]);


  const fractionLogos = [TWWSkelly, TWWZombie, TWWDevil]
  const web3 = new Web3(Web3.givenProvider);
  let cWars = cTWWars;
  let aTWWars = aTWWarsTest;
  let aTWReward = aTWRewardsv2Test;
  let cTWReward = cTWRewards;
  let cTWSKP = cTWSP;

  const displaySkeletoon = () => {
      cTWSKP.methods.getSkeletoonProperties(skeletoonSelected).call(async (err,result) => {
        if (!err){
          let gene = result[1]
          let str = result[2]
          for (let i = 54 - gene.length; i >0 ; i--){
            gene = "0" + gene
          }
          for (let i = 54 - str.length; i >0 ; i--){
            str = "0" + str
          }

          drawSkeletoonFull(gene, str, 'skeletoon_pfp_canvas', 0, 2, 250)
        }
      })
  }

  const fortifyPoints = () => {
      return(
        <div id={"PointControler"}>
            <div class="button-wrapper" id={"buttonMinus"} onClick={() => {
              if (usedPoints > 0) {
                setUsedPoints((parseInt(usedPoints)-1).toString())
              }
            }}>
            <button><img src={icon_minus} alt="my image" /></button>
            </div>
            <input id={"PointInput"} type="number" value={usedPoints} onChange={e => {parseInt(e.target.value) <= parseInt(totalPointsUsable) ? setUsedPoints(e.target.value) : setUsedPoints(totalPointsUsable)}}/>
            <div class="button-wrapper" id={"buttonPlus"} onClick={() => {
              if (parseInt(usedPoints) < parseInt(totalPointsUsable))
                setUsedPoints((parseInt(usedPoints)+1).toString())

            }}>
            <button><img src={icon_plus} alt="my image" /></button>
            </div>
        </div>
      )
  }

  const displayList = () => {
    let tokens = skeletoonsInWallet
    const listTokens = tokens.map((obj, index) => (
      <il class={"TokenRow"} id={"Token" + index} key={obj}>
        <div class={"TokenDiv"} onClick={() => {setSkeletoonSelected(obj)}}>
          {"Skeletoon ID: " + obj}
        </div>
        <br></br>
      </il>
    ));
    return (
      <ul id={"MyWalletTokens"}>{listTokens}</ul>
    )
  }

  const displayNavigation = () => {
    return (
      <>
      <div class={"navDiv"} id={"pNavDiv"} onClick={() => {skeletoonSelected !== skeletoonsInWallet[0] ? setSkeletoonSelected(skeletoonsInWallet[(skeletoonsInWallet.indexOf(skeletoonSelected)-1)]): setSkeletoonSelected(skeletoonsInWallet[(skeletoonsInWallet.length-1)])}}>{"<"}</div>
      <div class={"navDiv"} id={"nNavDiv"} onClick={() => {skeletoonSelected !== skeletoonsInWallet[(skeletoonsInWallet.length -1)]? setSkeletoonSelected(skeletoonsInWallet[(skeletoonsInWallet.indexOf(skeletoonSelected)+1)]) : setSkeletoonSelected(skeletoonsInWallet[0])}}>{">"}</div>
      </>
    )
  }

  const changeFractionTX = async (fractionNr) => {
    let txData = cWars.methods.changeFraction(fractionNr).encodeABI();
    web3.eth.getGasPrice(function (error, result){
    web3.eth.sendTransaction(
      {
        from: prop.address,
        to: aTWWars,
        data: txData,
        gasPrice: result
      }).on('receipt', function(receipt) {
        cWars.methods.getWalletProperties(prop.address).call(async (err,result) => {
          if (!err){
              setWalletFraction(result[0]);
          }
      })
      });
    })
  }

  const changeFraction = () => {
    return(
      <>
      {"Select your fraction"}
      <br></br>
      <img src={TWWSkelly} class={"FractionLogo"} onClick={() => {changeFractionTX(1)}}></img>
      <img src={TWWZombie} class={"FractionLogo"} onClick={() => {changeFractionTX(2)}}></img>
      <img src={TWWDevil} class={"FractionLogo"} onClick={() => {changeFractionTX(3)}}></img>
      </>
    )
  }

  const sendTxFortify = async () => {
    let txData = cWars.methods.fortifyPoints(skeletoonSelected, usedPoints).encodeABI();
    web3.eth.getGasPrice(function (error, result){
      web3.eth.sendTransaction(
        {
          from: prop.address,
          to: aTWWars,
          data: txData,
          gasPrice: result
        }).on('receipt', function(receipt) {
              setRenderer(!rendered);
        });
      })
  }

  const displayController = () => {
    return (
      <>
      <div id={"SelectedSkeletoonDisplay"}><canvas id="skeletoon_pfp_canvas" width="2000" height="2000"></canvas></div>
      {( walletFraction !== "0" && walletFraction !== null) ?
      <>
      <div id={"FortifyPoints"}>
        {walletFraction !== null ? 
        <img class={"FractionLogo"} src={fractionLogos[walletFraction-1]} onClick={() => {setFractionCardOpen(1)}}></img>: ""}
        <br></br>
        {"Your current points: " + walletPoints}
        <br></br>{"Available points to use: " + totalPointsUsable}
      <br></br>{"Add points to fortify: "}{fortifyPoints()}
      <div class="btn-group">
        <div class="button-wrapper" id={"fortifyButton"} onClick={() => {sendTxFortify()}}>
        <button><img src={button_default} alt="my image" /></button>
        <div class={"button_text"}>{"Fortify"}</div>
        </div>  
        </div> 
      </div>
      <div id={"Navigate"}>{skeletoonsInWallet.length > 1? displayNavigation(): ""}</div>
      <div id={"List"}>{skeletoonsInWallet.length > 1? displayList(): ""}</div>
      </>
      :
      <div id={"ChangeFraction"}>{skeletoonsInWallet.length > 0? changeFraction(): ""}</div>}
      
      </>
    )
  }

  const displayFraction = (fractionNr) => {
    let fraction = walletsParticipating.filter(item => (item.fraction == fractionNr)).sort((a, b) => 
     parseInt(a.points) - parseInt(b.points)
    ).reverse();
    const listAdresses = fraction.map((obj, index) => (
      <il class={"FractionRow"} id={"Profile" + index} key={obj}>
        <div class={"FractionDiv"} onClick={() => {setCardOpen(obj)}}>
          {obj.address.substring(0,8) + "..." +obj.address.substring(obj.address.length-3,obj.address.length)  + " Points: " + obj.points}
        </div>
        <br></br>
      </il>
    ));
    return (
      <>
      <img src={fractionLogos[fractionNr-1]} class={"FractionLogo"}></img>
      <br></br>
      {"Total Points: " + fractionPointsTotal[fractionNr-1]}
      <ul>{listAdresses}</ul>
      </>
    )
    
  }

  const renderDisplay = () => {
    return (
    <>
    <div id="Controler">{prop.address !== null? displayController() : ""}</div>
    <div class="Fraction" id="SFraction">{walletsParticipating !== null ? displayFraction(1): ""}</div>
    <div class="Fraction" id="ZFraction">{walletsParticipating !== null ? displayFraction(2): ""}</div>
    <div class="Fraction" id="DFraction">{walletsParticipating !== null ? displayFraction(3): ""}</div>
    </>
    )
  }

  const attackPoints = (maxPoints) => {
    console.log(maxPoints)
    return(
      <div id={"ATKPointControler"}>
          <div class="button-wrapper" id={"buttonMinus"} onClick={() => {
            if (usedAttackPoints > 0) {
              setUsedAttackPoints((parseInt(usedAttackPoints)-1).toString())
            }
          }}>
          <button><img src={icon_minus} alt="my image" /></button>
          </div>
          <input id={"PointInput"} type="number" value={usedAttackPoints} onChange={e => {parseInt(e.target.value) <= parseInt(maxPoints) ? setUsedAttackPoints(e.target.value) : setUsedAttackPoints(maxPoints)}}/>
          <div class="button-wrapper" id={"buttonPlus"} onClick={() => {
            if (parseInt(usedAttackPoints) < parseInt(maxPoints))
            setUsedAttackPoints((parseInt(usedAttackPoints)+1).toString())

          }}>
          <button><img src={icon_plus} alt="my image" /></button>
          </div>
      </div>
    )
  }

  const attackTx = async (attacked_address) => {
    let txData = cWars.methods.attackPoints(skeletoonSelected, usedAttackPoints, attacked_address).encodeABI();
    web3.eth.getGasPrice(function (error, result){
    web3.eth.sendTransaction(
      {
        from: prop.address,
        to: aTWWars,
        data: txData,
        gasPrice: result
      }).on('receipt', function(receipt) {
        setRenderer(!rendered);
      });
    })
  }

  const createCard = (attacked) => {
    let maxPoints
    console.log(attackPointsUSable)
    console.log(attacked.points)
    if (parseInt(attackPointsUSable) <= parseInt(attacked.points)) {
      maxPoints = attackPointsUSable
    } else {
      maxPoints = attacked.points
    }
    return (
        <div id="CardOverlay">
            <button class= {"MarketBtn"} id={"closeCard"} onClick={() => {
                setCardOpen(null);
            }}>{"X"}</button>
            <div id={"ExtraControls"}>
            <canvas id="attacked_canvas" width="2000" height="2000"></canvas>
            <div id={"AttackControls"}>
            {walletFraction !== null ? "": "You need to log in to participate in ToonWorld Wars"}
            {walletFraction === "0" ? "You need to select fraction to participate in ToonWorld Wars" : ""}
            {walletFraction === attacked.fraction ? "You can't attack someone from your own fraction" : <>
            <div id={"AttackedInfo"}>
              {"This can attack for maximum of " + attacked.points + " points" }
              {walletFraction !== null && walletFraction !== "0" ? <><br></br>
              <>{"You have " + attackPointsUSable + " points for attacking"}</>
              <br></br>
              <>{attackPoints(maxPoints)}</>
              <br></br>
              <div id={"AttackBtnControls"} onClick={() => {attackTx(attacked.address)}}>{"Attack"}</div> </>: ""}
            </div>
            </>}
            </div>
          </div>
        </div>
    )
}

const sendPFPtx = async () => {
  let txData = cWars.methods.setProfilePicture(skeletoonSelected).encodeABI();
  web3.eth.getGasPrice(function (error, result){
  web3.eth.sendTransaction(
    {
      from: prop.address,
      to: aTWWars,
      data: txData,
      gasPrice: result
    }).on('receipt', function(receipt) {
      setRenderer(!rendered);
    });
  })
}

const createFractionCard = () => {
  return (
      <div id="CardOverlay">
          <button class= {"MarketBtn"} id={"closeCard"} onClick={() => {
              setFractionCardOpen(null);
          }}>{"X"}</button>
          <div id={"ExtraControls"}>
            <canvas id="pfp_canvas" width="2000" height="2000"></canvas>
            <div id={"PFPControls"} onClick={() => {sendPFPtx()}}>{"Set as your wallet profile picture"}</div>
            <div id={"FractionControls"}>
            {"Change Fraction:"}
            <br></br>
            {walletFraction=== "1"? "":<img src={TWWSkelly} class={"FractionLogo"} onClick={() => {changeFractionTX(1)}}></img>}
            {walletFraction=== "2"? "":<img src={TWWZombie} class={"FractionLogo"} onClick={() => {changeFractionTX(2)}}></img>}
            {walletFraction=== "3"? "":<img src={TWWDevil} class={"FractionLogo"} onClick={() => {changeFractionTX(3)}}></img>}
            <br></br>
            {"Changing Fraction resets your points to 0 and subtracts your point total from fraction points"}
            </div>
          </div>
      </div>
  )
}

  useEffect(() => {
    if (prop.address !== null)
    cWars.methods.getWalletProperties(prop.address).call(async (err,result) => {
      if (!err){
          setWalletFraction(result[0]);
          setWalletPoints(result[1]);
          cWars.methods.getProfilePicture(prop.address).call(async (err,result) => {
            if (!err){
              let temp = {token: result[0], gene:result[1], str:result[2]}
              setpfp(temp);
              cTWSKP.methods.walletOfOwner(prop.address).call(async (err,result) => {
                if (!err){
                  setSkeletoonsInWallet(result);
                  setSkeletoonSelected(result[0])
                }
              })
            }
          })
      }
  })  

  cWars.methods.walletsInGame().call(async (err, result)=> {
    if (!err){
      cWars.methods.getBatchWalletProperties(result,0).call(async (err, result) => {
        let inGameWalletsFull = [];
        for (let i = 0; i< result.length; i++) {
          let tempWalletProp = {address: result[i][0], fraction: result[i][1], points: result[i][2]};
          inGameWalletsFull = [...inGameWalletsFull, tempWalletProp];
        }
        setWalletsParticipating(inGameWalletsFull);
      })
    }
  })

  let pointsTotal = [0,0,0];
    cWars.methods.skeletoonFractionPoints().call(async (err,result) => {
      if (!err) {
        pointsTotal[0] = result;
        cWars.methods.zombieFractionPoints().call(async (err,result) => {
          if (!err) {
            pointsTotal[1] = result;
            cWars.methods.demonFractionPoints().call(async (err,result) => {
              if (!err) {
                pointsTotal[2] = result;
                setFractionPointsTotal(pointsTotal);
              }
            })
          }
        })
      }
    })

  }, [rendered])

  useEffect(() => {
    if (prop.address !== null)
    cWars.methods.getWalletProperties(prop.address).call(async (err,result) => {
      if (!err){
          setWalletFraction(result[0]);
          setWalletPoints(result[1]);
          cWars.methods.getProfilePicture(prop.address).call(async (err,result) => {
            if (!err){
              let temp = {token: result[0], gene:result[1], str:result[2]}
              setpfp(temp);
              cTWSKP.methods.walletOfOwner(prop.address).call(async (err,result) => {
                if (!err){
                  setSkeletoonsInWallet(result);
                    setSkeletoonSelected(result[0])
                }
              })
            }
          })
      }
  })  
  }, [prop.address])

  useEffect(() => {
    if (skeletoonSelected !== null) {
      var myCanvas = document.getElementById('skeletoon_pfp_canvas');
          myCanvas.width = 2000;
          myCanvas.height = 2000;
      displaySkeletoon()
      cTWReward.methods.getPoints(skeletoonSelected).call(async (err,result) => {
        if (!err){
          let total = parseInt(result[0]) + parseInt(result[walletFraction])
          setTotalPointsUsable(total.toString());
          setAttackPointsUsable(result[walletFraction]);
        }
      })
    }
  }, [skeletoonSelected])

  useEffect(() => {
    if (fractionCardOpen === 1){
      cTWSKP.methods.getSkeletoonProperties(skeletoonSelected).call(async (err,result) => {
        if (!err){
          let gene = result[1]
          let str = result[2]
          for (let i = 54 - gene.length; i >0 ; i--){
            gene = "0" + gene
          }
          for (let i = 54 - str.length; i >0 ; i--){
            str = "0" + str
          }

          drawSkeletoonFull(gene, str, 'pfp_canvas', 0, 1, 500)
        }
      })   
    }
  }, [fractionCardOpen])

  useEffect(() => {
    if (cardOpen !== null){
      cWars.methods.getProfilePicture(cardOpen.address).call(async (err,result) => {
        if (!err){

          if (result[0] !== "0"){
          let gene = result[1]
          let str = result[2]
          for (let i = 54 - gene.length; i >0 ; i--){
            gene = "0" + gene
          }
          for (let i = 54 - str.length; i >0 ; i--){
            str = "0" + str
          }

          drawSkeletoonFull(gene, str, 'attacked_canvas', 0, 1, 500)}
          } if (result[0] === "0"){
            drawSingleCanvas(gen1Placeholder, 'attacked_canvas')
          }
      })
    }
  }, [cardOpen])

  useEffect(() => {
    if (walletFraction === null) {
      drawSingleCanvas(TWWBackgrounds[0], 'wars_background_canvas')
    } else {
      drawSingleCanvas(TWWBackgrounds[parseInt(walletFraction)], 'wars_background_canvas')
    }
  }, [rendered, walletFraction])

  return (
    <div id={"wars_container"}>
    <canvas id={"wars_background_canvas"} width="1680" height="855"></canvas>
    <div id={"wars_overlay"}>{fractionCardOpen !== null? createFractionCard(): ""}{cardOpen !== null? createCard(cardOpen): ""}{renderDisplay()}</div>
    </div>
  )
}

export default Wars