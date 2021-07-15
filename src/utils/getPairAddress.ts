import { Token } from '@uniswap/sdk'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256, pack} from '@ethersproject/solidity'

let PAIR_ADDRESS_CACHE: { [token0Address: string]: { [token1Address: string]: string } } = {}

const FACTORY_ADDRESS = '0x05BBF19f4b8d0E7a7F9eb20F86dcE18DE7931928'
const INIT_CODE_HASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'

export function getPairAddress(tokenA: Token, tokenB: Token): string {
  const tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks

  if (PAIR_ADDRESS_CACHE?.[tokens[0].address]?.[tokens[1].address] === undefined) {
    PAIR_ADDRESS_CACHE = {
      ...PAIR_ADDRESS_CACHE,
      [tokens[0].address]: {
        ...PAIR_ADDRESS_CACHE?.[tokens[0].address],
        [tokens[1].address]: getCreate2Address(
          FACTORY_ADDRESS,
          keccak256(['bytes'], [pack(['address', 'address'], [tokens[0].address, tokens[1].address])]),
          INIT_CODE_HASH
        )
      }
    }
  }
  return PAIR_ADDRESS_CACHE[tokens[0].address][tokens[1].address]
}
