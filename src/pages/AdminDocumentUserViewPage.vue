<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <CustomeDocumentUserTable :uuidDocument="uuidDocument" ref="userDocumentTable"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomeDocumentUserTable from "@/components/Tabels/CustomeDocumentUserTable";

export default {
  name: "AdminDocumentUserViewPage",
  components: {CustomeDocumentUserTable},
  data(){
    return{
      uuidDocument: this.$route.params.uuid,
    }
  },
}
</script>

<style scoped>

</style>