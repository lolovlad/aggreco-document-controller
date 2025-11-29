<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import {defineComponent} from "vue";
import {Bar, Pie} from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Кастомный плагин для отображения значений на столбцах
const dataLabelsPlugin = {
  id: 'dataLabels',
  afterDatasetsDraw(chart) {
    if (chart.config.type === 'pie') {
      return;
    }
    const ctx = chart.ctx;
    ctx.save();
    
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
          const x = element.x;
          const y = element.y - 12;
          
          if (y < 0 || y > chart.chartArea.top + chart.chartArea.height) {
            return;
          }
          
          ctx.font = 'bold 12px Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
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
  name: "ObjectClassBrakePieChart",
  components: {
    Bar,
    Pie
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    chartType: {
      type: String,
      default: 'bar',
      validator: (value) => ['bar', 'pie'].includes(value)
    }
  },
  emits: ['update:chartType'],
  computed: {
    chartData() {
      const labels = [];
      const counts = [];
      const backgroundColors = [];

      this.data.forEach((item, index) => {
        if (item.class_brake_name && item.claim_count !== undefined) {
          labels.push(item.class_brake_name);
          counts.push(item.claim_count);
          backgroundColors.push(this.generateColor(index));
        }
      });

      return {
        labels: labels,
        datasets: [{
          label: 'Количество аварий',
          backgroundColor: backgroundColors,
          borderColor: '#fff',
          borderWidth: 2,
          data: counts
        }]
      };
    },
    currentChartComponent() {
      if (this.chartType === 'bar') return Bar;
      if (this.chartType === 'pie') return Pie;
      return Bar;
    },
    chartOptions() {
      if (this.chartType === 'pie') {
        return {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.8,
          plugins: {
            legend: {
              display: true,
              position: 'right',
              align: 'start',
              maxWidth: 350,
              labels: {
                padding: 10,
                boxPadding: 6,
                font: {
                  size: 11,
                  family: 'Arial, sans-serif',
                  lineHeight: 1.4
                },
                usePointStyle: true,
                pointStyle: 'circle',
                boxWidth: 10,
                boxHeight: 10,
                generateLabels: (chart) => {
                  const data = chart.data;
                  if (data.labels.length === 0 || !data.datasets[0]) {
                    return [];
                  }
                  
                  return data.labels.map((label, index) => {
                    const value = data.datasets[0].data[index];
                    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    
                    let displayLabel = String(label);
                    if (displayLabel.length > 40) {
                      displayLabel = displayLabel.substring(0, 37) + '...';
                    }
                    
                    return {
                      text: `${displayLabel}: ${value} (${percentage}%)`,
                      fillStyle: data.datasets[0].backgroundColor[index],
                      strokeStyle: data.datasets[0].borderColor || '#fff',
                      lineWidth: data.datasets[0].borderWidth || 2,
                      hidden: false,
                      index: index
                    };
                  });
                }
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.parsed || context.raw;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        };
      }

      // Опции для Bar chart
      return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              font: {
                size: 10
              }
            }
          },
          y: {
            beginAtZero: true
          }
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 50,
            bottom: 40,
          },
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `Количество аварий: ${context.parsed.y}`;
              }
            }
          }
        }
      };
    }
  },
  methods: {
    generateColor(index) {
      const hue = (index * 137.508) % 360;
      const saturation = 60 + (index % 3) * 10;
      const lightness = 45 + (index % 2) * 10;
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    },
    handleChartTypeChange(type) {
      if (type !== this.chartType) {
        this.$emit('update:chartType', type);
      }
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
      link.download = `object_class_brake_${this.chartType}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
})
</script>

<template>
  <div class="chart-container">
    <!-- Переключатель типа графика -->
    <div class="chart-type-selector">
      <v-spacer></v-spacer>
      <v-btn-toggle
          :model-value="chartType"
          @update:model-value="handleChartTypeChange"
          mandatory
          variant="outlined"
          divided
          color="primary"
      >
        <v-btn value="bar" icon="mdi-chart-bar" title="Столбчатая диаграмма">
          <v-icon>mdi-chart-bar</v-icon>
        </v-btn>
        <v-btn value="pie" icon="mdi-chart-pie" title="Круговая диаграмма">
          <v-icon>mdi-chart-pie</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn
          icon="mdi-download"
          variant="outlined"
          color="primary"
          @click="exportToPNG"
          title="Экспортировать в PNG"
          class="ml-2 export-btn"
      >
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </div>

    <!-- График -->
    <div ref="chartWrapper" class="chart-wrapper" :class="{ 'pie-chart': chartType === 'pie' }">
      <component
          ref="chartComponent"
          :is="currentChartComponent"
          :data="chartData"
          :options="chartOptions"
      />
    </div>
  </div>
</template>

<style scoped>
.chart-container {
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

.chart-type-selector :deep(.v-btn) {
  min-width: 48px;
  height: 40px;
}

.chart-wrapper {
  flex: 1;
  position: relative;
  min-height: 450px;
  height: 100%;
  padding: 16px;
  overflow: visible;
}

.chart-wrapper :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
}

/* Специальные стили для pie диаграммы */
.chart-wrapper.pie-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 500px;
  overflow: visible;
}

.chart-wrapper.pie-chart :deep(canvas) {
  max-width: 650px !important;
  max-height: 550px !important;
}

.export-btn {
  width: 40px !important;
  min-width: 40px !important;
  height: 40px !important;
  padding: 0 !important;
}

.chart-wrapper :deep(.chartjs-legend) {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: visible;
  padding-right: 10px;
}

.chart-wrapper :deep(.chartjs-legend li) {
  margin-bottom: 4px !important;
  line-height: 1.4 !important;
  word-wrap: break-word;
  white-space: normal;
  max-width: 100%;
}
</style>
