<script>
import UploadBlueprintForm from "@/components/Forms/UploadBlueprintForm.vue";

export default {
  name: "EditBlueprintAdminPage",
  components: {UploadBlueprintForm},
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