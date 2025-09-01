<script>
import ObjectService from "@/store/object.service";
import EnvService from "@/store/env.service";
import {auth as $store} from "@/store/auth.model";

export default {
  name: "SearchClaimForm",
  data(){
    return{
      userType: $store.state.user.type.name || null,
      selectedObject: null,
      selectedStatus: null,
      dateFrom: null,
      dateTo: null,
      objectOptions: [{name: "Все", uuid: "all"}],
      statusOptions: [{description: "Все", id: 0}],
    }
  },
  watch: {
    selectedObject() {
      this.$emit("updateSelect", this.selectedObject, this.selectedStatus, this.dateFrom, this.dateTo)
    },
    selectedStatus() {
      this.$emit("updateSelect", this.selectedObject, this.selectedStatus, this.dateFrom, this.dateTo)
    },
    dateFrom() {
      this.$emit("updateSelect", this.selectedObject, this.selectedStatus, this.dateFrom, this.dateTo)
    },
    dateTo() {
      this.$emit("updateSelect", this.selectedObject, this.selectedStatus, this.dateFrom, this.dateTo)
    },
  },
  methods: {
    getListObject(){
      ObjectService.getListObject().then(
          data => {
            this.objectOptions.push(...data)
          }
      )
    },
    getTypeStateClaim(){
      EnvService.getStateClaim().then(
          data => {
            if(this.userType !== "user"){
              for(let i of data) {
                if (i.name !== "draft" && i.name !== "under_development")
                  this.statusOptions.push(i)
              }
            }else{
              this.statusOptions.push(...data)
            }
          }
      )
    },
    setDefaultDates() {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      this.dateFrom = firstDayOfMonth.toISOString().split('T')[0];
      this.dateTo = lastDayOfMonth.toISOString().split('T')[0];
    },
    clearDates() {
      this.dateFrom = null;
      this.dateTo = null;
    }
  },
  mounted() {
    this.getListObject()
    this.getTypeStateClaim()
    this.setDefaultDates()
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12" md="3">
      <v-select
          v-model="selectedObject"
          :items="objectOptions"
          item-title="name"
          item-value="uuid"
          label="Фильтр по объекту"
          clearable
      />
    </v-col>
    <v-col cols="12" md="3">
      <v-select
          v-model="selectedStatus"
          :items="statusOptions"
          item-title="description"
          item-value="id"
          label="Фильтр по статусу"
          clearable
      />
    </v-col>
    <v-col cols="12" md="3">
      <v-text-field
          v-model="dateFrom"
          type="date"
          label="Дата с"
          clearable
          @click:clear="clearDates"
      />
    </v-col>
    <v-col cols="12" md="3">
      <v-text-field
          v-model="dateTo"
          type="date"
          label="Дата по"
          clearable
          @click:clear="clearDates"
      />
    </v-col>
  </v-row>
</template>

<style scoped>

</style>