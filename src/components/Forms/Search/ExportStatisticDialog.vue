<script>
import ObjectService from "@/store/object.service";
import StatisticService from "@/store/statistic.service";

export default {
  name: "ExportStatisticDialog",
  props: {
    modelValue: {
      type: Boolean,
      default: false
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
      allObjectsSelected: true,
      objectOptions: [],
      loadingObjects: false,
      exporting: false
    }
  },
  watch: {
    modelValue(val) {
      this.dialog = val;
      if (val) {
        this.getListObject();
      }
    },
    dialog(val) {
      this.$emit('update:modelValue', val);
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

    getListObject(){
      this.loadingObjects = true;
      return ObjectService.getListObject().then(
          data => {
            this.objectOptions = data;
            if (this.selectedObjects.length === 0) {
              this.selectedObjects = data.map(obj => obj.uuid);
              this.allObjectsSelected = true;
            }
            this.loadingObjects = false;
          }
      ).catch(
          (response) => {
            console.error('Error loading objects:', response);
            this.loadingObjects = false;
          }
      )
    },

    async handleExport() {
      // Всегда передаем массив объектов, даже если выбраны все
      const objectsToSend = this.allObjectsSelected && this.objectOptions.length > 0
          ? this.objectOptions.map(obj => obj.uuid)
          : this.selectedObjects;
      
      const startDate = this.parseDateFromInput(this.dateFilter.start);
      const endDate = this.parseDateFromInput(this.dateFilter.end);
      
      if (!startDate || !endDate) {
        alert('Пожалуйста, выберите даты начала и конца периода');
        return;
      }
      
      if (objectsToSend.length === 0) {
        alert('Пожалуйста, выберите хотя бы один объект');
        return;
      }
      
      this.exporting = true;
      
      try {
        const start_date = this.convertDate(startDate);
        const end_date = this.convertDate(endDate);
        
        await StatisticService.exportToCSV(start_date, end_date, objectsToSend);
        
        this.dialog = false;
      } catch (error) {
        console.error('Error exporting CSV:', error);
        alert('Ошибка при экспорте данных. Пожалуйста, попробуйте снова.');
      } finally {
        this.exporting = false;
      }
    },
    
    convertDate(date){
      const offset = date.getTimezoneOffset()
      let yourDate = new Date(date.getTime() - (offset*60*1000))
      return yourDate.toISOString().split('T')[0]
    },

    handleClose() {
      this.dialog = false;
    }
  },
  mounted() {
    this.dialog = this.modelValue;
    if (this.modelValue) {
      this.getListObject();
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
        <span>Экспорт данных в CSV</span>
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
                    required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="dateFilter.end"
                    label="Дата конца"
                    type="date"
                    variant="outlined"
                    :min="dateFilter.start"
                    required
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
                    :loading="loadingObjects"
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
            :disabled="exporting"
        >
          Отмена
        </v-btn>
        <v-btn
            color="primary"
            variant="tonal"
            @click="handleExport"
            :loading="exporting"
            :disabled="exporting"
        >
          Экспортировать
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>

