<template>
  <v-container>
    <button-back/>
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
    }
  },
  methods:{
    addObject(obj){
      ObjectService.addObject(obj)
          .then(()=>{
            this.$nextTick(this.$router.go(-1))
          })
    },
    updateObject(obj, uuid){
      ObjectService.updateObject(obj, uuid)
          .then(() => {
            this.$nextTick(this.$router.go(-1))
          })
    }
  }
}
</script>

<style scoped>

</style>