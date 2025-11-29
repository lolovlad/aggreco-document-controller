<script>
export default {
  name: "SingleObjectFilterForm",
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
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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
      
      this.$emit('apply', {
        dateStart: this.localFilter.dateStart,
        dateEnd: this.localFilter.dateEnd,
        selectedObject: this.localFilter.selectedObject
      });
      this.closeDialog();
    },
    closeDialog() {
      this.$emit('update:modelValue', false);
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
        <span>Фильтр статистики</span>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
      </v-card-title>
      
      <v-card-text>
        <v-form>
          <!-- Строка с датами -->
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Дата начала"
                  type="date"
                  :model-value="dateStartFormatted"
                  @update:model-value="localFilter.dateStart = $event ? new Date($event) : null"
                  variant="outlined"
                  density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Дата окончания"
                  type="date"
                  :model-value="dateEndFormatted"
                  @update:model-value="localFilter.dateEnd = $event ? new Date($event) : null"
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
        <v-btn color="primary" variant="flat" @click="applyFilter">Применить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>

