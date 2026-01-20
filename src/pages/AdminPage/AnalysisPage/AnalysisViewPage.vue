<script>
import {defineComponent} from "vue";
import LogAnalysisService from "@/store/log-analysis.service";
import AnalysisFilter from "@/components/Forms/Search/AnalysisFilter.vue";
import MarkdownViewer from "@/components/UI/MarkdownViewer.vue";

export default defineComponent({
  name: "AnalysisViewPage",
  components: {
    AnalysisFilter,
    MarkdownViewer
  },
  data(){
    return{
      loading: false,
      analysisData: {},
      currentFilter: {
        dateStart: null,
        dateEnd: null,
        selectedObject: null
      },
      analyzing: false,
      selectedMonth: null
    }
  },
  computed: {
    monthKeys() {
      return Object.keys(this.analysisData).sort().reverse(); // Сортируем по убыванию (новые сначала)
    }
  },
  methods:{
    convertDate(date){
      const offset = date.getTimezoneOffset()
      let yourDate = new Date(date.getTime() - (offset*60*1000))
      return yourDate.toISOString().split('T')[0]
    },

    handleApplyFilter(filterData){
      this.currentFilter = filterData;
      this.loadAnalysis();
    },

    async loadAnalysis(){
      if (!this.currentFilter.selectedObject) {
        return;
      }

      this.loading = true;
      try {
        const startDate = this.convertDate(this.currentFilter.dateStart);
        const endDate = this.convertDate(this.currentFilter.dateEnd);
        
        const response = await LogAnalysisService.getObjectSummarize(
          this.currentFilter.selectedObject,
          startDate,
          endDate
        );
        
        console.log('Analysis response:', response);
        console.log('Analysis response.data:', response?.data);
        
        if (response && response.data) {
          // Проверяем, является ли data массивом или объектом
          const data = Array.isArray(response.data) ? response.data : (response.data.items || response.data.data || []);
          console.log('Processed data:', data);
          this.analysisData = this.groupByMonthAndEquipment(data);
          console.log('Grouped analysisData:', this.analysisData);
          
          // Устанавливаем первый месяц как выбранный по умолчанию
          if (this.monthKeys.length > 0 && !this.selectedMonth) {
            this.selectedMonth = this.monthKeys[0];
          }
        } else {
          console.warn('No data in response:', response);
          this.analysisData = {};
          this.selectedMonth = null;
        }
      } catch (error) {
        console.error('Error loading analysis:', error);
        this.analysisData = {};
      } finally {
        this.loading = false;
      }
    },

    groupByMonthAndEquipment(data) {
      // Группируем данные по месяцам и оборудованию
      const grouped = {};
      
      if (Array.isArray(data)) {
        data.forEach(item => {
          // Используем datetime_start для определения месяца, если нет - используем datetime_end
          const dateStr = item.datetime_start || item.datetime_end;
          if (!dateStr) return;
          
          const date = new Date(dateStr);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          if (!grouped[monthKey]) {
            grouped[monthKey] = {};
          }
          
          // Используем equipment_uuid или equipment_name как ключ для группировки по оборудованию
          const equipmentKey = item.equipment_uuid || item.equipment_name || item.id_equipment || 'unknown';
          
          if (!grouped[monthKey][equipmentKey]) {
            grouped[monthKey][equipmentKey] = [];
          }
          
          grouped[monthKey][equipmentKey].push(item);
        });
      }
      
      // Сортируем оборудование по названию в каждом месяце
      Object.keys(grouped).forEach(monthKey => {
        const monthData = grouped[monthKey];
        const sortedEquipment = {};
        
        // Получаем массив ключей оборудования с их названиями для сортировки
        const equipmentEntries = Object.entries(monthData).map(([key, items]) => {
          const equipmentName = this.getEquipmentNameForSort(items, key);
          return { key, name: equipmentName, items };
        });
        
        // Сортируем по названию
        equipmentEntries.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          return nameA.localeCompare(nameB, 'ru');
        });
        
        // Восстанавливаем отсортированный объект
        equipmentEntries.forEach(entry => {
          sortedEquipment[entry.key] = entry.items;
        });
        
        grouped[monthKey] = sortedEquipment;
      });
      
      return grouped;
    },
    
    getEquipmentNameForSort(equipmentData, equipmentKey) {
      if (!equipmentData || equipmentData.length === 0) {
        return equipmentKey !== 'unknown' ? equipmentKey : 'Не указано';
      }
      
      const firstItem = equipmentData[0];
      if (firstItem.equipment_name) {
        return firstItem.equipment_name;
      }
      if (firstItem.equipment && firstItem.equipment.name) {
        return firstItem.equipment.name;
      }
      
      return equipmentKey !== 'unknown' ? equipmentKey : 'Не указано';
    },

    async runAnalysis() {
      if (!this.currentFilter.selectedObject) {
        return;
      }

      this.analyzing = true;
      // Показываем уведомление о начале анализа
      this.$store.dispatch('notification/notify', {
        message: 'Анализ запущен. Это может занять несколько минут...',
        color: 'info',
        timeout: 5000
      });
      
      try {
        await LogAnalysisService.analyzeObjectLogs(this.currentFilter.selectedObject);
        // После анализа перезагружаем данные
        await this.loadAnalysis();
        // Показываем уведомление об успехе
        this.$store.dispatch('notification/notify', {
          message: 'Анализ успешно выполнен',
          color: 'success'
        });
      } catch (error) {
        console.error('Error running analysis:', error);
        let errorMessage = 'Ошибка при запуске анализа. Попробуйте позже.';
        
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          errorMessage = 'Превышено время ожидания ответа. Анализ может быть выполнен, попробуйте обновить данные.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        this.$store.dispatch('notification/notify', {
          message: errorMessage,
          color: 'error'
        });
      } finally {
        this.analyzing = false;
      }
    },

    isCurrentMonth(monthKey) {
      const now = new Date();
      const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      return monthKey === currentMonthKey;
    },

    hasAnalysisForMonth(monthKey) {
      const monthData = this.analysisData[monthKey];
      if (!monthData) return false;
      
      // Проверяем, есть ли хотя бы одно оборудование с данными
      return Object.keys(monthData).some(equipmentKey => {
        const equipmentData = monthData[equipmentKey];
        return Array.isArray(equipmentData) && equipmentData.length > 0;
      });
    },

    formatMonth(monthKey) {
      const [year, month] = monthKey.split('-');
      const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    },

    formatMetadata(metadata) {
      if (!metadata || typeof metadata !== 'object') return null;
      return metadata;
    },

    getEquipmentName(equipmentData, equipmentKey) {
      if (!equipmentData || equipmentData.length === 0) {
        return equipmentKey !== 'unknown' ? equipmentKey : 'Не указано';
      }
      
      // Пытаемся найти название оборудования в первом элементе массива
      const firstItem = equipmentData[0];
      if (firstItem.equipment_name) {
        return firstItem.equipment_name;
      }
      if (firstItem.equipment && firstItem.equipment.name) {
        return firstItem.equipment.name;
      }
      
      return equipmentKey !== 'unknown' ? equipmentKey : 'Не указано';
    },

    isCurrentMonthInRange() {
      if (!this.currentFilter.dateStart || !this.currentFilter.dateEnd) {
        return false;
      }
      const now = new Date();
      const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const startMonth = new Date(this.currentFilter.dateStart);
      const endMonth = new Date(this.currentFilter.dateEnd);
      const startMonthKey = `${startMonth.getFullYear()}-${String(startMonth.getMonth() + 1).padStart(2, '0')}`;
      const endMonthKey = `${endMonth.getFullYear()}-${String(endMonth.getMonth() + 1).padStart(2, '0')}`;
      
      return currentMonthKey >= startMonthKey && currentMonthKey <= endMonthKey;
    },

  }
})
</script>

<template>
  <div>
    <AnalysisFilter 
        @apply="handleApplyFilter"
    />
    
    <v-container v-if="currentFilter.selectedObject" class="pa-2 pt-4">
      <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
          class="mb-4"
      ></v-progress-linear>

      <div v-if="!loading && Object.keys(analysisData).length === 0" class="text-center pa-8">
        <v-icon size="64" color="grey">mdi-chart-line-variant</v-icon>
        <p class="text-h6 mt-4 text-grey">Нет данных для отображения</p>
        <p class="text-body-2 text-grey">За выбранный период анализ не проводился</p>
        <v-btn
            v-if="isCurrentMonthInRange()"
            color="primary"
            class="mt-4"
            :loading="analyzing"
            @click="runAnalysis"
            prepend-icon="mdi-refresh"
        >
          {{ analyzing ? 'Анализ выполняется...' : 'Провести анализ' }}
        </v-btn>
      </div>

      <div v-else-if="!loading && monthKeys.length > 0">
        <v-tabs
            v-model="selectedMonth"
            align-tabs="start"
            color="primary"
        >
          <v-tab
              v-for="monthKey in monthKeys"
              :key="monthKey"
              :value="monthKey"
          >
            {{ formatMonth(monthKey) }}
          </v-tab>
        </v-tabs>

        <v-tabs-window v-model="selectedMonth" class="mt-4">
          <v-tabs-window-item
              v-for="monthKey in monthKeys"
              :key="monthKey"
              :value="monthKey"
          >
            <div class="d-flex justify-end mb-4">
              <v-btn
                  v-if="isCurrentMonth(monthKey) && !hasAnalysisForMonth(monthKey)"
                  color="primary"
                  :loading="analyzing"
                  @click="runAnalysis"
                  prepend-icon="mdi-refresh"
              >
                {{ analyzing ? 'Анализ выполняется...' : 'Провести анализ' }}
              </v-btn>
              <v-btn
                  v-else-if="isCurrentMonth(monthKey) && hasAnalysisForMonth(monthKey)"
                  color="primary"
                  variant="outlined"
                  :loading="analyzing"
                  @click="runAnalysis"
                  prepend-icon="mdi-refresh"
              >
                {{ analyzing ? 'Обновление...' : 'Обновить анализ' }}
              </v-btn>
            </div>

            <div v-for="(equipmentData, equipmentKey) in analysisData[monthKey]" :key="equipmentKey" class="mb-4">
              <v-card class="mb-2">
                <v-card-title class="text-subtitle-1">
                  <v-icon size="small" class="mr-2">mdi-cog</v-icon>
                  Оборудование: {{ getEquipmentName(equipmentData, equipmentKey) }}
                </v-card-title>
                
                <v-card-text>
                  <v-expansion-panels variant="accordion" class="mb-2">
                    <v-expansion-panel
                        v-for="(item, index) in equipmentData"
                        :key="index"
                        :title="`Анализ ${index + 1}`"
                        :subtitle="item.equipment_name || 'Анализ оборудования'"
                    >
                      <template v-slot:text>
                        <div class="text-caption text-grey">
                          <div v-if="item.datetime_start">
                            Период: {{ new Date(item.datetime_start).toLocaleDateString('ru-RU') }} - 
                            {{ item.datetime_end ? new Date(item.datetime_end).toLocaleDateString('ru-RU') : 'н/д' }}
                          </div>
                          <div v-if="item.metadata_equipment?.statistics" class="mt-1">
                            Логов: {{ item.metadata_equipment.statistics.total_logs || 0 }} | 
                            Ошибок: {{ item.metadata_equipment.statistics.error_count || 0 }} | 
                            Предупреждений: {{ item.metadata_equipment.statistics.warning_count || 0 }}
                          </div>
                        </div>
                      </template>
                      
                      <v-expansion-panel-text>
                        <div class="pa-2">
                          <!-- Текстовый анализ -->
                          <div v-if="item.text" class="mb-4">
                            <h4 class="text-subtitle-2 mb-2">Анализ:</h4>
                            <MarkdownViewer :content="item.text" />
                          </div>

                            <!-- Метаданные -->
                            <div v-if="item.metadata_equipment" class="mt-4">
                              <h4 class="text-subtitle-2 mb-2">Детали:</h4>
                              
                              <!-- Частые ошибки -->
                              <div v-if="item.metadata_equipment.most_frequent_errors && item.metadata_equipment.most_frequent_errors.length > 0" class="mb-2">
                                <strong>Частые ошибки:</strong>
                                <div class="mt-1">
                                  <v-chip
                                      v-for="(error, errorIndex) in item.metadata_equipment.most_frequent_errors"
                                      :key="errorIndex"
                                      size="small"
                                      color="error"
                                      variant="outlined"
                                      class="mr-1 mb-1"
                                  >
                                    {{ error }}
                                  </v-chip>
                                </div>
                              </div>

                              <!-- Проблемные узлы -->
                              <div v-if="item.metadata_equipment.problematic_nodes && item.metadata_equipment.problematic_nodes.length > 0" class="mb-2">
                                <strong>Проблемные узлы:</strong>
                                <div class="mt-1">
                                  <v-chip
                                      v-for="(node, nodeIndex) in item.metadata_equipment.problematic_nodes"
                                      :key="nodeIndex"
                                      size="small"
                                      color="warning"
                                      variant="outlined"
                                      class="mr-1 mb-1"
                                  >
                                    {{ node }}
                                  </v-chip>
                                </div>
                              </div>

                              <!-- Постоянные проблемы -->
                              <div v-if="item.metadata_equipment.recurring_issues && item.metadata_equipment.recurring_issues.length > 0" class="mb-2">
                                <strong>Постоянные проблемы:</strong>
                                <div class="mt-1">
                                  <v-chip
                                      v-for="(issue, issueIndex) in item.metadata_equipment.recurring_issues"
                                      :key="issueIndex"
                                      size="small"
                                      color="info"
                                      variant="outlined"
                                      class="mr-1 mb-1"
                                  >
                                    {{ issue }}
                                  </v-chip>
                                </div>
                              </div>

                              <!-- Статистика -->
                              <div v-if="item.metadata_equipment.statistics" class="mt-2">
                                <strong>Статистика:</strong>
                                <v-list density="compact" class="mt-1">
                                  <v-list-item>
                                    <v-list-item-title>Всего логов: {{ item.metadata_equipment.statistics.total_logs || 0 }}</v-list-item-title>
                                  </v-list-item>
                                  <v-list-item>
                                    <v-list-item-title>Ошибок: {{ item.metadata_equipment.statistics.error_count || 0 }}</v-list-item-title>
                                  </v-list-item>
                                  <v-list-item>
                                    <v-list-item-title>Предупреждений: {{ item.metadata_equipment.statistics.warning_count || 0 }}</v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </div>
                            </div>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card-text>
                </v-card>
              </div>
            </v-tabs-window-item>
          </v-tabs-window>
      </div>
    </v-container>

    <v-container v-else class="pa-2 pt-4">
      <div class="text-center pa-8">
        <v-icon size="64" color="grey">mdi-filter</v-icon>
        <p class="text-h6 mt-4 text-grey">Выберите объект и период</p>
        <p class="text-body-2 text-grey">Используйте фильтр для выбора объекта и периода анализа</p>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
:deep(.v-container) {
  overflow: visible;
}

:deep(.v-tabs-window) {
  overflow: visible;
}

:deep(.v-tabs-window-item) {
  overflow: visible;
}
</style>
