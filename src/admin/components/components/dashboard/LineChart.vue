<script>
import { Line } from 'vue-chartjs'
export default {
  extends: Line,
  props: {
    chartdata: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      chartOptions: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
            gridLines: {
              display: true,
            },
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
            },
            gridLines: {
              display: false,
            },
          }],
        },
        legend: {
          display: true,
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label(tooltipItems, data) {
              const { datasetIndex, index } = tooltipItems;
              const value = data.datasets[datasetIndex].data[index];
              if (parseInt(value, 10) > 999) {
                return ` ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
              }
              return ` ${value}`;
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        height: 300,
      },
    };
  },
  mounted() {
      // параметры https://www.chartjs.org/docs/latest/charts/line.html
      this.renderChart(this.chartdata, this.chartOptions)
  }
};
</script>