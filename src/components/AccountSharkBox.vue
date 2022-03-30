<template>
  <div class="col">
    <div class="card">
      <div
        class="card-header bg-white bg-opacity-10"
        @click="show[0] = !show[0]"
      >
        <div>
          {{ accData.name || "&nbsp;" }}
        </div>
        <span class="spanaddr">
          <a
            :href="`https://bscscan.com/address/${accData.address}`"
            target="_blank"
            >{{ accData.address }}</a
          >
        </span>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item" v-show="show[0]">
          <div class="d-flex justify-content-between">
            <div>BNB:</div>
            <div>{{ balanceData.BNB }}</div>
          </div>
          <hr />
          <div class="d-flex justify-content-between">
            <div>SEA:</div>
            <div>{{ balanceData.SEA }}</div>
          </div>
          <hr />
          <div class="d-flex justify-content-between">
            <div>SEA In Game:</div>
            <div>{{ balanceData.SeaInGame }}</div>
          </div>
          <hr />
          <div class="d-flex justify-content-between">
            <div>SSS:</div>
            <div>{{ balanceData.SSS }}</div>
          </div>
        </li>
        <li
          class="list-group-item bg-white bg-opacity-10"
          @click="show[1] = !show[1]"
          :class="{ 'remove-border-bottom-for-card': !show[1] }"
        >
          Sharks
        </li>
        <li
          class="list-group-item text-center"
          v-if="sharkData.length == 0 && show[1]"
        >
          No shark in this account
        </li>
        <li
          class="list-group-item"
          v-for="shark in sharkData"
          :key="shark.shark_id"
          v-show="show[1]"
          :class="{
            SharkRent:
              shark.sheet != null &&
              (shark.sheet.auto_rent_out == 1 || shark.sheet.auto_rent_in == 1),
          }"
        >
          <div>
            <a
              :href="'https://starsharks.com/market/sharks/' + shark.shark_id"
              target="_blank"
              >#{{ shark.shark_id }}</a
            >
            - Star:&nbsp;{{ shark.star }}
            <span
              style="float: right"
              :style="{ color: getPowerColor(shark.power, shark.star * 10) }"
            >
              {{ shark.power }}/{{ shark.star * 10 }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accData: {},
      balanceData: {},
      sharkData: [],
      show: [true, true],
    };
  },
  props: ["data"],
  mounted() {
    this.accData = this.data.accData;
    this.balanceData = this.data.balanceData;
    this.sharkData = this.data.sharkData;
    console.log(this.sharkData);
  },
  methods: {
    getPowerColor(power, maxpower) {
      if (power <= Math.round(maxpower / 3)) {
        return "var(--bs-green)";
      } else if (power <= Math.round(maxpower / 1.5)) {
        return "var(--bs-yellow)";
      } else if (power <= Math.round(maxpower / 1.1)) {
        return "var(--bs-orange)";
      } else {
        return "var(--bs-red)";
      }
    },
  },
};
</script>
