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
    // Для pie chart не отображаем значения (используем легенду)
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
        // Отображаем все значения, включая 0
        if (value !== null && value !== undefined) {
          const x = element.x;
          // Увеличиваем отступ сверху, чтобы цифры не обрезались
          const y = element.y - 12;
          
          // Проверяем, что координаты в пределах canvas
          if (y < 0 || y > chart.chartArea.top + chart.chartArea.height) {
            return;
          }
          
          // Настройка стиля текста
          ctx.font = 'bold 12px Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = '#333';
          
          // Добавляем тень для лучшей читаемости
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
          
          ctx.fillText(String(value), x, y);
          
          // Сбрасываем тень
          ctx.shadowColor = 'transparent';
        }
      });
    });
    
    ctx.restore();
  }
};

ChartJS.register(dataLabelsPlugin);

export default defineComponent({
  name: "MonthlyObjectChart",
  components: {
    Bar,
    Pie
  },
  props: {
    data: {
      type: Object,
      default: () => ({
        months: []
      })
    },
    chartType: {
      type: String,
      default: 'bar',
      validator: (value) => ['bar', 'pie'].includes(value)
    }
  },
  emits: ['update:chartType'],
  data() {
    return {
      chartRefs: {} // Хранилище для refs графиков
    }
  },
  computed: {
    monthsList() {
      if (!this.data || !this.data.months || !Array.isArray(this.data.months)) {
        return [];
      }
      return this.data.months;
    },
    currentChartComponent() {
      if (this.chartType === 'bar') return Bar;
      if (this.chartType === 'pie') return Pie;
      return Bar;
    }
  },
  methods: {
    /**
     * Получить данные для конкретного месяца
     */
    getMonthData(monthData) {
      if (!monthData || !monthData.objects || !Array.isArray(monthData.objects)) {
        return {
          labels: [],
          datasets: []
        };
      }

      const labels = [];
      const data = [];
      const backgroundColors = [];

      monthData.objects.forEach((obj, index) => {
        if (obj.object_name && obj.claim_count !== undefined) {
          labels.push(obj.object_name);
          data.push(obj.claim_count);
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
          data: data,
          minBarLength: 2
        }]
      };
    },

    /**
     * Форматирование месяца из формата "YYYY-MM" в читаемый вид
     */
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

    /**
     * Генерация цвета для объекта
     */
    generateColor(index) {
      const hue = (index * 137.508) % 360;
      const saturation = 60 + (index % 3) * 10;
      const lightness = 45 + (index % 2) * 10;
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    },

    /**
     * Получить опции для графика
     */
    getChartOptions() {
      if (this.chartType === 'pie') {
        return {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.5,
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
                    
                    // Увеличиваем лимит символов для лучшего отображения
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
          mode: 'index'
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
    },

    handleChartTypeChange(type) {
      if (type !== this.chartType) {
        this.$emit('update:chartType', type);
      }
    },

    /**
     * Экспорт конкретного графика в PNG
     */
    exportChartToPNG(monthIndex, monthString) {
      setTimeout(() => {
        this.$nextTick(() => {
          let canvas = null;
          let chart = null;
          
          // Ищем canvas в конкретной карточке графика
          const chartCard = this.$el?.querySelectorAll('.month-chart-card')[monthIndex];
          if (chartCard) {
            canvas = chartCard.querySelector('canvas');
          }
          
          // Если не нашли через карточку, пробуем через ref
          if (!canvas) {
            const chartRef = this.chartRefs[`chart_${monthIndex}`];
            if (chartRef) {
              if (chartRef.$el) {
                canvas = chartRef.$el.querySelector('canvas') || chartRef.$el;
              }
              if (chartRef.$data && chartRef.$data._chart) {
                chart = chartRef.$data._chart;
                if (chart && chart.canvas) {
                  canvas = chart.canvas;
                }
              }
            }
          }
          
          // Пробуем найти через Chart.js registry
          if (!canvas && ChartJS.instances && ChartJS.instances.size > 0) {
            const charts = Array.from(ChartJS.instances.values());
            // Берем график по индексу (если порядок совпадает)
            if (charts[monthIndex]) {
              chart = charts[monthIndex];
              if (chart && chart.canvas) {
                canvas = chart.canvas;
              }
            }
          }
          
          if (!canvas) {
            console.error(`Canvas element not found for chart ${monthIndex}`);
            return;
          }

          // Пробуем получить chart через Chart.js
          if (!chart) {
            try {
              chart = ChartJS.getChart(canvas);
            } catch (e) {
              // Игнорируем ошибку
            }
          }

          // Экспортируем через chart instance
          if (chart && typeof chart.toBase64Image === 'function') {
            try {
              const url = chart.toBase64Image('image/png', 1);
              this.downloadImage(url, monthString);
              return;
            } catch (error) {
              console.warn('Failed to use chart.toBase64Image, using canvas directly:', error);
            }
          }

          // Альтернативный способ - используем canvas напрямую
          try {
            if (canvas && (canvas.tagName === 'CANVAS' || canvas instanceof HTMLCanvasElement)) {
              const url = canvas.toDataURL('image/png', 1.0);
              this.downloadImage(url, monthString);
            } else {
              console.error('Element is not a canvas:', canvas);
            }
          } catch (e) {
            console.error('Failed to export chart:', e);
          }
        });
      }, 100);
    },

    /**
     * Скачивание изображения
     */
    downloadImage(url, monthString) {
      const link = document.createElement('a');
      const monthLabel = monthString ? monthString.replace(/\s+/g, '_') : 'monthly';
      link.download = `monthly_statistic_${monthLabel}_${this.chartType}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = url;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
})
</script>

<template>
  <div class="monthly-chart-container">
    <!-- Панель управления -->
    <div class="chart-controls">
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
    </div>

    <!-- Список диаграмм по месяцам -->
    <div v-if="monthsList.length > 0" class="charts-list">
      <div
          v-for="(monthData, index) in monthsList"
          :key="monthData.month || index"
          class="month-chart-card"
      >
        <v-card variant="outlined" class="chart-card">
          <v-card-title class="chart-title">
            <span>{{ formatMonth(monthData.month) }}</span>
            <v-spacer></v-spacer>
            <v-btn
                icon="mdi-download"
                variant="text"
                size="small"
                color="primary"
                @click="exportChartToPNG(index, monthData.month)"
                title="Скачать график"
                class="download-btn"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="chart-content">
            <div class="chart-wrapper">
              <component
                  :ref="el => { if (el) chartRefs[`chart_${index}`] = el }"
                  :is="currentChartComponent"
                  :data="getMonthData(monthData)"
                  :options="getChartOptions()"
              />
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <div v-else class="no-data">
      <v-alert type="info" variant="tonal">
        Нет данных для отображения
      </v-alert>
    </div>
  </div>
</template>

<style scoped>
.monthly-chart-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.chart-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 0 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  margin-bottom: 16px;
}

.chart-controls :deep(.v-btn) {
  min-width: 48px;
  height: 40px;
}

.charts-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.month-chart-card {
  width: 100%;
}

.chart-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 450px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  background-color: rgba(0, 0, 0, 0.02);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.download-btn {
  margin-left: 8px;
}

.chart-content {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-height: 400px;
  overflow: visible;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 400px;
  height: 450px;
  padding: 16px;
  overflow: visible !important;
}

.chart-wrapper :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
}

/* Улучшаем отображение легенды для pie диаграммы */
.chart-wrapper :deep(.chartjs-legend) {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: visible;
  padding-right: 10px;
}

.chart-wrapper :deep(.chartjs-legend ul) {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chart-wrapper :deep(.chartjs-legend li) {
  margin-bottom: 4px !important;
  line-height: 1.4 !important;
  word-wrap: break-word;
  white-space: normal;
  max-width: 100%;
}

.chart-wrapper :deep(.chartjs-legend li span) {
  word-wrap: break-word;
  white-space: normal;
  display: inline-block;
  max-width: 100%;
}

.chart-card {
  overflow: visible !important;
}

.charts-list {
  overflow: visible !important;
}

/* Для pie диаграммы */
.chart-wrapper.pie-chart-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-wrapper.pie-chart-wrapper :deep(canvas) {
  max-width: 280px !important;
  max-height: 280px !important;
}

.no-data {
  padding: 40px;
  text-align: center;
}

/* Адаптивность */
@media (max-width: 960px) {
  .charts-list {
    gap: 16px;
  }
  
  .chart-wrapper {
    min-height: 250px;
    height: 300px;
  }
}
</style>
