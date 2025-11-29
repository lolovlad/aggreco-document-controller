<script>
import ObjectService from "@/store/object.service";
import StatisticFilterForm from "@/components/Forms/Search/StatisticFilterForm.vue";

export default {
  name: "StatisticFilter",
  components: {
    StatisticFilterForm
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
        selectedObjects: [],
        selectedObjectsNames: []
      },
      objectOptions: [],
      loadingObjects: false
    }
  },
  computed: {
    filterDisplay() {
      const dateStartStr = this.formatDate(this.currentFilter.dateStart);
      const dateEndStr = this.formatDate(this.currentFilter.dateEnd);
      
      let objectsText = '';
      let objectsCount = 0;
      
      if (this.currentFilter.selectedObjectsNames.length === 0 || 
          this.currentFilter.selectedObjectsNames.length === this.objectOptions.length) {
        objectsText = 'Все объекты';
        objectsCount = this.objectOptions.length;
      } else if (this.currentFilter.selectedObjectsNames.length <= 3) {
        objectsText = this.currentFilter.selectedObjectsNames.join(', ');
        objectsCount = this.currentFilter.selectedObjectsNames.length;
      } else {
        objectsText = this.currentFilter.selectedObjectsNames.slice(0, 3).join(', ');
        objectsCount = this.currentFilter.selectedObjectsNames.length;
      }
      
      return {
        dateRange: `${dateStartStr} - ${dateEndStr}`,
        objects: objectsText,
        objectsCount: objectsCount > 3 ? objectsCount - 3 : 0
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
            const previousSelected = [...this.currentFilter.selectedObjects];
            this.objectOptions = data;
            
            // Если объектов еще нет, выбираем все по умолчанию
            if (this.currentFilter.selectedObjects.length === 0) {
              this.currentFilter.selectedObjects = data.map(obj => obj.uuid);
              this.currentFilter.selectedObjectsNames = data.map(obj => obj.name);
            } else {
              // Обновляем список имен для существующих выбранных объектов
              this.currentFilter.selectedObjectsNames = data
                  .filter(obj => previousSelected.includes(obj.uuid))
                  .map(obj => obj.name);
              // Оставляем только те объекты, которые все еще существуют
              this.currentFilter.selectedObjects = previousSelected.filter(uuid => 
                  data.some(obj => obj.uuid === uuid)
              );
            }
            
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
      
      // Обновляем список имен выбранных объектов
      this.currentFilter.selectedObjects = filterData.selectedObjects;
      this.currentFilter.selectedObjectsNames = this.objectOptions
          .filter(obj => filterData.selectedObjects.includes(obj.uuid))
          .map(obj => obj.name);
      
      // Эмитим событие с данными фильтра (всегда передаем массив)
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
            <v-col v-if="filterDisplay.objects && filterDisplay.dateRange" cols="auto">
              <v-divider vertical class="mx-4"></v-divider>
            </v-col>
            <v-col v-if="filterDisplay.objects" cols="auto">
              <div class="d-flex align-center">
                <v-icon size="small" class="mr-2 text-grey">mdi-office-building</v-icon>
                <span class="text-body-1">
                  <template v-if="filterDisplay.objectsCount > 0">
                    {{ filterDisplay.objects }}, <span class="text-grey-darken-1">+{{ filterDisplay.objectsCount }} объектов</span>
                  </template>
                  <template v-else>
                    {{ filterDisplay.objects }}
                  </template>
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  
  <StatisticFilterForm 
      v-model="filterDialog"
      :filter-data="currentFilter"
      :object-options="objectOptions"
      @apply="handleApplyFilter" 
  />
</template>

<style scoped>

</style>

