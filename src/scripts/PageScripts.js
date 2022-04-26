import {InjectedConnector} from '@web3-react/injected-connector'
import { useWeb3React } from "@web3-react/core";
import web3 from "web3";

const { active, account, library, activate, deactivate } = useWeb3React()

export const walletAccess = new InjectedConnector({
    supportedChainIds: [250, 4002],
});

export async function connect() {
    try {
      await activate(walletAccess);
    } catch (ex) {
      console.log(ex)
    }
}