<script>
export default {
  name: "AnalysisFilterForm",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    filterData: {
      type: Object,
      default: () => ({
        dateStart: new Date(),
        dateEnd: new Date(),
        selectedObject: null
      })
    },
    objectOptions: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'apply'],
  data() {
    return {
      localFilter: {
        dateStart: null,
        dateEnd: null,
        selectedObject: null
      }
    }
  },
  computed: {
    formatDateForInput() {
      return (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
      };
    },
    dateStartFormatted() {
      return this.formatDateForInput(this.localFilter.dateStart);
    },
    dateEndFormatted() {
      return this.formatDateForInput(this.localFilter.dateEnd);
    }
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        // При открытии диалога копируем текущие значения
        this.localFilter = {
          dateStart: this.filterData.dateStart ? new Date(this.filterData.dateStart) : new Date(),
          dateEnd: this.filterData.dateEnd ? new Date(this.filterData.dateEnd) : new Date(),
          selectedObject: this.filterData.selectedObject || null
        };
      }
    }
  },
  methods: {
    applyFilter() {
      if (!this.localFilter.selectedObject) {
        alert('Пожалуйста, выберите объект');
        return;
      }
      
      // Убеждаемся, что даты установлены на начало и конец месяца
      let dateStart = new Date(this.localFilter.dateStart);
      dateStart.setDate(1); // Первый день месяца
      dateStart.setHours(0, 0, 0, 0);
      
      let dateEnd = new Date(this.localFilter.dateEnd);
      // Последний день месяца
      dateEnd = new Date(dateEnd.getFullYear(), dateEnd.getMonth() + 1, 0);
      dateEnd.setHours(23, 59, 59, 999);
      
      this.$emit('apply', {
        dateStart: dateStart,
        dateEnd: dateEnd,
        selectedObject: this.localFilter.selectedObject
      });
      this.closeDialog();
    },
    closeDialog() {
      this.$emit('update:modelValue', false);
    },
    handleMonthStartChange(event) {
      if (event) {
        const [year, month] = event.split('-');
        this.localFilter.dateStart = new Date(parseInt(year), parseInt(month) - 1, 1);
      }
    },
    handleMonthEndChange(event) {
      if (event) {
        const [year, month] = event.split('-');
        this.localFilter.dateEnd = new Date(parseInt(year), parseInt(month) - 1, 1);
      }
    }
  }
}
</script>

<template>
  <v-dialog
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      max-width="600"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Фильтр анализа</span>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
      </v-card-title>
      
      <v-card-text>
        <v-form>
          <!-- Строка с выбором месяца начала -->
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Месяц начала"
                  type="month"
                  :model-value="dateStartFormatted"
                  @update:model-value="handleMonthStartChange"
                  variant="outlined"
                  density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Месяц окончания"
                  type="month"
                  :model-value="dateEndFormatted"
                  @update:model-value="handleMonthEndChange"
                  variant="outlined"
                  density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
          
          <!-- Строка с выбором объекта -->
          <v-row>
            <v-col cols="12">
              <v-select
                  label="Объект"
                  :items="objectOptions"
                  item-title="name"
                  item-value="uuid"
                  v-model="localFilter.selectedObject"
                  variant="outlined"
                  density="compact"
                  clearable
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="closeDialog">Отмена</v-btn>
        <v-btn color="primary" variant="flat" @click="applyFilter">Просмотреть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
