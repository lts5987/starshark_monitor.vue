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
                hide: loadAlert == -1,
                'alert-warning': loadAlert == 0,
                'alert-success': loadAlert == 1,
              }"
            >
              {{ loadAlertText }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="starsharklist" class="row">
      <AccountBox
        v-for="account in savedAccounts"
        :key="account.owner"
        :data="account"
      ></AccountBox>
    </div>
  </div>
</template>

<script>
import AccountBox from "@/components/AccountBox.vue";

export default {
  name: "HomeView",
  components: {
    AccountBox,
  },
  data() {
    return {
      loadAlert: -1,
      loadAlertText: "",
      loadTimeout: null,
      savedAccounts: [],
    };
  },
  mounted() {
    this.StarShark.initSetLoadAlert(this.setLoadAlert);
    this.loadStarShark();
  },
  unmounted() {
    clearTimeout(this.loadAlert);
    clearTimeout(this.addAlert);
  },
  methods: {
    loadStarShark() {
      this.StarShark.getMultiAccSharks(
        this.$store.state.savedAddress
      ).then((accounts) => {
        this.savedAccounts = accounts;
        this.setLoadAlert("Loaded StarShark");
      });
    },
    setLoadAlert(text, type = 1) {
      console.log(this.loadTimeout);
      clearTimeout(this.loadTimeout);
      this.loadAlertText = text;
      this.loadAlert = type;
      if (type == 1) {
        this.loadTimeout = setTimeout(() => {
          this.loadAlert = -1;
        }, 5000);
      }
    },
  },
};
</script>