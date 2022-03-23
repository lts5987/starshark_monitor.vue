<template>
  <div class="container-fluid">
    <div class="row pb-3">
      <div class="col-lg-6">
        <div class="card mt-3">
          <div class="card-header">Monitor StarShark</div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <button
                type="button"
                class="btn btn-primary"
                @click="loadStarShark()"
              >
                Refresh StarShark
              </button>
            </div>
            <div
              class="alert mb-0 mt-3"
              role="alert"
              :class="{
                'd-none': loadAlert == -1,
                'alert-warning': loadAlert == 0,
                'alert-success': loadAlert == 1,
              }"
            >
              {{ loadAlertText }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card mt-3">
          <div class="card-header">Add account to Monitor</div>
          <div class="card-body">
            <div class="mb-3">
              <label for="address" class="form-label">Account Address</label>
              <input
                type="text"
                class="form-control"
                :value="address"
                @input="(event) => (address = event.target.value)"
              />
            </div>
            <div class="mb-3">
              <label for="name" class="form-label">Account Name</label>
              <input
                type="text"
                class="form-control"
                :value="name"
                @input="(event) => (name = event.target.value)"
              />
            </div>
            <div class="d-grid gap-2\">
              <button
                type="button"
                class="btn btn-primary"
                @click="addAddress()"
              >
                Add Address
              </button>
            </div>
            <div
              class="alert mb-0 mt-3"
              role="alert"
              :class="{
                'd-none': addAlert == -1,
                'alert-warning': addAlert == 0,
                'alert-success': addAlert == 1,
              }"
            >
              {{ addAlertText }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <AccountBox
        v-for="account in savedAccounts"
        :key="account.owner"
        :data="account"
        @remove-address="removeAddress"
      ></AccountBox>
    </div>
  </div>
</template>

<script>
import StarShark from "@/assets/js/starshark";
import store from "@/store";
import AccountBox from "@/components/AccountBox.vue";

let starShark;

export default {
  name: "HomeView",
  components: {
    AccountBox,
  },
  data() {
    return {
      address: "",
      name: "",
      loadAlert: -1,
      loadAlertText: "",
      loadTimeout: null,
      addAlert: -1,
      addAlertText: "",
      addTimeout: null,
      savedAccounts: [],
    };
  },
  mounted() {
    starShark = new StarShark(this.setLoadAlert);
    store.commit("initSA");
  },
  methods: {
    loadStarShark() {
      starShark.getMultiAccSharks(store.state.savedAddress).then((accounts) => {
        this.savedAccounts = accounts;
        this.setLoadAlert("Loaded StarShark");
      });
    },
    addAddress() {
      let SA = store.state.savedAddress;
      if (
        starShark.web3.utils.isAddress(this.address) &&
        SA.map((d) => d.address).indexOf(this.address) === -1
      ) {
        store.commit("addSA", {
          address: this.address,
          name: this.name,
        });
        this.setAddAlert("Success add account");
        this.address = "";
        this.name = "";
      } else {
        if (!starShark.web3.utils.isAddress(this.address)) {
          this.setAddAlert("Account format wrong", 0);
        } else if (SA.map((d) => d.address).indexOf(this.address) !== -1) {
          this.setAddAlert("Account exist", 0);
        }
      }
    },
    removeAddress(address) {
      store.commit("removeSA", address);
      let newSavedAccounts = [];
      for (const key in this.savedAccounts) {
        if (this.savedAccounts[key].accData.address !== address) {
          newSavedAccounts.push(this.savedAccounts[key]);
        }
      }
      this.savedAccounts = newSavedAccounts;
    },
    setLoadAlert(text, type = 1) {
      clearTimeout(this.loadTimeout);
      this.loadAlertText = text;
      this.loadAlert = type;
      if (type == 1) {
        setTimeout(() => {
          this.loadAlert = -1;
        }, 5000);
      }
    },
    setAddAlert(text, type = 1) {
      clearTimeout(this.addTimeout);
      this.addAlertText = text;
      this.addAlert = type;
      if (type == 1) {
        setTimeout(() => {
          this.addAlert = -1;
        }, 5000);
      }
    },
  },
};
</script>

<style scoped>
</style>