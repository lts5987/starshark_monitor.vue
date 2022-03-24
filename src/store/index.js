import { createStore } from 'vuex'

function updateSA(data) {
  localStorage.setItem('savedAddress', JSON.stringify(data))
}

export default createStore({
  state: {
    savedAddress: [],
  },
  getters: {
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
