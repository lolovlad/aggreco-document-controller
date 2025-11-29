<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import {defineComponent} from "vue";
import {Bar, Line, Pie} from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
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
    
    // Проверяем, горизонтальный ли график
    const isHorizontal = chart.options.indexAxis === 'y';
    
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      
      meta.data.forEach((element, index) => {
        const value = dataset.data[index];
        if (value !== null && value !== undefined) {
          let x, y;
          
          if (isHorizontal) {
            // Для горизонтального графика - справа от столбца
            x = element.x + 15;
            y = element.y;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
          } else {
            // Для вертикального графика - над столбцом
            x = element.x;
            y = element.y - 8; // Небольшой отступ
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
          }
          
          // Настройка стиля текста
          ctx.font = 'bold 12px Arial, sans-serif';
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
  name: "StatisticChart",
  components: {
    Bar,
    Line,
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
  data() {
    return {
      chartInstance: null
    }
  },
  mounted() {
    // Получаем ссылку на экземпляр графика после монтирования
    this.$nextTick(() => {
      if (this.$refs.chartComponent) {
        // vue-chartjs хранит chart instance в $data._chart
        this.chartInstance = this.$refs.chartComponent.$data._chart || this.$refs.chartComponent.chartInstance;
      }
    });
  },
  computed: {
    chartData() {
      return this.convertTableData(this.data);
    },
    currentChartComponent() {
      if (this.chartType === 'bar') return Bar;
      if (this.chartType === 'pie') return Pie;
      return Bar;
    },
    chartOptions() {
      const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
        },
        plugins: {
          legend: {
            display: this.chartType === 'pie',
            position: this.chartType === 'pie' ? 'right' : 'top'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                if (this.chartType === 'pie') {
                  const label = context.label || '';
                  const value = context.parsed || context.raw;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value} (${percentage}%)`;
                }
                return `Количество аварий: ${context.parsed.y}`;
              }
            }
          }
        }
      };

      if (this.chartType === 'pie') {
        return {
          ...baseOptions,
          maintainAspectRatio: true,
          aspectRatio: 1.8,
          plugins: {
            ...baseOptions.plugins,
            legend: {
              display: true,
              position: 'right',
              align: 'start',
              maxWidth: 280,
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
                    
                    // Сокращаем длинные названия (максимум 35 символов)
                    let displayLabel = String(label);
                    if (displayLabel.length > 35) {
                      displayLabel = displayLabel.substring(0, 32) + '...';
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

      return {
        ...baseOptions,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        },
        layout: {
          padding: {
            left: 60,
            right: 50,
            top: 20,
            bottom: 80,
          },
        }
      };
    }
  },
  watch: {
    chartType() {
      // При изменении типа графика данные пересчитываются автоматически через computed
      // Обновляем ссылку на chart instance после изменения типа
      this.$nextTick(() => {
        if (this.$refs.chartComponent) {
          this.chartInstance = this.$refs.chartComponent.$data._chart || this.$refs.chartComponent.chartInstance;
        }
      });
    }
  },
  methods: {
    /**
     * Универсальный парсер данных для графика статистики
     * Поддерживает различные структуры данных от API
     * 
     * @param {Array} data - Массив объектов статистики
     * @returns {Object} Объект с данными для Chart.js
     */
    convertTableData(data) {
      // Проверяем, что данные - массив
      if (!Array.isArray(data)) {
        console.error('convertTableData: ожидается массив данных', data);
        return {
          labels: [],
          datasets: []
        };
      }

      // Если массив пустой
      if (data.length === 0) {
        return {
          labels: [],
          datasets: [{
            label: 'Количество аварий',
            backgroundColor: '#1976d2',
            borderColor: '#1976d2',
            data: [],
            minBarLength: 7
          }]
        };
      }

      // Определяем структуру данных (новая или старая)
      const firstItem = data[0];
      
      // Новая структура: { object_uuid, object_name, claim_count }
      if (firstItem.object_name && firstItem.claim_count !== undefined) {
        if (this.chartType === 'pie') {
          return this.parsePieStructure(data);
        }
        return this.parseSimpleStructure(data);
      }
      
      // Старая структура: { name, type_count: {...} }
      if (firstItem.name && firstItem.type_count) {
        return this.parseComplexStructure(data);
      }

      // Если структура не распознана, пробуем универсальный парсер
      console.warn('convertTableData: неопознанная структура данных, используется универсальный парсер');
      return this.parseUniversal(data);
    },

    /**
     * Парсинг простой структуры: один объект - одна метрика
     * Структура: [{ object_name: string, claim_count: number, ... }]
     */
    /**
     * Парсинг данных для круговой диаграммы
     */
    parsePieStructure(data) {
      const labels = [];
      const counts = [];
      const backgroundColors = [];

      // Обрабатываем все элементы, где есть и название и значение
      data.forEach((item) => {
        if (item.object_name && item.claim_count !== undefined) {
          labels.push(item.object_name);
          counts.push(item.claim_count);
          backgroundColors.push(this.generateColor(labels.length - 1));
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

    parseSimpleStructure(data) {
      const labels = [];
      const counts = [];

      data.forEach(item => {
        if (item.object_name) {
          labels.push(item.object_name);
        }
        if (item.claim_count !== undefined) {
          counts.push(item.claim_count);
        }
      });

      const color = this.generateColor(0);
      
      return {
        labels: labels,
        datasets: [{
          label: 'Количество аварий',
          backgroundColor: color,
          borderColor: color,
          borderWidth: 0,
          pointBackgroundColor: color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          data: counts,
          minBarLength: 7,
          tension: 0
        }]
      };
    },

    /**
     * Парсинг сложной структуры: один объект - несколько метрик (stacked)
     * Структура: [{ name: string, type_count: { [key]: { name, count } } }]
     */
    parseComplexStructure(data) {
      const labels = [];
      const datasetMap = {};
      let stackIndex = 0;

      data.forEach(item => {
        if (item.name) {
          labels.push(item.name);
        }

        if (item.type_count && typeof item.type_count === 'object') {
          Object.values(item.type_count).forEach(typeInfo => {
            if (typeInfo.name && typeInfo.count !== undefined) {
              if (!datasetMap[typeInfo.name]) {
                const color = this.generateColor(stackIndex);
                datasetMap[typeInfo.name] = {
                  label: typeInfo.name,
                  backgroundColor: color,
                  borderColor: color,
                  borderWidth: this.chartType === 'line' ? 3 : 0,
                  pointBackgroundColor: color,
                  pointBorderColor: '#fff',
                  pointBorderWidth: 2,
                  pointRadius: 5,
                  pointHoverRadius: 7,
                  data: [],
                  stack: `Stack ${stackIndex}`,
                  minBarLength: 7,
                  tension: this.chartType === 'line' ? 0.4 : 0
                };
                stackIndex++;
              }
              datasetMap[typeInfo.name].data.push(typeInfo.count);
            }
          });
        }
      });

      return {
        labels: labels,
        datasets: Object.values(datasetMap)
      };
    },

    /**
     * Универсальный парсер для произвольной структуры данных
     * Пытается автоматически определить поля для labels и данных
     */
    parseUniversal(data) {
      const labels = [];
      const values = [];
      
      // Пытаемся найти поля для имени и значения
      const firstItem = data[0];
      const possibleNameFields = ['name', 'object_name', 'title', 'label'];
      const possibleValueFields = ['count', 'claim_count', 'accident_count', 'value', 'amount', 'total'];
      
      let nameField = null;
      let valueField = null;
      
      // Ищем поле для имени
      for (const field of possibleNameFields) {
        if (firstItem[field] !== undefined) {
          nameField = field;
          break;
        }
      }
      
      // Ищем поле для значения
      for (const field of possibleValueFields) {
        if (typeof firstItem[field] === 'number') {
          valueField = field;
          break;
        }
      }

      // Если нашли поля, парсим данные
      if (nameField && valueField) {
        data.forEach(item => {
          if (item[nameField]) {
            labels.push(String(item[nameField]));
          }
          if (item[valueField] !== undefined) {
            values.push(Number(item[valueField]) || 0);
          }
        });
      }

      const color = this.generateColor(0);
      
      return {
        labels: labels,
        datasets: [{
          label: valueField || 'Значение',
          backgroundColor: color,
          borderColor: color,
          borderWidth: this.chartType === 'line' ? 3 : 0,
          pointBackgroundColor: color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          data: values,
          minBarLength: 7,
          tension: this.chartType === 'line' ? 0.4 : 0
        }]
      };
    },

    /**
     * Генерация цвета для датасета
     * @param {number} index - Индекс датасета
     * @returns {string} HSL цвет
     */
    generateColor(index) {
      // Генерируем цвет на основе индекса
      const hue = (index * 137.508) % 360; // Золотой угол для равномерного распределения
      const saturation = 60 + (index % 3) * 10; // 60-80%
      const lightness = 45 + (index % 2) * 10; // 45-55%
      
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    },

    handleChartTypeChange(type) {
      if (type !== this.chartType) {
        this.$emit('update:chartType', type);
      }
    },

    /**
     * Обновление ссылки на экземпляр графика
     */
    updateChartInstance() {
      this.$nextTick(() => {
        const chartComponent = this.$refs.chartComponent;
        if (chartComponent) {
          // vue-chartjs хранит chart instance в $data._chart
          this.chartInstance = chartComponent.$data?._chart || chartComponent.chartInstance;
        }
      });
    },

    /**
     * Экспорт графика в PNG
     */
    exportToPNG() {
      // Используем setTimeout для гарантии, что DOM обновлен
      setTimeout(() => {
        this.$nextTick(() => {
          // Пробуем найти canvas разными способами
          let canvas = null;
          let chart = null;
          
          // Способ 1: через chartComponent ref
          const chartComponent = this.$refs.chartComponent;
          if (chartComponent) {
            // Ищем canvas в $el компонента
            if (chartComponent.$el) {
              canvas = chartComponent.$el.querySelector('canvas') || chartComponent.$el;
            }
            // Пробуем получить chart instance
            if (chartComponent.$data && chartComponent.$data._chart) {
              chart = chartComponent.$data._chart;
              if (chart && chart.canvas) {
                canvas = chart.canvas;
              }
            }
            if (!chart && chartComponent.chartInstance) {
              chart = chartComponent.chartInstance;
              if (chart && chart.canvas) {
                canvas = chart.canvas;
              }
            }
          }
          
          // Способ 2: ищем canvas в chart-wrapper через ref
          if (!canvas && this.$refs.chartWrapper) {
            canvas = this.$refs.chartWrapper.querySelector('canvas');
          }
          
          // Способ 2.1: ищем canvas в chart-wrapper через querySelector
          if (!canvas) {
            const chartWrapper = this.$el?.querySelector('.chart-wrapper');
            if (chartWrapper) {
              canvas = chartWrapper.querySelector('canvas');
            }
          }
          
          // Способ 3: ищем canvas напрямую в текущем компоненте
          if (!canvas) {
            canvas = this.$el?.querySelector('canvas');
          }
          
          // Способ 4: используем Chart.js registry для поиска всех активных chart
          if (!canvas && ChartJS.instances && ChartJS.instances.length > 0) {
            // Берем последний созданный chart (скорее всего это наш)
            chart = ChartJS.instances[ChartJS.instances.length - 1];
            if (chart && chart.canvas) {
              canvas = chart.canvas;
            }
          }

          if (!canvas) {
            console.error('Canvas element not found. Tried multiple methods.');
            return;
          }

          // Если chart еще не найден, пробуем через Chart.js getChart
          if (!chart) {
            try {
              chart = ChartJS.getChart(canvas);
            } catch (e) {
              // Игнорируем ошибку
            }
          }

          // Пробуем экспортировать через chart instance
          if (chart && typeof chart.toBase64Image === 'function') {
            try {
              const url = chart.toBase64Image('image/png', 1);
              this.downloadImage(url);
              return;
            } catch (error) {
              console.warn('Failed to use chart.toBase64Image, using canvas directly:', error);
            }
          }

          // Альтернативный способ - используем canvas напрямую
          try {
            if (canvas.tagName === 'CANVAS' || canvas instanceof HTMLCanvasElement) {
              const url = canvas.toDataURL('image/png', 1.0);
              this.downloadImage(url);
            } else {
              console.error('Element is not a canvas:', canvas);
            }
          } catch (e) {
            console.error('Failed to export chart:', e);
          }
        });
      }, 100); // Небольшая задержка для гарантии рендера
    },

    /**
     * Скачивание изображения
     */
    downloadImage(url) {
      const link = document.createElement('a');
      link.download = `statistic_${this.chartType}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = url;
      
      // Добавляем ссылку в DOM, кликаем и удаляем
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
})
</script>

<template>
  <div class="statistic-chart-container">
    <!-- Переключатель типа графика (сверху) -->
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
.statistic-chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 600px;
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

.export-btn {
  width: 40px !important;
  min-width: 40px !important;
  height: 40px !important;
  padding: 0 !important;
}

.chart-wrapper {
  flex: 1;
  position: relative;
  min-height: 550px;
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
  max-height: 600px;
  overflow: visible;
}

.chart-wrapper.pie-chart :deep(canvas) {
  max-width: 650px !important;
  max-height: 550px !important;
}

/* Улучшаем отображение легенды для pie диаграммы */
.chart-wrapper.pie-chart :deep(.chartjs-legend) {
  max-height: 500px;
  overflow-y: auto;
}

.chart-wrapper.pie-chart :deep(.chartjs-legend li) {
  margin-bottom: 4px !important;
  line-height: 1.4 !important;
}
</style>

