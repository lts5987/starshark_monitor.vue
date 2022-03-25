<template>
  <div class="col">
    <div class="card">
      <div class="card-header">
        <div>
          {{ accData.name }}
        </div>
        <span class="spanaddr">{{ accData.address }}</span>
      </div>
      <div class="card-body">
        <ul class="list-group">
          <li
            class="list-group-item"
            v-for="shark in sharkData"
            :key="shark.shark_id"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      accData: {},
      sharkData: [],
    };
  },
  props: ["data"],
  mounted() {
    this.accData = this.data.accData;
    this.sharkData = this.data.sharkData;
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
