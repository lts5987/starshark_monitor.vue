<<<<<<< Updated upstream
import { createStore } from 'vuex'
=======
import jwtDecode from 'jwt-decode';
import { createStore } from 'vuex';
>>>>>>> Stashed changes

function updateSA(data) {
  localStorage.setItem('savedAddress', JSON.stringify(data))
}

export default createStore({
  state: {
<<<<<<< Updated upstream
    savedAddress: []
  },
  getters: {
=======
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
          d.authorization_decode = jwtDecode(d.authorization)
          d.qr_code_decode = jwtDecode(d.qr_code)
          d.exp = Math.min(...[d.authorization_decode.exp, d.qr_code_decode.exp])
        }
        return d
      })
    }
>>>>>>> Stashed changes
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
    removeSA(state, address) {
      let newSavedAddress = []
      for (const key in state.savedAddress) {
        if (state.savedAddress[key].address !== address) {
          newSavedAddress.push(state.savedAddress[key])
        }
      }
      state.savedAddress = newSavedAddress
      updateSA(state.savedAddress)
    }
  },
  actions: {
  },
  modules: {
  }
})
