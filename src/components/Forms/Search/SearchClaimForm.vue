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
      objectOptions: [{name: "Все", uuid: "all"}],
      statusOptions: [{description: "Все", id: 0}],
    }
  },
  watch: {
    selectedObject() {
      this.$emit("updateSelect", this.selectedObject, this.selectedStatus)
    },
    selectedStatus() {
      this.$emit("updateSelect", this.selectedObject, this.selectedStatus)
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
    }
  },
  mounted() {
    this.getListObject()
    this.getTypeStateClaim()
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
          v-model="selectedObject"
          :items="objectOptions"
          item-title="name"
          item-value="uuid"
          label="Фильтр по объекту"
          clearable
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-select
          v-model="selectedStatus"
          :items="statusOptions"
          item-title="description"
          item-value="id"
          label="Фильтр по статусу"
          clearable
      />
    </v-col>
  </v-row>
</template>

<style scoped>

</style>