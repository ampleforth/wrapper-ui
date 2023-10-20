import { ethers, Signer, Contract } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';
import { MulticallProvider } from 'ethers-multicall-provider';
import { CurrencyAmount, Token } from '@uniswap/sdk-core';
import { NATIVE_ETH_ADDRESS } from './config';

const erc20Abi = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function allowance(address owner, address spender) view  returns (uint256)',
  'function totalSupply() external view returns (uint256)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
];

const wrapperAbi = [
  'function underlyingToWrapper(uint256 uAmount) external view returns (uint256)',
  'function wrapperToUnderlying(uint256 amount) external view returns (uint256)',
];

const wrapperRouterAbi = [
  'function deposit(address buttonToken) external payable returns (uint256)', // Deposit ETH
  'function burn(address buttonToken, uint256 amount) external returns (uint256)', // Burn bToken
];

const buttonTokenAbi = [
  'function deposit(uint256 uAmount) external returns (uint256)', // Deposit underlying
  'function burn(uint256 amount) external returns (uint256)', // Burn bToken
];

const unbuttonFactoryAbi = [
  'function deposit(uint256 uAmount) external returns (uint256)', // Deposit underlying
  'function burn(uint256 amount) external returns (uint256)', // Burn ubToken
];

export async function ethBalance(signer: Signer): Promise<BigNumber[]> {
  const address = await signer.getAddress();
  if (!signer.provider)
    return new Promise<BigNumber[]>((resolve, reject) => {
      return [BigNumber.from('0')];
    });
  return signer.provider?.getBalance(address).then((bn) => [BigNumber.from(bn)]);
}

export async function balanceOfMulti(
  provider: MulticallProvider,
  signer: Signer,
  tokens: Token[],
): Promise<BigNumber[]> {
  const address = await signer.getAddress();
  return Promise.all(
    tokens.map((token) => {
      if (token.address === NATIVE_ETH_ADDRESS) {
        return provider.getBalance(address);
      }
      const erc20 = new Contract(token.address, erc20Abi, provider);
      return erc20.balanceOf(address);
    }),
  ).then((results: string[]) => results.map((result) => BigNumber.from(result)));
}

export async function totalSupplyMulti(
  provider: MulticallProvider,
  signer: Signer,
  tokens: Token[],
): Promise<BigNumber[]> {
  return Promise.all(
    tokens.map((token) => {
      const erc20 = new Contract(token.address, erc20Abi, provider);
      return erc20.totalSupply();
    }),
  ).then((results: string[]) => results.map((result) => BigNumber.from(result)));
}

export async function wrapperToUnderlyingMulti(
  provider: MulticallProvider,
  signer: Signer,
  amounts: BigNumber[],
  wrapperTokens: Token[],
): Promise<BigNumber[]> {
  console.log('wrapperto underling');
  console.log({ amounts });
  return Promise.all(
    wrapperTokens.map((wrapperToken: Token, index: number) => {
      const wrapperTokenContract = new Contract(wrapperToken.address, wrapperAbi, provider);
      console.log('wrapping');
      console.log(amounts[index]);
      return wrapperTokenContract.wrapperToUnderlying(amounts[index].toString());
      console.log('wrapped');
    }),
  ).then((results: string[]) => results.map((result) => BigNumber.from(result)));
}

export async function approveWrapping(
  signer: Signer,
  underlyingAmount: CurrencyAmount<Token>,
  wrappingToken: Token,
): Promise<boolean> {
  if (underlyingAmount.currency.address === NATIVE_ETH_ADDRESS) {
    // dont need to approve raw ETH wraps
    return true;
  }

  const erc20 = new ethers.Contract(underlyingAmount.currency.address, erc20Abi, signer);
  const approved = await erc20.allowance(await signer.getAddress(), wrappingToken.address);
  if (approved.gte(underlyingAmount.quotient.toString())) {
    // Already approved;
    return true;
  }
  const tx = await erc20.approve(wrappingToken.address, ethers.MaxUint256);
  return tx.wait();
}

export async function buttonWrapWithRouter(
  signer: Signer,
  amount: string,
  buttonToken: Token,
  routerAddress: string,
): Promise<CurrencyAmount<Token>> {
  const router = new ethers.Contract(routerAddress, wrapperRouterAbi, signer);
  const tx = await router.deposit(buttonToken.address, { value: amount });
  return tx.wait();
}

export async function buttonWrap(
  signer: Signer,
  underylingAmount: string,
  buttonToken: Token,
): Promise<CurrencyAmount<Token>> {
  const buttonTokenContract = new ethers.Contract(buttonToken.address, buttonTokenAbi, signer);
  const tx = await buttonTokenContract.deposit(underylingAmount);
  return tx.wait();
}

export async function buttonUnwrapWithRouter(
  signer: Signer,
  buttonTokenAmount: CurrencyAmount<Token>,
  routerAddress: string,
): Promise<CurrencyAmount<Token>> {
  const router = new ethers.Contract(routerAddress, wrapperRouterAbi, signer);
  const tx = await router.burn(buttonTokenAmount.currency.address, buttonTokenAmount);
  return tx.wait();
}

export async function buttonUnwrap(
  signer: Signer,
  buttonTokenAmount: CurrencyAmount<Token>,
): Promise<CurrencyAmount<Token>> {
  const buttonTokenContract = new ethers.Contract(
    buttonTokenAmount.currency.address,
    buttonTokenAbi,
    signer,
  );
  const tx = await buttonTokenContract.burn(buttonTokenAmount.quotient.toString());
  return tx.wait();
}

export async function unbuttonWrap(
  signer: Signer,
  underylingAmount: string,
  unbuttonToken: Token,
): Promise<CurrencyAmount<Token>> {
  const unbuttonTokenContract = new ethers.Contract(
    unbuttonToken.address,
    unbuttonFactoryAbi,
    signer,
  );
  const tx = await unbuttonTokenContract.deposit(underylingAmount);
  return tx.wait();
}

export async function unbuttonUnwrap(
  signer: Signer,
  unbuttonTokenAmount: CurrencyAmount<Token>,
): Promise<CurrencyAmount<Token>> {
  const unbuttonTokenContract = new ethers.Contract(
    unbuttonTokenAmount.currency.address,
    unbuttonFactoryAbi,
    signer,
  );
  const tx = await unbuttonTokenContract.burn(unbuttonTokenAmount.quotient.toString());
  return tx.wait();
}
