<template>
  <div v-if="!fetchState" class="pie-chart-content">
    <div class="pie-chart-area">
      <div class="pie-chart-select">
        <select v-model="requestDate">
          <option
            v-for="(option, optionIndex) in selectDateOptions"
            :key="optionIndex"
            v-bind:value="option"
          >
            {{ option.text }}
          </option>
        </select>
      </div>

      <highcharts class="pie-chart" :options="pieChartOptions"></highcharts>

      <div class="price-list">
        <div class="total-expense">
          <p>Total Expenses</p>
          <p>{{ `$${totalExpense}` }}</p>
        </div>
        <ul class="pie-chart-item-list">
          <li
            v-for="(expense, index) in pieChartOptions.series[0].data"
            :key="index"
          >
            <div
              class="pie-chart-item-dot"
              :style="{
                backgroundColor: pieChartOptions.series[0].data[index].color,
              }"
            ></div>
            <p class="expense-name">{{ expense.name }}</p>
            <p class="expense-value">${{ expense.y }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div v-else class="loading-container">
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import { Chart } from "highcharts-vue";
import axios from "@/http/axios/index";
import Highcharts from "highcharts";

export default {
  components: {
    highcharts: Chart,
  },

  data: () => ({
    fetchState: false,
    selectDateOptions: [],
    pieChartOptions: {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
      },
      title: {
        text: "Expenses & Refund",
        align: "left",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          },
        },
      },
      series: [
        {
          name: "Brands",
          colorByPoint: true,
          data: [],
        },
      ],
    },

    requestDate: {},
  }),
  computed: {
    totalExpense() {
      return this.pieChartOptions.series[0].data.reduce((acc, cur) => {
        return acc + cur.y;
      }, 0);
    },
  },
  async mounted() {
    await this.fetchSelectOptions();
    await this.fetchPieChartData();
    this.$root.$on("update-pie-chart", (event) => {
      this.requestDate = {
        text: new Date(event).toLocaleDateString("default", {
          month: "long",
        }),
        value: event,
      };
    });
  },
  watch: {
    async requestDate(n, o) {
      if (n !== o) {
        this.fetchState = true;
        await this.fetchPieChartData();
        this.fetchState = false;
      }
    },
  },

  methods: {
    async fetchPieChartData() {
      const responsePieChartData = [];
      const pieChartResponse = await axios.post(
        "/data/sales-expense-by-request-date",
        {
          marketplace: "Amazon.com",
          sellerId: "A2AYEFBRNOKNF9",
          date: {
            month:
              this.requestDate.text === "Last 30 Days"
                ? new Date().getMonth()
                : this.requestDate.value.split("-")[1],
            year: this.requestDate.value.split("-")[0],
          },
        }
      );
      pieChartResponse.data.Data.item.map((item, index) =>
        responsePieChartData.push({
          color: Highcharts.getOptions().colors[index],
          name: item.type,
          y: item.amount,
        })
      );
      this.pieChartOptions.series[0].data = responsePieChartData;
    },
    async fetchSelectOptions() {
      const multiResponse = await axios.post("/data/sales-finances", {
        marketplace: "Amazon.com",
        sellerId: "A2AYEFBRNOKNF9",
      });

      this.selectDateOptions = multiResponse.data.Data.item.map(
        (item, index) => {
          if (index === multiResponse.data.Data.item.length - 1) {
            return { text: "Last 30 Days", value: item.date };
          }
          return {
            text: new Date(item.date).toLocaleDateString("default", {
              month: "long",
            }),
            value: item.date,
          };
        }
      );
      this.requestDate = {
        text: "Last 30 Days",
        value: this.selectDateOptions[this.selectDateOptions.length - 1].value,
      };
    },
  },
};
</script>

<style lang="scss">
.pie-chart-area {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.total-expense {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  font-size: 18px;
}

select {
  border: none;
  font-size: 15px;
}

.price-list {
  flex: 1;
}

.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
}

.pie-chart-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.pie-chart-select {
  position: absolute;
  right: 10px;
  top: 10px;
}

.pie-chart {
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pie-chart-item-list {
  display: flex;
  justify-content: center;
  flex-direction: column;

  li {
    display: flex;
    align-items: center;

    .expense-name {
      flex: 1;
      margin-bottom: 3px;
    }
  }
}

.pie-chart-item-dot {
  width: 12px;
  height: 12px;
  border-radius: 1000px;
  margin-right: 10px;
}
</style>
