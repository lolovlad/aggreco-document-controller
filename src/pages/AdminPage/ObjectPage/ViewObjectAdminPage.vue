<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <ObjectTable @updateObject="openToolTip"
                     @deleteObject="deleteObj"
                     ref="objectTable"/>
      </v-col>
    </v-row>
  </v-container>

  <v-navigation-drawer
      v-model="drawel"
      location="right"
      temporary
  >
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-pencil" title="Редактировать" @click="openEditPage"></v-list-item>
      <v-divider></v-divider>
      <v-list-item prepend-icon="mdi-engine" title="Оборудованние" @click="openEquipPage"></v-list-item>
      <v-list-item prepend-icon="mdi-account-multiple" title="Рабочий персонал" @click="openUserRegModel"></v-list-item>
    </v-list>
  </v-navigation-drawer>


  <FixedButton @click="addObject"/>

  <UserObjectAddForm :uuidObject="targetObject" ref="userAddForm"/>

  <v-snackbar
      :timeout="4000"
      v-model="snackbar"
  >
    {{message}}
  </v-snackbar>

</template>

<script>
import ObjectTable from "@/components/Tabels/ObjectTable";
import FixedButton from "@/components/UI/FixedButton";
import UserObjectAddForm from "@/components/Forms/UserObjectAddForm";
import ObjectService from "@/store/object.service";
export default {
  name: "ViewObjectAdminPage",
  components: {UserObjectAddForm, FixedButton, ObjectTable},
  data(){
    return{
      targetObject: null,
      dataChip: [],
      drawel: false,
      snackbar: false,
      message: ""
    }
  },

  methods:{
    addObject(){
      this.$router.push(`/admin/object/add`)
    },
    openToolTip(uuid){
      this.targetObject = uuid
      this.drawel = true
    },
    openEditPage(){
      this.$refs.objectTable.saveState()
      this.$router.push(`/admin/object/edit/${this.targetObject}`)
    },
    deleteObj(uuid){
      ObjectService.deleteObject(uuid)
          .then(() => {
            this.message = "Объект удален"
            this.drawel = false
            this.$nextTick(()=>{
              this.snackbar = true
              this.$refs.objectTable.loadItem({page: 1, itemsPerPage: 20})
            })
          })
          .catch((response) => {
            this.message = response.response
            this.snackbar = true
          })
    },
    openEquipPage(){
      this.$router.push(`/admin/object/${this.targetObject}/equip`)
    },
    openUserRegModel(){
      this.$refs.userAddForm.open()
    }
  }
}
</script>

<style scoped>

</style>