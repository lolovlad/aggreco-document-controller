<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <ObjectTable @updateObject="openToolTip" ref="objectTable"/>
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
      <v-list-item prepend-icon="mdi-close" title="Удалить" @click="dialogDelete = true"></v-list-item>
      <v-divider></v-divider>
      <v-list-item prepend-icon="mdi-engine" title="Наполнение" @click="openEquipPage"></v-list-item>
      <v-list-item prepend-icon="mdi-account-multiple" title="Рабочий персонал" @click="openUserRegModel"></v-list-item>
    </v-list>
  </v-navigation-drawer>


  <FixedButton @click="addObject"/>

  <UserObjectAddForm :uuidObject="targetObject" ref="userAddForm"/>

  <v-dialog
      v-model="dialogDelete"
      max-width="500"
      persistent
  >
    <v-card
        prepend-icon="mdi-close"
        text="При согласиии объект будет удален"
        title="Вы действиетльно хотите удалить объект?"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="dialogDelete = false">
          Отмена
        </v-btn>

        <v-btn @click="deleteObj">
          Подтвердить
        </v-btn>
      </template>
    </v-card>
  </v-dialog>

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
      dataChip: [{tag: 'Apple'}],
      drawel: false,
      dialogDelete: false,
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
      this.$router.push(`/admin/object/edit/${this.targetObject}`)
    },
    deleteObj(){
      ObjectService.deleteObject(this.targetObject)
          .then(() => {
            this.message = "Объект удален"
            this.dialogDelete = false
            this.drawel = false
            this.$nextTick(()=>{
              this.snackbar = true
              this.$refs.objectTable.loadItem(1)
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