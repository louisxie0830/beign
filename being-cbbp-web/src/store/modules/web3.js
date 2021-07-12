import Web3 from 'web3'
import { confirmUser, addressName, checkUserRoleCanRegister } from '@/api/account'
import { getAction } from '@/utils/util'
const ABI = [
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    constant: true,
    inputs: [],
    name: 'getOwner',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'user',
        type: 'address'
      },
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'title',
        type: 'string'
      },
      {
        name: 't',
        type: 'uint256'
      }
    ],
    name: 'register',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'user',
        type: 'address'
      }
    ],
    name: 'removeAdmin',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_user',
        type: 'address'
      },
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'title',
        type: 'string'
      },
      {
        name: 't',
        type: 'uint256'
      }
    ],
    name: 'addAdmin',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'user',
        type: 'address'
      }
    ],
    name: 'removeUser',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getUserInfo',
    outputs: [
      {
        name: '',
        type: 'string'
      },
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getAdmins',
    outputs: [
      {
        name: '',
        type: 'address[]'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getUsers',
    outputs: [
      {
        name: '',
        type: 'address[]'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'fileHash',
        type: 'string'
      },
      {
        name: 'action',
        type: 'uint8'
      },
      {
        name: 't',
        type: 'uint256'
      }
    ],
    name: 'signDocument',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'shipmentNo',
        type: 'string'
      },
      {
        name: 'action',
        type: 'uint8'
      },
      {
        name: 't',
        type: 'uint256'
      }
    ],
    name: 'signShipment',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'fileHash',
        type: 'string'
      }
    ],
    name: 'getDocumentInfo',
    outputs: [
      {
        name: '',
        type: 'address[]'
      },
      {
        name: '',
        type: 'uint8[]'
      },
      {
        name: '',
        type: 'uint256[]'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'shipmentNo',
        type: 'string'
      }
    ],
    name: 'getShipmentInfo',
    outputs: [
      {
        name: '',
        type: 'address[]'
      },
      {
        name: '',
        type: 'uint8[]'
      },
      {
        name: '',
        type: 'uint256[]'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
]

const endpoint = process.env.WEB3_ENDPOINT || 'https://chain.cbbpweb.com'
const web3 = new Web3(new Web3.providers.HttpProvider(endpoint))
const contractAddress = process.env.WEB3_CONTRACT_ADDRESS || '0xF78A4948a6Fd09CA0798f2B5006615d25656124c'
const contractInstance = new web3.eth.Contract(ABI, contractAddress)
const web3Store = {
  state: {
    web3,
    contractInstance,
    privateKey: '',
    address: '',
    encrypt: {},
    decrypt: false,
    showWeb3PasswordModal: false,
    web3Loading: false
  },

  mutations: {
    setAccountWeb3 (state, opt) {
      state.privateKey = opt.privateKey
      state.address = opt.address
      state.encrypt = opt.encrypt
    },
    changeDecrypt (state, opt) {
      state.decrypt = opt
    },
    showModel (state, opt) {
      state.showWeb3PasswordModal = opt
    },
    hideModel (state, opt) {
      state.showWeb3PasswordModal = opt
    },
    setWeb3Loading (state, data) {
      state.web3Loading = data
    }
  },

  actions: {
    openDecryptModal ({ commit }) {
      commit('showModel', true)
    },
    closeDecryptModal ({ commit }) {
      commit('hideModel', false)
    },
    getAddressName ({ commit }, { address }) {
      return addressName({ address })
    },
    handleWeb3Decrypt ({ dispatch, state }) {
      if (!state.decrypt) {
        return new Promise((resolve, reject) => {
          dispatch('openDecryptModal')
          // eslint-disable-next-line prefer-promise-reject-errors
          reject()
        })
      }
    },
    decrypt ({ commit }, { keyStore, password }) {
      return new Promise((resolve, reject) => {
        const decryptData = web3.eth.accounts.decrypt(keyStore, password)
        const account = web3.eth.accounts.privateKeyToAccount(decryptData.privateKey)
        web3.eth.accounts.wallet.add(account.privateKey)
        web3.eth.defaultAccount = account.address
        console.log('decryptData', decryptData)
        commit('changeDecrypt', true)
        resolve()
      })
    },
    // testAccount () {
    //   const account = [
    //     'customs',
    //     'importer1',
    //     'customsbroker1',
    //     'consignee',
    //     'customs1',
    //     'customs2',
    //     'customsda3',
    //     'customsda1',
    //     'customsda2',
    //     'customsbroker2',
    //     'customsbroker3',
    //     'customsbroker4'
    //   ]
    //   const map = {}
    //   account.map(item => {
    //     const createAccount = web3.eth.accounts.create()
    //     const encrypt = web3.eth.accounts.encrypt(createAccount.privateKey, item)
    //     map[item] = encrypt
    //     console.log(encrypt, item)
    //   })
    //   console.log(JSON.stringify(map))
    // },
    generateKeys ({ commit }, { keyPassword, password, username, code, role, isCreateAccount }) {
      console.log(
        'generateKeys parameter: keyPassword=' +
          keyPassword +
          ', password=' +
          password +
          ', username=' +
          username +
          ', role=' +
          role
      )
      return new Promise((resolve, reject) => {
        checkUserRoleCanRegister({ username, role })
          .then(res => {
            // console.log('checkUserRole res', res)
            const createAccount = web3.eth.accounts.create()
            const encrypt = web3.eth.accounts.encrypt(createAccount.privateKey, keyPassword)
            const keyStore = JSON.stringify(encrypt)
            const data = `address=${
              createAccount.address
            }&code=${code}&keyStore=${keyStore}&password=${keyPassword}&username=${username}&role=${role}`
            const sign = web3.eth.accounts.sign(data, createAccount.privateKey)
            const opt = {
              signature: sign.signature,
              address: createAccount.address,
              keyStore,
              username,
              password,
              keyPassword,
              code,
              role,
              isCreateAccount
            }
            commit('setAccountWeb3', {
              privateKey: createAccount.privateKey,
              address: createAccount.address,
              encrypt
            })
            confirmUser(opt)
              .then(() => {
                resolve()
              })
              .catch(err => {
                reject(err)
              })
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    async getDocumentInfo ({ commit }, { fileHash }) {
      return new Promise((resolve, reject) => {
        console.log('getDocumentInfo fileHash', fileHash)
        console.log('getDocumentInfo defaultAccount', web3.eth.defaultAccount)
        contractInstance.methods
          .getDocumentInfo(fileHash)
          .call({ from: web3.eth.defaultAccount })
          .then(function (result) {
            console.log('result', result)
            const list = []
            for (let i = 0; i < result[0].length; i++) {
              const item = {}
              item.address = result[0][i]
              item.action = result[1][i]
              item.time = result[2][i]
              list.push(item)
            }
            resolve(list)
          })
      })
    },
    async getShipmentInfo ({ commit }, { shipmentNo }) {
      contractInstance.methods
        .getShipmentInfo(shipmentNo)
        .call({ from: web3.eth.defaultAccount })
        .then(function (result) {})
    },
    async getUserInfo () {
      contractInstance.methods
        .getUserInfo()
        .call({ from: web3.eth.defaultAccount })
        .then(function (result) {})
    },
    async signAll ({ dispatch, commit }, { action, shipmentList }) {
      commit('setWeb3Loading', true) // 上链开始
      // 所有的shipment操作action与documents保持一致
      const actionType = getAction(action)
      for (let i = 0; i < shipmentList.length; i++) {
        // shipment上链
        await contractInstance.methods
          .signShipment(shipmentList[i].shipmentNo, actionType, Date.now())
          .send({
            from: web3.eth.defaultAccount,
            gas: 5000000,
            gasPrice: 0
          })
          .on('receipt', function (receipt) {
            console.log('signShipment', i, receipt)
          })
          .on('error', err => {
            dispatch('errHandler', err)
            console.error(err)
            commit('setWeb3Loading', false)
          })
        // documents上链
        const documents = shipmentList[i].documents
        for (let i = 0; i < documents.length; i++) {
          await contractInstance.methods
            .signDocument(documents[i].fileHash, actionType, Date.now())
            .send({
              from: web3.eth.defaultAccount,
              gas: 5000000,
              gasPrice: 0
            })
            .on('receipt', function (receipt) {
              console.log('signAll(documents)', i, receipt)
            })
            .on('error', err => {
              dispatch('errHandler', err)
              console.error(err)
              commit('setWeb3Loading', false)
            })
        }
      }
      commit('setWeb3Loading', false) // 上链结束
    },
    async signShipment ({ commit, dispatch }, { shipmentNo, action, t }) {
      // const gas = await contractInstance.methods
      //   .signShipment(shipmentNo, action, t)
      //   .estimateGas()
      commit('setWeb3Loading', true) // 上链开始
      return new Promise((resolve, reject) => {
        contractInstance.methods
          .signShipment(shipmentNo, action, t)
          .send({
            from: web3.eth.defaultAccount,
            gas: 5000000,
            gasPrice: 0
          })
          .on('receipt', function (receipt) {
            commit('setWeb3Loading', false) // 上链结束
            resolve(receipt)
          })
          .on('error', err => {
            dispatch('errHandler', err)
            commit('setWeb3Loading', false) // 上链结束
            console.error(err)
          })
      })
    },
    async signShipmentList ({ commit, dispatch }, { shipment }) {
      for (let i = 0; i < shipment.length; i++) {
        await new Promise((resolve, reject) => {
          console.log('shipment', i)
          contractInstance.methods
            .signShipment(shipment[i].shipmentNo, shipment[i].action, Date.now())
            .send({
              from: web3.eth.defaultAccount,
              gas: 5000000,
              gasPrice: 0
            })
            .on('receipt', function (receipt) {
              resolve(receipt)
            })
            .on('error', err => {
              dispatch('errHandler', err)
              console.error(err)
            })
        })
      }
    },
    async signDocument ({ commit, dispatch }, { fileHash, action, t }) {
      // const gas = await contractInstance.methods
      //   .signDocument(fileHash, action, t)
      //   .estimateGas()
      commit('setWeb3Loading', true) // 上链开始
      return new Promise((resolve, reject) => {
        contractInstance.methods
          .signDocument(fileHash, action, t)
          .send({
            from: web3.eth.defaultAccount,
            gas: 5000000,
            gasPrice: 0
          })
          .on('receipt', function (receipt) {
            console.log('signDocument', receipt)
            commit('setWeb3Loading', false) // 上链结束
            resolve(receipt)
          })
          .on('error', err => {
            dispatch('errHandler', err)
            commit('setWeb3Loading', false) // 上链结束
            console.error(err)
          })
      })
    },
    async signDocumentListSpecifyAction ({ commit, dispatch }, { documents, action, t }) {
      console.log('signDocumentList', documents)
      const resultsOk = []
      const resultsErr = []
      for (let i = 0; i < documents.length; i++) {
        await contractInstance.methods
          .signDocument(documents[i].fileHash, action, t)
          .send({
            from: web3.eth.defaultAccount,
            gas: 5000000,
            gasPrice: 0
          })
          .on('receipt', function (receipt) {
            console.log('signDocumentListSpecifyAction', receipt)
            resultsOk.push(receipt)
          })
          .on('error', err => {
            dispatch('errHandler', err)
            console.error(err)
            resultsErr.push(err)
          })
      }
      return new Promise((resolve, reject) => {
        if (resultsErr.length > 0) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            ok: resultsOk,
            error: resultsErr
          })
        } else {
          resolve({
            ok: resultsOk,
            error: resultsErr
          })
        }
      })
    },
    async signDocumentList ({ commit, dispatch }, { documents, t }) {
      const defaultAction = getAction('signDocument')
      dispatch('signDocumentListSpecifyAction', { documents, action: defaultAction, t })
    }
  }
}

export default web3Store
