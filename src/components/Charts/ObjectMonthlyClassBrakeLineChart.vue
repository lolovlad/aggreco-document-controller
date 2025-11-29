<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import {defineComponent} from "vue";
import {Line} from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

export default defineComponent({
  name: "ObjectMonthlyClassBrakeLineChart",
  components: {
    Line
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
      // Группируем данные по месяцам и классам
      const monthsMap = new Map();
      const classNamesSet = new Set();
      
      this.data.forEach((item) => {
        if (item.month && item.class_brake_name && item.claim_count !== undefined) {
          if (!monthsMap.has(item.month)) {
            monthsMap.set(item.month, new Map());
          }
          monthsMap.get(item.month).set(item.class_brake_name, item.claim_count);
          classNamesSet.add(item.class_brake_name);
        }
      });
      
      // Сортируем месяцы
      const sortedMonths = Array.from(monthsMap.keys()).sort();
      
      // Форматируем месяцы для отображения
      const labels = sortedMonths.map(month => this.formatMonth(month));
      
      // Создаем датасеты для каждого класса
      const datasets = Array.from(classNamesSet).map((className, index) => {
        const dataValues = sortedMonths.map(month => {
          const classData = monthsMap.get(month);
          return classData && classData.has(className) ? classData.get(className) : 0;
        });
        
        return {
          label: className,
          data: dataValues,
          borderColor: this.generateColor(index),
          backgroundColor: this.generateColor(index),
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2
        };
      });
      
      return {
        labels: labels,
        datasets: datasets
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              padding: 10,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.parsed.y}`;
              }
            }
          }
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 60,
          },
        },
      };
    }
  },
  methods: {
    formatMonth(monthString) {
      if (!monthString) return '';
      
      const [year, month] = monthString.split('-');
      const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ];
      
      const monthIndex = parseInt(month, 10) - 1;
      const monthName = monthNames[monthIndex] || month;
      
      return `${monthName} ${year}`;
    },
    
    generateColor(index) {
      const hue = (index * 137.508) % 360;
      const saturation = 60 + (index % 3) * 10;
      const lightness = 45 + (index % 2) * 10;
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    },
    
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
      link.download = `object_monthly_class_brake_${new Date().toISOString().split('T')[0]}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
})
</script>

<template>
  <div class="line-chart-container">
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
      <Line
          ref="chartComponent"
          :data="chartData"
          :options="chartOptions"
      />
    </div>
  </div>
</template>

<style scoped>
.line-chart-container {
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

