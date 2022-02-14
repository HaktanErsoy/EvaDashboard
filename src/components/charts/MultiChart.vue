<template>
  <div>
    <highcharts :options="multiChartOptions"></highcharts>
  </div>
</template>

<script>
import { Chart } from "highcharts-vue";
import axios from "@/http/axios/index";
export default {
  components: {
    highcharts: Chart,
  },
  data: () => ({
    multiChartOptions: {
      chart: {
        zoomType: "xy",
      },
      title: {
        text: "Sales & Finance",
        align: "left",
      },
      xAxis: [
        {
          categories: [],
          crosshair: true,
        },
      ],
      yAxis: [
        {
          labels: {
            format: "${value}",
            style: {
              color: "#89A54E",
            },
          },
          title: {
            text: "Amount ($)",
            style: {
              color: "#89A54E",
            },
          },
        },
        {
          title: {
            text: "Quantity (Units)",
            style: {
              color: "#4572A7",
            },
          },
          labels: {
            format: "{value}",
            style: {
              color: "#4572A7",
            },
          },
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
      },

      plotOptions: {
        series: {
          cursor: "pointer",
          events: {
            click: () => {},
          },
        },
      },

      series: [
        {
          name: "Reimbursement",
          type: "column",
          yAxis: 0,
          data: [],
          tooltip: {
            valuePrefix: "$",
          },
        },
        {
          name: "Total Sales",
          type: "column",
          yAxis: 0,
          data: [],
          tooltip: {
            valuePrefix: "$",
          },
        },
        {
          name: "Total Refund",
          type: "column",
          yAxis: 0,
          data: [],
          tooltip: {
            valuePrefix: "$",
          },
        },
        {
          name: "Total Expense",
          type: "column",
          yAxis: 0,
          data: [],
          tooltip: {
            valuePrefix: "$",
          },
        },
        {
          name: "Quantity",
          type: "spline",
          yAxis: 1,
          data: [],
        },
        {
          name: "Avg. Sales",
          type: "column",
          yAxis: 0,
          data: [],
          tooltip: {
            valuePrefix: "$",
          },
        },
      ],
    },
  }),
  emits: ["update-pie-chart"],
  methods: {
    async fetchMultiAxisChartData() {
      const multiResponse = await axios.post("/data/sales-finances", {
        marketplace: "Amazon.com",
        sellerId: "A2AYEFBRNOKNF9",
      });

      multiResponse.data.Data.item.map((item) => {
        const itemData = {
          reimbursement: item.reimbursement,
          totalSales: item.totalSales,
          totalRefund: item.refund,
          totalExpenses: item.totalExpenses,
          quantity: item.itemQuantity,
          averageSales: item.avgSalesPrice,
        };

        this.multiChartOptions.xAxis[0].categories.push(item.date);

        Object.keys(itemData).forEach((key, index) => {
          this.multiChartOptions.series[index].data.push(itemData[key]);
        });
      });
    },
  },
  async mounted() {
    await this.fetchMultiAxisChartData();
    this.multiChartOptions.plotOptions.series.events.click = ({ point }) => {
      this.$root.$emit("update-pie-chart", point.category);
    };
  },
};
</script>

<style></style>
