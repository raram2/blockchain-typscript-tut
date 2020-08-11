import * as crypto from 'crypto-js'

type Nullable<T> = T | null | undefined

class Block {
  public index: number
  public hash: string
  public prevHash: Nullable<string>
  public data: string
  public timestamp: number
  constructor(
    index: number,
    hash: string,
    prevHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index
    this.hash = hash
    this.prevHash = prevHash
    this.data = data
    this.timestamp = timestamp
  }
  // static method is not for instance(prototype)
  static makeHash = (
    index: number,
    prevHash: Nullable<string>,
    data: string,
    timestamp: number
  ): string => crypto.SHA256(index + prevHash + data + timestamp).toString()
  static makeTimestamp = (): number => Math.round(new Date().getTime() / 1000)
  static validateStructure = (target: Block): boolean => {
    const { index, hash, data, timestamp } = target
    return (
      typeof index === 'number' &&
      typeof hash === 'string' &&
      typeof data === 'string' &&
      typeof timestamp === 'number'
    )
  }
}

class BlockChain {
  public storage: Block[]
  constructor(storage: Block[] = []) {
    this.storage = storage
  }
  getLastBlock(): Nullable<Block> {
    const length = this.storage.length
    if (length > 0) {
      return this.storage[length - 1]
    }
    return null
  }
  static getTargetHash = (target: Block): string =>
    Block.makeHash(target.index, target.prevHash, target.data, target.timestamp)
  static isValidBlock = (target: Block, compared: Nullable<Block>): boolean => {
    if (!Block.validateStructure(target)) {
      console.log('Error at validation 1')
      return false
    }
    if (target.hash !== BlockChain.getTargetHash(target)) {
      console.log('Error at validation 2')
      return false
    }
    if (compared && target.index !== compared.index + 1) {
      console.log('Error at validation 3')
      return false
    }
    if (compared && target.prevHash !== compared.hash) {
      console.log('Error at validation 4')
      return false
    }
    return true
  }
}

const blockchain: storage{} = new BlockChain()

const addBlock = (target: Block): Block => {
  const compared = blockchain.getLastBlock()
  if (BlockChain.isValidBlock(target, compared)) {
    blockchain.storage.push(target)
    return target
  }
  throw new Error(
    'A block has been made, but not added to blockchain because it is invalid'
  )
}

const makeBlock = (data: string): Block => {
  const prevBlock: Block = blockchain.getLastBlock()
  const index: number = prevBlock ? prevBlock.index + 1 : 0
  const prevHash: string = prevBlock ? prevBlock.hash : null
  const timestamp: number = Block.makeTimestamp()
  const hash: string = Block.makeHash(index, prevHash, data, timestamp)
  const block: Block = new Block(index, hash, prevHash, data, timestamp)
  addBlock(block)
  return block
}

makeBlock('Bitcoin')
makeBlock('Ethereum')
makeBlock('Ripple')

console.log(blockchain.storage)
