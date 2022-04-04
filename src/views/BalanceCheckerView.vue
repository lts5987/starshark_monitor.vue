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
                  min="1"
                  :value="timer"
                  @input="setTimer"
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
              @click="loadAccounts()"
            >
              Refresh Accounts
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
    <div class="col">
      <div class="card">
        <table class="table table-dark table-hover table-striped">
          <thead>
            <th scope="col" class="text-center">#</th>
            <th scope="col" class="text-center">Name</th>
            <th scope="col" class="text-center">Address</th>
            <th scope="col" class="text-center">BNB</th>
            <th scope="col" class="text-center">SEA</th>
            <th scope="col" class="text-center">SEA In Game</th>
            <th scope="col" class="text-center">SSS</th>
            <th scope="col" class="text-center">SNFT</th>
          </thead>
          <tbody>
            <tr
              v-for="(account, i) in savedAccounts"
              :key="account.accData.address"
            >
              <th scope="row">{{ i }}.</th>
              <td>
                {{ account.accData.name }}
              </td>
              <td>
                <a
                  :href="`https://bscscan.com/address/${account.accData.address}`"
                  target="_blank"
                >
                  {{ account.accData.address }}
                </a>
              </td>
              <td
                class="text-end"
                :class="{
                  'text-info': account.balanceData.BNB != '0.00000000',
                }"
              >
                {{ account.balanceData.BNB }}
              </td>
              <td
                class="text-end"
                :class="{
                  'text-info': account.balanceData.SEA != '0.00000000',
                }"
              >
                {{ account.balanceData.SEA }}
              </td>
              <td
                class="text-end"
                :class="{
                  'text-info':
                    account.balanceData.SeaInGame != '0.00' &&
                    account.balanceData.SeaInGame != '--',
                }"
              >
                {{ account.balanceData.SeaInGame }}
              </td>
              <td
                class="text-end"
                :class="{
                  'text-info': account.balanceData.SSS != '0.00000000',
                }"
              >
                {{ account.balanceData.SSS }}
              </td>
              <td
                class="text-end"
                :class="{ 'text-info': account.sharkAmount > 0 }"
              >
                {{ account.sharkAmount }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { secConversion } from "@/assets/js/function";
export default {
  name: "BalanceCheckerView",
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
    this.timer = parseInt(localStorage.getItem("autoRefreshTimer2")) || 10;
    this.currentTimer = this.timer * 60;
    this.timerEnable = localStorage.getItem("autoRefreshEnable2");
    if (this.timerEnable === null) this.timerEnable = false;
    else this.timerEnable = this.timerEnable === "true";
    this.StarSharks.initSetLoadAlert(this.setLoadAlert);
    this.loadAccounts();
    this.countdown = setInterval(() => {
      if (this.timerEnable) {
        this.currentTimer--;
        if (this.currentTimer == 0) {
          this.loadAccounts();
        }
      }
    }, 1000);
  },
  unmounted() {
    clearTimeout(this.loadAlert);
    clearInterval(this.countdown);
  },
  methods: {
    loadAccounts() {
      this.StarSharks.getMultiAccs(this.$store.state.savedAddress).then(
        (accounts) => {
          this.savedAccounts = accounts;
          if (this.savedAccounts.length > 0)
            this.setLoadAlert("Loaded Accounts");
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
        }, 3000);
      }
    },
    setTimer(event) {
      this.timer = event.target.value;
      localStorage.setItem("autoRefreshTimer2", this.timer || 10);
    },
    setTimerEnable(event) {
      this.timerEnable = event.target.checked;
      localStorage.setItem("autoRefreshEnable2", this.timerEnable);
    },
  },
};
</script>
<style scoped>
textarea {
  width: 100%;
}
</style>