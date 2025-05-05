<template>
  <v-container>
    <button-back/>
    <v-row>
      <v-col cols="12" md="12">
        <v-alert
            density="compact"
            :text="error"
            title="Ошибка"
            type="warning"
            v-if="error !== null"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <EditObjectForm
            :add-mode="addMode"
            :id-object="idObject"
            @add="addObject"
            @update="updateObject"
        />
      </v-col>
    </v-row>
  </v-container>

  <v-snackbar
      :timeout="4000"
      v-model="snackbar"
  >
    {{message}}
  </v-snackbar>
</template>

<script>
import EditObjectForm from "@/components/Forms/EditObjectForm";
import ObjectService from "@/store/object.service";
import ButtonBack from "@/components/UI/ButtonBack.vue";

export default {
  name: "EditObjectPage",
  components: {ButtonBack, EditObjectForm},
  data(){
    return{
      idObject: this.$route.params.uuid,
      addMode: (this.$route.params.uuid === undefined),
      error: null,
      snackbar: false,
      message: ""
    }
  },
  methods:{
    addObject(obj){
      ObjectService.addObject(obj)
          .then((message)=>{
            this.message = message
            this.snackbar = true
            this.$nextTick(this.$router.go(-1))
          })
          .catch((response)=>{
            this.error = response.data.message
          })
    },
    updateObject(obj, uuid){
      ObjectService.updateObject(obj, uuid)
          .then((message) => {
            this.message = message
            this.snackbar = true
            this.$nextTick(this.$router.go(-1))
          })
          .catch((response) => {
            this.error = response.data.message
          })
    }
  }
}
</script>

<style scoped>

</style>