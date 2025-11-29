<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import {defineComponent} from "vue";
import {Bar} from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// Кастомный плагин для отображения значений на столбцах
const dataLabelsPlugin = {
  id: 'dataLabels',
  afterDatasetsDraw(chart) {
    const ctx = chart.ctx;
    ctx.save();
    
    const isHorizontal = chart.options.indexAxis === 'y';
    
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (!meta || !meta.data) {
        return;
      }
      
      meta.data.forEach((element, index) => {
        if (!element) {
          return;
        }
        
        const value = dataset.data[index];
        if (value !== null && value !== undefined) {
          let x, y;
          
          if (isHorizontal) {
            x = element.x + 12;
            y = element.y;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
          } else {
            x = element.x;
            y = element.y - 12;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
          }
          
          ctx.font = 'bold 12px Arial, sans-serif';
          ctx.fillStyle = '#333';
          
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
          
          ctx.fillText(String(value), x, y);
          
          ctx.shadowColor = 'transparent';
        }
      });
    });
    
    ctx.restore();
  }
};

ChartJS.register(dataLabelsPlugin);

export default defineComponent({
  name: "ObjectTypeBrakeBarChart",
  components: {
    Bar
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chartInstance: null
    }
  },
  mounted() {
    this.updateChartInstance();
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.updateChartInstance();
      }
    }
  },
  computed: {
    chartData() {
      const labels = [];
      const counts = [];

      this.data.forEach((item) => {
        if (item.type_brake_name && item.claim_count !== undefined) {
          labels.push(item.type_brake_name);
          counts.push(item.claim_count);
        }
      });

      return {
        labels: labels,
        datasets: [{
          label: 'Количество аварий',
          backgroundColor: "#c45850",
          data: counts,
          minBarLength: 7,
        }]
      };
    },
    chartOptions() {
      return {
        indexAxis: 'y',
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `Количество аварий: ${context.parsed.x}`;
              }
            }
          }
        },
        layout: {
          padding: {
            left: 60,
            right: 50,
            top: 20,
            bottom: 80,
          },
        },
      };
    }
  },
  methods: {
    updateChartInstance() {
      this.$nextTick(() => {
        const chartComponent = this.$refs.chartComponent;
        if (chartComponent) {
          this.chartInstance = chartComponent.$data?._chart || chartComponent.chartInstance;
        }
      });
    },
    
    exportToPNG() {
      setTimeout(() => {
        this.$nextTick(() => {
          let canvas = null;
          let chart = null;
          
          const chartComponent = this.$refs.chartComponent;
          if (chartComponent) {
            if (chartComponent.$el) {
              canvas = chartComponent.$el.querySelector('canvas') || chartComponent.$el;
            }
            if (chartComponent.$data && chartComponent.$data._chart) {
              chart = chartComponent.$data._chart;
              if (chart && chart.canvas) {
                canvas = chart.canvas;
              }
            }
          }
          
          if (!canvas && this.$refs.chartWrapper) {
            canvas = this.$refs.chartWrapper.querySelector('canvas');
          }
          
          if (!canvas) {
            canvas = this.$el?.querySelector('canvas');
          }
          
          if (!chart && ChartJS.instances && ChartJS.instances.size > 0) {
            const charts = Array.from(ChartJS.instances.values());
            if (charts.length > 0) {
              chart = charts[charts.length - 1];
              if (chart && chart.canvas) {
                canvas = chart.canvas;
              }
            }
          }

          if (!canvas) {
            console.error('Canvas element not found.');
            return;
          }

          if (!chart) {
            try {
              chart = ChartJS.getChart(canvas);
            } catch (e) {
              // Игнорируем ошибку
            }
          }

          if (chart && typeof chart.toBase64Image === 'function') {
            try {
              const url = chart.toBase64Image('image/png', 1);
              this.downloadImage(url);
              return;
            } catch (error) {
              console.warn('Failed to use chart.toBase64Image:', error);
            }
          }

          try {
            if (canvas && (canvas.tagName === 'CANVAS' || canvas instanceof HTMLCanvasElement)) {
              const url = canvas.toDataURL('image/png', 1.0);
              this.downloadImage(url);
            }
          } catch (e) {
            console.error('Failed to export chart:', e);
          }
        });
      }, 100);
    },

    downloadImage(url) {
      const link = document.createElement('a');
      link.download = `object_type_brake_${new Date().toISOString().split('T')[0]}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
})
</script>

<template>
  <div class="bar-chart-container">
    <div class="chart-type-selector">
      <v-spacer></v-spacer>
      <v-btn
          icon="mdi-download"
          variant="outlined"
          color="primary"
          @click="exportToPNG"
          title="Экспортировать в PNG"
          class="export-btn"
      >
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </div>
    <div ref="chartWrapper" class="chart-wrapper">
      <Bar
          ref="chartComponent"
          :data="chartData"
          :options="chartOptions"
      />
    </div>
  </div>
</template>

<style scoped>
.bar-chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 500px;
  overflow: visible;
}

.chart-type-selector {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  background-color: #fff;
}

.export-btn {
  width: 40px !important;
  min-width: 40px !important;
  height: 40px !important;
  padding: 0 !important;
}

.chart-wrapper {
  flex: 1;
  position: relative;
  min-height: 500px;
  height: 100%;
  padding: 16px;
  overflow: visible;
}

.chart-wrapper :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
}
</style>

