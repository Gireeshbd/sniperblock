import {
  FactoryAddress,
  RouterAddress,
  FactoryABI,
  RouterABI,
} from "./constents.js";
import { token1ABI, token2ABI } from "./tokenConstents.js";
import { ethers } from "ethers";
const token1 = "0xE781F6e743bE59146E9FeEfe7d1184F4aCAc48aa";
const token2 = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";
const token1Amount = "10000*10**18";
const token2Amount = "0.1*10**18";
const PRIVATE_KEY =
  "0x6d599bb89c970cd8cf0a31862f29c7327c0ed15e99a6fcd237845cf6e5d9b9a7";
const ownerAddres = "0x36302fc5725D4F6Bd48CD4F1D71544e130785bc8";

const RPC_URL = "https://bsc-dataseed.binance.org/";
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const signer = wallet.connect(provider);
const factory = new ethers.Contract(FactoryAddress, FactoryABI, signer);
console.log(factory);
const token1Contract = new ethers.Contract(token1, token1ABI, signer);
const token2Contract = new ethers.Contract(token2, token2ABI, signer);
const routerContract = new ethers.Contract(RouterAddress, RouterABI, signer);

async function main() {
  try {
    const tx = await factory.createPair(token1, token2);
    const pairAddress = await factory.getPair(token1, token2);
    console.log(pairAddress);
    await token1Contract.addTowhiteList(pairAddress);
    console.log(`Succuss ${pairAddress} is added to whiteList`);
    await token1Contract.approve(RouterAddress, token1Amount);
    await token2Contract.approve(RouterAddress, token2Amount);
    await routerContract.addLiquidity(
      token1,
      token2,
      100 * 10 ** 18,
      0.1 * 10 ** 18,
      100 * 10 ** 18,
      0.1 * 10 ** 18,
      ownerAddres,
      Math.floor(Date.now() / 1000) + 60 * 10
    );
  } catch (e) {
    console.log(e);
  }
}
main();
