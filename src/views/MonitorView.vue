<template>
  <div class="row row-cols-1 g-3">
    <div class="col">
      <div class="card" :class="{ 'hide-body': !showcardbody[0] }">
        <div class="card-header" @click="showcardbody[0] = !showcardbody[0]">
          Options
        </div>
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
  <div
    id="starsharklist"
    class="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-3 pt-3"
  >
    <AccountBox
      v-for="account in savedAccounts"
      :key="account.owner"
      :data="account"
    ></AccountBox>
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
      showcardbody: [true],
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
      this.StarShark.getMultiAccSharks(this.$store.state.savedAddress).then(
        (accounts) => {
          this.savedAccounts = accounts;
          this.setLoadAlert("Loaded StarShark");
        }
      );
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