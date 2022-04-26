import abi from "../../contracts/ABI.json";
import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider);
const contractSPSK = new web3.eth.Contract(abi.SPSK, "0x1dadaa7e55b2c7238ed04891ac182ea1468b79b9");
const contractSHY = new web3.eth.Contract(abi.SHY, "0x360b2900E56ECfa31c5004c640F8b8c803e00336");
const contractSpecials = new web3.eth.Contract(abi.Specials, "0x3D50934150B1CfD1a6d336684ffFC1cC3Fe906b7");
const contractCreatoons = new web3.eth.Contract(abi.Creatoons, "0xF870B0D3022682d9a6a7aBBF562c7F8F6Fc6c708");

export const atestnetSPSK = "0x3780687C770500740F244Ac405824Ca35FD50BA1"

export const aTWSP = "0x4D4391E65D56735AC8802eA4a685549c5D794de1"
export const aTWT = "0x3476377a802F88D0F2f4A1892d2c7401cC1A782e"
export const aTWG = "0xF5BEeBbe909E2425099F9B4951D096afac80B21b"
export const aTWB = "0xF35608EA9e6B06e71dB762373367d5C1d98Ae4Ce"
export const aTWLogic = "0x8f25C4Ed9E00d70e66c507862E66A5A6110Db93A"
export const aTWRewards = "0x42055d98CFD0752574978b5088CcB341e9E27e49"
export const aTWMarket = "0x48c4177d88b12941281d230d26CF226d2802EdCA";

export const aSPSK =  "0x1dadaa7e55b2c7238ed04891ac182ea1468b79b9";

export const ctestnetSPSK = new web3.eth.Contract(abi.TestNetSPSK, atestnetSPSK);

export const cTWSP = new web3.eth.Contract(abi.TWSP, aTWSP);
export const cTWT = new web3.eth.Contract(abi.TWT,aTWT);
export const cTWG = new web3.eth.Contract(abi.TWG,aTWG);
export const cTWB = new web3.eth.Contract(abi.TWB,aTWB);
export const cTWLogic = new web3.eth.Contract(abi.TWLogic,aTWLogic);
export const cTWRewards = new web3.eth.Contract(abi.TWRewards,aTWRewards);
export const cTWMarket = new web3.eth.Contract(abi.TWMarket, aTWMarket);

export const cSPSK = contractSPSK;



export const reqChain = 4002;

export const getGroup = (address) => {
    let group = [];

    contractSPSK.methods.balanceOf(address).call(async(err, result) => {
        if (result > 0) {
            group.push("Skeletoons")
        }
        })
    contractSHY.methods.balanceOf(address).call(async(err, result) => {
        if (result > 0) {
            group.push("ShyFeet")
        }
        })
    contractSpecials.methods.balanceOf(address).call(async(err, result) => {
        if (result > 0) {
            group.push("ToonWorldSpecials")
        }
        })
    contractCreatoons.methods.balanceOf(address).call(async(err, result) => {
        if (result > 0) {
            group.push("SinfulCreatoons")
        }
        })
    //TODO add ToonworldSkeletoons   
    cTWSP.methods.balanceOf(address).call(async(err, result) => {
        if (result > 0) {
            group.push("Toonworld Skeletoon Profile")
        }
        })
    cTWT.methods.balanceOf(address).call(async(err, result) => {
        if (result > 0) {
            group.push("Toonworld Traits")
        }
        })
    cTWG.methods.balanceOf(address).call(async(err, result) => {
        if (result > 0) {
            group.push("Toonworld Glyph")
        }
        })
    cTWB.methods.balanceOf(address).call(async(err, result) => {
        if (result > 0) {
            group.push("Toonworld Bucks")
        }
        })
     
    return group
}

export const getGenes = (tokenId) => {
    let gene
    cTWSP.methods.getGenes(tokenId).call(async(err, result) =>{
        if (!err)
        {    console.log( result)
            gene = await result;}
        else 
        {console.log(err)}
    })
    return gene
}

export const getStrength = (tokenId) => {
    let str
    cTWSP.methods.getStrength(tokenId).call(async(err, result) =>{
        if (!err)
        {   console.log( result)
            str = await result;}
        else 
        {console.log(err)}
    })
    return str;
}

export const getAvailablePoints = () => {

}

