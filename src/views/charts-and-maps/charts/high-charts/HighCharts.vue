<template>
  <section>
    <p>{{ userToken || "yo" }}</p>
    <div class="multi-chart-container">
      <MultiChart />
    </div>
    <div>
      <div class="pie-chart-container">
        <PieChart />
      </div>
    </div>
  </section>
</template>

<script>
import MultiChart from "@/components/charts/MultiChart";
import PieChart from "@/components/charts/PieChart";

export default {
  components: {
    MultiChart,
    PieChart,
  },

  data: () => ({
    selectDateOptions: [],
  }),
  computed: {
    userToken() {
      return this.$store.getters.userToken;
    },
  },
  async mounted() {},
  methods: {
    async updatePieChart() {
      await this.fetchPieChartData();
    },
  },
};
</script>

<style lang="scss">
.multi-chart-container {
  margin-bottom: 80px;
}

.pie-chart-container {
  padding: 40px;
  position: relative;
  width: 100%;
  display: flex;
  background: white;
  height: 500px;
}
</style>
