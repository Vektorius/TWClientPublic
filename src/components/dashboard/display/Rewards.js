import React from "react";
import "../../../styles/Rewards.css";
import TraitMap from "../../helpers/TraitMap.json";
import RewardsMap from "../../helpers/RewardsMap.json";
import Web3 from "web3";
import { useEffect, useState } from "react";
import geneDataAll from "../../helpers/geneDataAll.json";
import {
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
  rewardsAll,
  rewardsSingle,
} from "../../../data/canvassrc";
import { aTWRewards, aTWWarsTest, cTWRewards } from "../../helpers/Groups";
const Rewards = (prop) => {
  const [pendingRewards, setPendingRewards] = useState(0);
  const [timeLocked, setTimeLocked] = useState({dateLock: new Date()});
  const [unlockDateString, setUnlockDateString] = useState("");
  const [ticketsAll, setAllTickets] = useState(null);
  const [ticketsPersonal, setPersonalTickerts] = useState(null);


  const contract = cTWRewards;

  let genes = prop.geneSeq;
  let geneStrength = prop.strSeq;
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
  let totalRewards = { PointsAll: 0, PointsSkelly: 0, PointsZombie: 0, PointsDemon: 0, Glyphs: [] };
  let TWBrewardMultis = [2, 1];
  let rewardClaims;

  const web3 = new Web3(Web3.givenProvider);

  const rewardMapper = (rewardGene, _str) => {
    let str = parseInt(_str);
    let RewardString = "";
    if ((parseInt(rewardGene[0]) % 10) === 1) {
      totalRewards.PointsAll += str;
      if (str > 1) {
        RewardString += str + " Neutral points";
      } 
    }
    if ((parseInt(rewardGene[0]) % 10) === 2) {
      totalRewards.PointsSkelly += str;
      if (str > 1) {
        RewardString += str + " Skelly points";
      } 
    }
    if ((parseInt(rewardGene[0]) % 10) === 3) {
      totalRewards.PointsZombie += str;
      if (str > 1) {
        RewardString += str + " Zombie points";
      } 
    }
    if ((parseInt(rewardGene[0]) % 10) === 4) {
      totalRewards.PointsDemon += str;
      if (str > 1) {
        RewardString += str + " Demon points";
      } 
    }
    if (parseInt(rewardGene[0]) > 10) {
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

  const listItems = geneIcons.map((gene, index) => (
    <il class={"GeneRow"} id={"Gene" + listToGeneIndexer(index)} key={gene}>
      <img src={gene}></img>
      <div class={"GeneText"}>
        {geneDisasaemblerMapped(genes, listToGeneIndexer(index) * 3) + " " + strDissasermbler(geneStrength, listToGeneIndexer(index) * 3) + "/100"}
        <br></br>
        {rewardMapper(RewardsMap[genes.substring(listToGeneIndexer(index) * 3, listToGeneIndexer(index) * 3 + 3)], strDissasermbler(geneStrength, listToGeneIndexer(index) * 3))}
      </div>
      <br></br>
    </il>
  ));

  const renderTraits = () => {
    return (
      <div className={"TraitList"} id={"InvGenes"}>
        <ul>{listItems}</ul>
      </div>
    );
  };

  const nextReward = () => {
    contract.methods.getTimeLock(prop.skeletoonTokenId).call(async (err, result) => {
      if (!err) {
        setTimeLocked({dateLock: new Date(result*1000)})

      } else {
        console.log("ERROR getting timeLock");
      }
    });
  }

  const renderRewardsTotal = () => {
    contract.methods.getAvailableRewards(prop.skeletoonTokenId).call(async (err, result) => {
      if (!err) {
        setPendingRewards(result);
      } else {
        console.log("ERROR getting available rewards");
      }
    });

    let GlyphStr = "";
    if (pendingRewards != 0) {
      for (let i = 0; i < totalRewards.Glyphs.length; i++) {
        GlyphStr += totalRewards.Glyphs[i] + " x" + pendingRewards;
      }
      return (
        <div id={"ActiveRewardsAlt"} className={"RewardsBox"}>
          {"Total Rewards:"}
          <br></br>
          <br></br>
          {totalRewards.PointsAll * pendingRewards + " Neutral Points"}
          <br></br>
          {totalRewards.PointsSkelly * pendingRewards + " Skelly Points"}
          <br></br>
          {totalRewards.PointsZombie * pendingRewards + " Zombie Points"}
          <br></br>
          {totalRewards.PointsDemon * pendingRewards + " Demon Points"}
          <br></br>
          {GlyphStr}
          <br></br>
          <div class="rewardNextUnlock">{unlockDateString}</div>
        </div>
      );
    } else {
      for (let i = 0; i < totalRewards.Glyphs.length; i++) {
        GlyphStr += totalRewards.Glyphs[i] + " x1 ";
      }
      return (
        <div id={"PendingRewardsAlt"} className={"RewardsBox"}>
          {"Total Rewards:"}
          <br></br>
          <br></br>
          {totalRewards.PointsAll + " Neutral Points"}
          <br></br>
          {totalRewards.PointsSkelly + " Skelly Points"}
          <br></br>
          {totalRewards.PointsZombie + " Zombie Points"}
          <br></br>
          {totalRewards.PointsDemon + " Demon Points"}
          <br></br>
          {GlyphStr}
          <div class="rewardNextUnlock">{unlockDateString}</div>
        </div>
      );
    }
  };

  const renderButton = () => {};

  //ADD support for gen2 Later
  const unixTimeStampToNextReward = (timeStamp) => {
    let claimedStamp
    if (pendingRewards == 0) {
      claimedStamp = 28800 - timeStamp
    }
    if (pendingRewards == 1) {
      claimedStamp = 86400 - timeStamp
    }
    if (pendingRewards == 2) {
      claimedStamp = 172800 - timeStamp
    }
    if (pendingRewards == 3) {
      return "Maximum rewards stacked. Claim rewards to stack new rewards."
    } else 
    {
      let hours = Math.floor(claimedStamp/3600).toString()
      if (hours.length == 1) {hours = "0" + hours}
      let minutes = Math.floor((claimedStamp - hours*3600)/60).toString()
      if (minutes.length == 1) {minutes = "0" + minutes}
      let seconds = Math.floor((claimedStamp - hours*3600)- minutes*60).toString()
      if (seconds.length == 1) {seconds = "0" + seconds}
      if (timeStamp / 3600 > 87600){
        return "Claim your First Reward to stack additional rewards"
      } else {
        return "Next reward will be stacked in: " + hours + ":" + minutes + ":" + seconds
      }
    }   
  }
  
  

  const claimAll = () => {


  }

  const claimSingle = async () => {
    let skeletoonID = prop.skeletoonTokenId;
      let txData = cTWRewards.methods.claimSingleReward(skeletoonID).encodeABI();
      web3.eth.getGasPrice(function (error, result){
      web3.eth.sendTransaction(
        {
          from: prop.address,
          to: aTWWarsTest,
          data: txData,
          gasPrice: result
        }).on('receipt', function(receipt) {
          setPendingRewards(0)
        });
      })

  }

  const rewardButtons = () => {
    return(
      <>
      <div id={"RewardsAllButton"}>
        <img src={rewardsAll} class={"RewardImg"} onClick={() => {claimAll()}}></img>
        <br></br>
        {"View NFT Contest Entries"}
      </div>
        {pendingRewards > 0 ? <div id={"RewardsSingleButton"}>
        <img src={rewardsSingle} class={"RewardImg"} onClick={() => {claimSingle()}}></img>
        <br></br>
        {"Claim Single Skeletoon Reward"}</div>:""}
      </>
    )
  }


  const renderContest = () => {
    if (ticketsAll !== null && ticketsPersonal !== null)
    {return (
      <div id={"Contest"} className={"RewardsBox"}>
        <div id="contest_text1">{"NFT Contest"}<br></br>{"Total claims across ToonWorld: "+ticketsAll}</div>

        <div id="contest_text2">{"This skeletoon currently has: "+ticketsPersonal + " Claims"}</div>
      </div>
    )}
    else {
      <></>
    }
  }

  const profileView = () => {
    return (
      <>
        {renderTraits()}
        <div id={"RewardButtons"}>{rewardButtons()}</div>
        <div id={"RewardSingle"}>{renderRewardsTotal()}</div>
        <div id={"ContestBox"}>{renderContest()}</div>
      </>
    );
  };

  useEffect(() => {
    var today = new Date();
    let unixTimeLocked = ((new Date(today.getTime())) - timeLocked.dateLock.getTime()) / 1000
    setUnlockDateString(unixTimeStampToNextReward(unixTimeLocked))
  }, [timeLocked])

  useEffect(() => {
    nextReward()
  }, [prop.skeletoonTokenId])

  return <div>{profileView()}</div>;
};

export default Rewards;
