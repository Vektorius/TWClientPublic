import React, { useEffect, useState } from "react";
import "../../styles/Dashboard.css";
import { drawSingleCanvas } from "../helpers/Renderer"
import "../../styles/Tombstone.css";
import TombstoneMeniu from "./TombstoneMeniu";
import { tombstone_default,  background_default } from '../../data/canvassrc';
import { reqChain } from "../helpers/Groups";


const Dashboard = (prop) => {
  const [settings, setsettings] = useState(["default", "default"]);


  useEffect(() => {   
    console.log("Background drawn");
    drawSingleCanvas(background_default, 'dashboard_canvas');
    drawSingleCanvas(tombstone_default, 'tombstone_canvas');
  }, [settings]);

  return (
    <div id={"dashboard_container"}>
      <canvas id={"dashboard_canvas"} width="3360" height="1688"></canvas>
      <div id={"tombstone_container"}>
            <canvas id={"tombstone_canvas"}  width="1940" height="1600"></canvas>
            {prop.address !== true && prop.chain === reqChain ? <TombstoneMeniu address={prop.address} chain={prop.chain}></TombstoneMeniu> : <div id={"connect_wallet_overlay"}> Please connect to your wallet on fantom network             
            </div>}   
      </div>    
    </div>
  );

};

export default Dashboard;
