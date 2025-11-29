<script>

export default {
  name: "StatisticFilterForm",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    filterData: {
      type: Object,
      default: () => ({
        dateStart: null,
        dateEnd: null,
        selectedObjects: []
      })
    },
    objectOptions: {
      type: Array,
      default: () => []
    }
  },
  data(){
    // Устанавливаем даты по умолчанию: начало и конец текущего года
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    
    // Форматируем даты для input type="date"
    const formatDateForInput = (date) => {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    return{
      dialog: false,
      dateFilter: {
        start: formatDateForInput(startOfYear),
        end: formatDateForInput(endOfYear),
      },
      selectedObjects: [],
      allObjectsSelected: true
    }
  },
  watch: {
    modelValue(val) {
      this.dialog = val;
      if (val) {
        // Инициализируем значения из переданных данных при открытии
        if (this.filterData.dateStart) {
          this.dateFilter.start = this.formatDateForInput(this.filterData.dateStart);
          this.dateFilter.end = this.formatDateForInput(this.filterData.dateEnd);
        }
        if (this.filterData.selectedObjects && this.filterData.selectedObjects.length > 0) {
          this.selectedObjects = [...this.filterData.selectedObjects];
        } else if (this.objectOptions && this.objectOptions.length > 0) {
          // Если объектов нет в фильтре, выбираем все
          this.selectedObjects = this.objectOptions.map(obj => obj.uuid);
        }
        this.handleObjectsChange(this.selectedObjects);
      }
    },
    dialog(val) {
      this.$emit('update:modelValue', val);
    },
    filterData: {
      deep: true,
      handler() {
        if (this.dialog && this.filterData.dateStart) {
          this.dateFilter.start = this.formatDateForInput(this.filterData.dateStart);
          this.dateFilter.end = this.formatDateForInput(this.filterData.dateEnd);
          if (this.filterData.selectedObjects && this.filterData.selectedObjects.length > 0) {
            this.selectedObjects = [...this.filterData.selectedObjects];
          }
        }
      }
    },
    objectOptions: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          if (this.selectedObjects.length === 0) {
            this.selectedObjects = newVal.map(obj => obj.uuid);
            this.allObjectsSelected = true;
          } else {
            this.allObjectsSelected = this.selectedObjects.length === newVal.length;
          }
        }
      },
      immediate: true
    }
  },
  methods:{
    formatDateForInput(date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    parseDateFromInput(dateString) {
      if (!dateString) return null;
      return new Date(dateString);
    },

    handleObjectsChange(selectedUuids) {
      // Проверяем, выбраны ли все объекты
      this.allObjectsSelected = selectedUuids && this.objectOptions && selectedUuids.length === this.objectOptions.length;
    },

    handleApply() {
      // Всегда передаем массив объектов, даже если выбраны все
      const objectsToSend = this.allObjectsSelected && this.objectOptions.length > 0
          ? this.objectOptions.map(obj => obj.uuid)
          : this.selectedObjects;
      
      this.$emit('apply', {
        dateStart: this.parseDateFromInput(this.dateFilter.start),
        dateEnd: this.parseDateFromInput(this.dateFilter.end),
        selectedObjects: objectsToSend
      });
      this.dialog = false;
    },

    handleClose() {
      this.dialog = false;
    }
  },
  mounted() {
    this.dialog = this.modelValue;
    if (this.objectOptions && this.objectOptions.length > 0 && this.selectedObjects.length === 0) {
      this.selectedObjects = this.objectOptions.map(obj => obj.uuid);
      this.allObjectsSelected = true;
    }
  }
}
</script>

<template>
  <v-dialog
      v-model="dialog"
      max-width="800"
      transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Фильтр статистики</span>
        <v-btn
            icon="mdi-close"
            variant="text"
            @click="handleClose"
        ></v-btn>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="dateFilter.start"
                    label="Дата начала"
                    type="date"
                    variant="outlined"
                    :max="dateFilter.end"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="dateFilter.end"
                    label="Дата конца"
                    type="date"
                    variant="outlined"
                    :min="dateFilter.start"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-select
                    v-model="selectedObjects"
                    :items="objectOptions"
                    item-title="name"
                    item-value="uuid"
                    label="Объекты"
                    multiple
                    variant="outlined"
                    @update:model-value="handleObjectsChange"
                    chips
                    closable-chips
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            variant="text"
            @click="handleClose"
        >
          Отмена
        </v-btn>
        <v-btn
            color="primary"
            variant="tonal"
            @click="handleApply"
        >
          Применить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>

