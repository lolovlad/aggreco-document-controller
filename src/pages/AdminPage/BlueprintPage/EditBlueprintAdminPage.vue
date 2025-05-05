<script>
import UploadBlueprintForm from "@/components/Forms/UploadBlueprintForm.vue";
import ButtonBack from "@/components/UI/ButtonBack.vue";

export default {
  name: "EditBlueprintAdminPage",
  components: {ButtonBack, UploadBlueprintForm},
  data(){
    return{
      idBlueprint: this.$route.params.id,
      addMode: (this.$route.params.id === undefined),
    }
  },
  methods: {
    fileUpload(){
      this.$router.back(-1)
    }
  }
}
</script>

<template>
  <v-container>
    <button-back/>
    <v-row>
      <v-col cols="12" md="12">
        <UploadBlueprintForm @fileUpload="fileUpload"
                             :addMode="addMode"
                             :idBlueprint="idBlueprint"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>