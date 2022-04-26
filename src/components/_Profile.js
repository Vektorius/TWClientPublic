import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import abi from "../contracts/ABI.json";
import Web3 from "web3";
import { fetchMetadata } from "../scripts/Helper";
const contractAddress = "0x1dadaa7e55b2c7238ed04891ac182ea1468b79b9";

const Profile = (prop) => {

  const [skeletoonIndex, setSkeletoonIndex] = useState(null);
  const [toggleList, isListToggled] = useState(0);
  const [renderPinata, isPinataToggled] = useState(null);


  const web3 = new Web3(Web3.givenProvider);
  const contract = new web3.eth.Contract(abi, contractAddress);

  const list = () => {
    const listItems = prop.availableSkeletoons.map((token) => (
      <il
        key={token.id}
        onClick={() => {
          isListToggled(!toggleList);
          setSkeletoonIndex(prop.availableSkeletoons.map((object) => object.id).indexOf(token.id));
          console.log(token.name);
        }}
      >
        {token.name}
        <br></br>
      </il>
    ));
    return (
      <div className={"skeletoonListMini"}>
        <ul>{listItems}</ul>
      </div>
    );
  };

  const displayMini = () => {
    return (
      <div>
        <img className={"skeletoonSelectImage"} src={skeletoonIndex !== null ? prop.availableSkeletoons[skeletoonIndex].image : ""} />
        <br />
        <div className={"skeletoonSelectName"}>{skeletoonIndex !== null ? prop.availableSkeletoons[skeletoonIndex].name : ""}</div>
      </div>
    );
  };

  const rarityCalc = () => {
    let raritySum = 0;
    let i = 0;
    const listTraits = prop.availableSkeletoons[skeletoonIndex].attributes
    console.log(listTraits)
    for (i = 0; i< 9; i++){
       raritySum += 10000 / prop.availableSkeletoons[skeletoonIndex].attributes[i].count
    }
    return <div>{raritySum.toFixed(2)}</div>
  }

  const traitList = () => {
    const listTraits = prop.availableSkeletoons[skeletoonIndex].attributes
      .filter((attribute) => attribute.value !== "None")
      .map((attribute) => (
        <il key={attribute.trait_type}>
          {attribute.trait_type} : {attribute.value}
          <br></br>
        </il>
      ));
    return <ul>{listTraits}</ul>;
  };

  const mainDisplay =  () => {
    return (
      <div>
        <div className={"largeDisplay"}>
          {toggleList ? list() : displaySkeletoon()}
          
         
          <div className={"navigationBtns"}>{navigation()}</div>
        </div>
      </div>
    );
  };

  const displaySkeletoon =  () => {
    if (renderPinata !== true) {
    return (
      <div>
      <img className={"largePicture"} src={skeletoonIndex !== null ? prop.availableSkeletoons[skeletoonIndex].image : ""} />
          <div className={"skeletoonDisplayName"}>{skeletoonIndex !== null ? prop.availableSkeletoons[skeletoonIndex].name : ""}</div>
          <div className={"skeletoonDisplayTraits"}>{skeletoonIndex !== null ? traitList() : ""}</div>
          <div className={"skeletoonDisplayPassive"}></div>
          {skeletoonIndex !== null ? rarityCalc() : ""}
         </div>
    ) } else {
      return (
        <div>
        {skeletoonIndex !== null ? displayPinataImg() : ""}
            <div className={"skeletoonDisplayName"}>{skeletoonIndex !== null ? prop.availableSkeletoons[skeletoonIndex].name : ""}</div>
            <div className={"skeletoonDisplayTraits"}>{skeletoonIndex !== null ? traitList() : ""}</div>
            <div className={"skeletoonDisplayPassive"}></div>
            {skeletoonIndex !== null ? rarityCalc() : ""}
           </div>
      )
    }
  }

  const selectPinataImg = () => {
    return (<div>
    <input className= "textBox1" type="text"/>
    <input className= "textBox2" type="text"/>
    <button
            onClick={() => {
              isPinataToggled(true);
            }}
          >
            PINATA{" "}
    </button>
    <button
            onClick={() => {
              drawToon();
            }}
          >
            DRAW{" "}
    </button>
    </div>)
  }

  const drawToon = () => {
    let inputValue = "https://spookyskeletoons.mypinata.cloud/ipfs/QmapuarHWB3HzQ9HxQvCGjSRLamJUs4gzfeyxbiKwmt2hH/Skeletai/" + document.querySelector('input').value + ".png"
    let otherValue = "https://spookyskeletoons.mypinata.cloud/ipfs/QmapuarHWB3HzQ9HxQvCGjSRLamJUs4gzfeyxbiKwmt2hH/Skeletai/23.png"

    var myCanvas = document.getElementById('canvas');
    var ctx = myCanvas.getContext('2d');
    var img = new Image;
    var img2 = new Image;
    img.onload = function(){
      console.log(img);
      ctx.drawImage(img,0,0, 300, 300); // Or at whatever offset you like
    };
    img.src = otherValue;
    img2.onload = function(){
      console.log(img2);
      ctx.drawImage(img2,0,0,300, 300); // Or at whatever offset you like
    };
    img2.src = inputValue;
  }

  const displayPinataImg = () => {
    
    return (

      <canvas id="canvas" width="300" height="300">

      </canvas>

    )
  }

  const navigation =  () => {
    return (
        <div className={"miniHeader"}>
          <button
            onClick={() => {
              if (skeletoonIndex !== 0) {
                setSkeletoonIndex(skeletoonIndex - 1);
              } else {
                setSkeletoonIndex(prop.availableSkeletoons.length);
              }
            }}
          >
            Prev{" "}
          </button>
          <button
            onClick={() => {
              isListToggled(!toggleList);
            }}
          >
            List{" "}
          </button>
          <button
            onClick={() => {
              if (prop.availableSkeletoons.length + 1 !== skeletoonIndex) {
                setSkeletoonIndex(skeletoonIndex + 1);
              } else {
                setSkeletoonIndex(0);
              }
            }}
          >
            Next{" "}
          </button>
        </div>
    );
  }


  useEffect(() => {
    
    setSkeletoonIndex(prop.availableSkeletoons.map((object) => object.id).indexOf(prop.skeletoonId));
  }, [prop.availableSkeletoons, prop.skeletoonId]);



  return (
    <div className= "openProfileDisplay">
    {prop.mode === "connected" ? mainDisplay() : ""}   
    {prop.mode === "connected" ? selectPinataImg() : ""}   
    </div>
  );
};

export default Profile;
