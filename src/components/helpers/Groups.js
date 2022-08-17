import abi from "../../contracts/ABI.json";
import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider);
const contractSPSK = new web3.eth.Contract(abi.SPSK, "0x1dadaa7e55b2c7238ed04891ac182ea1468b79b9");
const contractSHY = new web3.eth.Contract(abi.SHY, "0x360b2900E56ECfa31c5004c640F8b8c803e00336");
const contractSpecials = new web3.eth.Contract(abi.Specials, "0x3D50934150B1CfD1a6d336684ffFC1cC3Fe906b7");
const contractCreatoons = new web3.eth.Contract(abi.Creatoons, "0xF870B0D3022682d9a6a7aBBF562c7F8F6Fc6c708");

export const atestnetSPSK = "0x3780687C770500740F244Ac405824Ca35FD50BA1"

export const aTWSP = "0xd0885885f066597e0c4f45eBDb56A9B08B22A9A1"
export const aTWT = "0xAeE90816d6496d84880611Af417802cE855C7949"
export const aTWG = "0x67b64675EFAA9Bee1902C760aE66DD55ad230730"
export const aTWB = "0xA71770D9EA591bdFF3a41C20343C609C457aF1fA"
export const aTWLogic = "0x77413058104341d722Dcc75dF02C1F409a16e536"
export const aTWRewards = "0xb3474D4859021C13420F8dd226Bfd1a60Fc7e568"
//export const aTWRewards = "0x3ea41c765Ec14bE31b5a9deF52d1bA6929C5302A"
export const aTWMarket = "0x96B2FE51a7bC07631633BD32a9671880Cd993f08";
export const aTWStarter = "0x9Ff5E8942dD3531CCF298e98f928e05bB6494DDf"
// rewards old 0xe205Bec79f8B371FB1f96Eba1FA0025798afFE3B
// logic old 0x0CD77416ACf0A247b140C594A435920f05de55A6

export const aTWLogicv2Test = "0x4241F923382eA307a84f8FB20E1fEE16b1852246"
export const aTWRewardsv2Test = "0x3ea41c765Ec14bE31b5a9deF52d1bA6929C5302A"
//export const aTWWarsTest = "0x75d518529d93b86e7CAA4C496dfd6580477F9D49"
export const aTWWarsTest = "0x877d3EE419E3cf66a56D71C83942811670FB934C"

export const aTWSPTest = "0x4d4391e65d56735ac8802ea4a685549c5d794de1"
export const aTWTTest = "0xa9eba3dadc9f239b032f6b93668b0782a9713d06"
export const aTWGTest = "0xF5BEeBbe909E2425099F9B4951D096afac80B21b"

export const aSPSK =  "0x1dadaa7e55b2c7238ed04891ac182ea1468b79b9";

export const ctestnetSPSK = new web3.eth.Contract(abi.TestNetSPSK, atestnetSPSK);

export const cTWWars = new web3.eth.Contract(abi.TWWars, aTWWarsTest);

export const cTWSP = new web3.eth.Contract(abi.TWSP, aTWSP);
export const cTWT = new web3.eth.Contract(abi.TWT,aTWT);
export const cTWG = new web3.eth.Contract(abi.TWG,aTWG);
export const cTWB = new web3.eth.Contract(abi.TWB,aTWB);
export const cTWLogic = new web3.eth.Contract(abi.TWLogic,aTWLogic);
export const cTWRewards = new web3.eth.Contract(abi.TWRewards,aTWRewards);
export const cTWMarket = new web3.eth.Contract(abi.TWMarket, aTWMarket);
export const cTWStarter = new web3.eth.Contract(abi.StarterPackPRomo, aTWStarter);

export const cSPSK = contractSPSK;



export const reqChain = 250;

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
        {    
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
        {   
            str = await result;}
        else 
        {console.log(err)}
    })
    return str;
}

export const getAvailablePoints = () => {

}

