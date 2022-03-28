<template>
  <div class="row row-cols-1 g-3">
    <div class="col">
      <div class="card">
        <div
          class="
            card-header
            bg-white bg-opacity-10
            d-flex
            justify-content-between
          "
          @click="showcardbody[0] = !showcardbody[0]"
          :class="{ 'remove-border-bottom-for-card': !showcardbody[0] }"
        >
          <div>Options</div>
          <div v-if="timerEnable">Auto Refresh Countdown: {{ showTimer }}</div>
        </div>
        <div class="card-body" v-show="showcardbody[0]">
          <div class="d-grid gap-3">
            <div class="row row-cols-1 row-cols-md-2 g-3 mb-3">
              <div class="col">
                <label for="countdown" class="form-label">
                  Auto Refresh Interval(Minute)
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="countdown"
                  :value="timer"
                  @change="
                    (event) => {
                      timer = event.target.value;
                    }
                  "
                />
              </div>
              <div class="col">
                <label class="form-label">Enable Auto Refresh</label>
                <div class="form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    :checked="timerEnable"
                    @input="setTimerEnable"
                  />
                </div>
              </div>
            </div>
          </div>
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
      :key="account.accData.address"
      :data="account"
    ></AccountBox>
  </div>
</template>

<script>
import AccountBox from "@/components/AccountBox.vue";
import { secConversion } from "@/assets/js/function";

export default {
  name: "MonitorView",
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
      countdown: null,
      timer: 10,
      currentTimer: 10 * 60,
      timerEnable: true,
    };
  },
  computed: {
    showTimer() {
      return secConversion(this.currentTimer);
    },
  },
  mounted() {
    this.timer = parseInt(localStorage.getItem("autoRefreshTimer")) || 10;
    this.currentTimer = this.timer * 60;
    this.timerEnable = localStorage.getItem("autoRefreshEnable");
    if (this.timerEnable === null) this.timerEnable = true;
    else this.timerEnable = this.timerEnable === "true";
    this.StarShark.initSetLoadAlert(this.setLoadAlert);
    this.loadStarShark();
    this.countdown = setInterval(() => {
      if (this.timerEnable) {
        this.currentTimer--;
        if (this.currentTimer == 0) {
          this.loadStarShark();
        }
      }
    }, 1000);
  },
  unmounted() {
    clearTimeout(this.loadAlert);
    clearTimeout(this.addAlert);
    clearInterval(this.countdown);
  },
  watch: {
    timer(data) {
      localStorage.setItem("autoRefreshTimer", data);
    },
    timerEnable(data) {
      localStorage.setItem("autoRefreshEnable", data);
    },
  },
  methods: {
    loadStarShark() {
      this.StarShark.getMultiAccSharks(this.$store.state.savedAddress).then(
        (accounts) => {
          this.savedAccounts = accounts;
          this.setLoadAlert("Loaded StarShark");
          this.currentTimer = this.timer * 60;
        }
      );
    },
    setLoadAlert(text, type = 1) {
      clearTimeout(this.loadTimeout);
      this.loadAlertText = text;
      this.loadAlert = type;
      if (type == 1) {
        this.loadTimeout = setTimeout(() => {
          this.loadAlert = -1;
        }, 5000);
      }
    },
    setTimerEnable(event) {
      this.timerEnable = event.target.checked;
    },
  },
};
</script>