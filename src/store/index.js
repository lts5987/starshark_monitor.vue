import { JWTdecode } from '@/assets/js/function';
import { createStore } from 'vuex';

function updateSA(data) {
  localStorage.setItem('savedAddress', JSON.stringify(data))
}

export default createStore({
  state: {
    packageVersion: process.env.PACKAGE_VERSION || '0.1.0',
    savedAddress: [],
  },
  getters: {
    appVersion: (state) => {
      return state.packageVersion
    },
    savedAddressDecode(state) {
      return state.savedAddress.map(d => {
        if (d.authorization != undefined) {
          d = JWTdecode(d)
        }
        return d
      })
    }
  },
  mutations: {
    initSA(state) {
      let savedAddressTmp = localStorage.getItem('savedAddress')
      if (savedAddressTmp == null) {
        updateSA(state.savedAddress)
      } else {
        state.savedAddress = JSON.parse(savedAddressTmp)
      }
    },
    addSA(state, data) {
      state.savedAddress.push(data)
      updateSA(state.savedAddress)
    },
    updateSA(state, arr) {
      state.savedAddress[arr.index] = arr.data
      updateSA(state.savedAddress)
    },
    removeSA(state, address) {
      for (const key in state.savedAddress) {
        if (state.savedAddress[key].address == address) {
          state.savedAddress.splice(key, 1)
          break
        }
      }
      updateSA(state.savedAddress)
    },
    moveUpSA(state, address) {
      for (const key in state.savedAddress) {
        if (state.savedAddress[key].address == address) {
          let toMove = state.savedAddress.splice(key, 1)
          state.savedAddress.splice(key - 1, 0, toMove[0])
          break
        }
      }
      updateSA(state.savedAddress)
    },
    moveDownSA(state, address) {
      for (const key in state.savedAddress) {
        if (state.savedAddress[key].address == address) {
          let toMove = state.savedAddress.splice(key, 1)
          state.savedAddress.splice(key + 1, 0, toMove[0])
          break
        }
      }
      updateSA(state.savedAddress)
    },
  },
  actions: {
  },
  modules: {
  }
})
