<script>
import ObjectService from "@/store/object.service";
import SingleObjectFilterForm from "@/components/Forms/Search/SingleObjectFilterForm.vue";

export default {
  name: "SingleObjectFilter",
  components: {
    SingleObjectFilterForm
  },
  data(){
    // Устанавливаем даты по умолчанию: начало и конец текущего года
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    
    return{
      filterDialog: false,
      currentFilter: {
        dateStart: startOfYear,
        dateEnd: endOfYear,
        selectedObject: null,
        selectedObjectName: ''
      },
      objectOptions: [],
      loadingObjects: false
    }
  },
  computed: {
    filterDisplay() {
      const dateStartStr = this.formatDate(this.currentFilter.dateStart);
      const dateEndStr = this.formatDate(this.currentFilter.dateEnd);
      
      return {
        dateRange: `${dateStartStr} - ${dateEndStr}`,
        object: this.currentFilter.selectedObjectName || 'Не выбран'
      };
    }
  },
  methods:{
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}.${month}.${year}`;
    },

    getListObject(){
      this.loadingObjects = true;
      return ObjectService.getListObject().then(
          data => {
            this.objectOptions = data;
            this.loadingObjects = false;
            // Эмитим событие с обновленным списком объектов
            this.$emit('objects-loaded', data);
          }
      ).catch(
          (response) => {
            console.error('Error loading objects:', response);
            this.loadingObjects = false;
          }
      )
    },

    handleApplyFilter(filterData){
      this.currentFilter.dateStart = filterData.dateStart;
      this.currentFilter.dateEnd = filterData.dateEnd;
      this.currentFilter.selectedObject = filterData.selectedObject;
      
      // Находим имя объекта
      const selectedObj = this.objectOptions.find(obj => obj.uuid === filterData.selectedObject);
      this.currentFilter.selectedObjectName = selectedObj ? selectedObj.name : '';
      
      // Эмитим событие с данными фильтра
      this.$emit('apply', filterData);
    },

    openFilterDialog() {
      this.filterDialog = true;
    }
  },
  mounted() {
    this.getListObject();
    // Периодически обновляем список объектов
    setInterval(() => {
      this.getListObject();
    }, 60000); // Обновляем каждую минуту
  }
}
</script>

<template>
  <v-container class="pa-2 pb-1">
    <v-row align="center">
      <v-col cols="12">
        <v-card variant="outlined" class="pa-3">
          <v-row align="center" dense>
            <v-col cols="auto">
              <v-btn
                  prepend-icon="mdi-filter"
                  variant="outlined"
                  @click="openFilterDialog"
                  :loading="loadingObjects"
              >
                Фильтр
              </v-btn>
            </v-col>
            <v-col v-if="filterDisplay.dateRange" cols="auto">
              <v-divider vertical class="mx-4"></v-divider>
            </v-col>
            <v-col v-if="filterDisplay.dateRange" cols="auto">
              <div class="d-flex align-center">
                <v-icon size="small" class="mr-2 text-grey">mdi-calendar-range</v-icon>
                <span class="text-body-1 font-weight-medium">{{ filterDisplay.dateRange }}</span>
              </div>
            </v-col>
            <v-col v-if="filterDisplay.object && filterDisplay.dateRange" cols="auto">
              <v-divider vertical class="mx-4"></v-divider>
            </v-col>
            <v-col v-if="filterDisplay.object" cols="auto">
              <div class="d-flex align-center">
                <v-icon size="small" class="mr-2 text-grey">mdi-office-building</v-icon>
                <span class="text-body-1">{{ filterDisplay.object }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  
  <SingleObjectFilterForm 
      v-model="filterDialog"
      :filter-data="currentFilter"
      :object-options="objectOptions"
      @apply="handleApplyFilter" 
  />
</template>

<style scoped>

</style>

