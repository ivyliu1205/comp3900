import Helper from '@/helper'

class ApiError {
  constructor (err) {
    this.err = err
    if (err.message.includes('timeout')) {
      this.reason = 'timeout'
    } else if (err.response !== undefined || err.response !== null) {
      this.reason = 'server'
    } else {
      this.reason = 'unknown'
    }
  }

  get message () {
    return this.err.message
  }
}

class ApiResult {
  constructor (hasError, obj) {
    this._hasError = hasError
    this._obj = obj
    // this._data = data
  }

  get data () {
    return this._obj.data
  }

  get err () {
    return this._hasError ? new ApiError(this._obj) : null
  }

  get hasError () {
    return this._hasError
  }

  tryReplaceData (data) {
    if (!this.hasError) {
      return false
    }
    this._obj.data = data
    this._hasError = false
    return true
  }

  replaceData (data) {
    this._obj.data = data
    return true
  }
}

class TrieNode {
  constructor (key, word = null) {
    this.key = key
    this.children = {}
    this.word = word
  }

  addChild (node) {
    if (node.key in this.children) {
      return false
    }
    this.children[node.key] = node
    return true
  }

  updateStoredWord (newStoredWord) {
    this.word = newStoredWord
  }

  get isWord () {
    return !!this.word
  }

  contains (key) {
    return key in this.children
  }

  getChild (key) {
    return this.children[key]
  }

  get wordList () {
    let res = this.word ? [this.word] : []
    for (const v of Object.values(this.children)) {
      res = res.concat(v.wordList)
    }
    return res
  }

  findBestMatch (remaining, delimiterMap = null) {
    if (remaining.length === 0) {
      return this.word
    }
    if (remaining[0] in this.children) {
      const foundWord = this.children[remaining[0]].findBestMatch(
        remaining.substring(1),
        delimiterMap
      )
      if (foundWord) {
        return foundWord
      }
    }
    return !delimiterMap || remaining[0] in delimiterMap ? this.word : null
  }
}

class Trie {
  constructor () {
    this.root = new TrieNode('')
  }

  insert (word, storedWord = null) {
    let node = this.root
    for (const [i, s] of word.split('').entries()) {
      if (!node.contains(s)) {
        node.addChild(
          new TrieNode(
            s,
            i != word.length - 1 ? null : storedWord ? storedWord : word
          )
        )
      } else if (i == word.length - 1) {
        node.updateStoredWord(storedWord ? storedWord : word)
      }
      node = node.getChild(s)
    }
  }

  contains (word) {
    let node = this.root
    for (const s of word.split('')) {
      if (!node.contains(s)) {
        return false
      }
      node = node.getChild(s)
    }
    return node.isWord
  }

  get wordList () {
    return this.root.wordList
  }

  findWords (text, delimiters = null) {
    let res = []
    for (let i = 0; i < text.length; ++i) {
      let foundWord = this.root.findBestMatch(
        text.substring(i),
        delimiters ? Helper.mapFromIterable(delimiters.split('')) : null
      )
      if (foundWord !== null) {
        res.push(foundWord)
      }
    }
    return res
  }
}

export { ApiError, ApiResult, Trie }
