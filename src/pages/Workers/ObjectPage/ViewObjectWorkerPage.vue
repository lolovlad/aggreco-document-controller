<template>
  <v-container v-if="loader">
    <v-row>
      <v-col cols="12" md="12">
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="12" md="12">
                <p class="text-h3">{{targetObject.name}}</p>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="12">
                <p>Контрагент {{targetObject.counterparty}}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p>Долгода: {{targetObject.cx}}</p>
              </v-col>
              <v-col cols="12" md="6">
                <p>Широта: {{targetObject.cy}}</p>
              </v-col>
              <v-col cols="12" md="12">
                <p>Полный Адресс: {{targetObject.address}}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="3">
                <p>Состояние: {{targetObject.state.description}}
                  <v-badge
                      bordered
                      bottom
                      :color="badgerColor"
                      dot
                      offset-x="-10"
                      offset-y="-10"
                      inline
                  ></v-badge>
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="12">
                <EquipmentTable
                    :uuidObject="targetObject.uuid"
                    @update="updateEquipment"
                    @delete="dialogDelete = true"
                    ref="equipmentTable"

                />
              </v-col>
            </v-row>
            <v-row>
              <v-btn @click="openAddEquipPage">
                Добавить
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
        :timeout="4000"
        v-model="snackbar"
    >
      {{message}}
    </v-snackbar>

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

          <v-btn @click="deleteEquipment">
            Подтвердить
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
  <loader-page v-else/>
</template>

<script>
import ObjectService from "@/store/object.service";
import LoaderPage from "@/components/UI/LoaderPage.vue";
import EquipmentTable from "@/components/Tabels/EquipmentTable.vue";
export default {
  name: "ViewObjectAdminPage",
  components: {EquipmentTable, LoaderPage},
  data(){
    return{
      targetObject: null,
      dataChip: [{tag: 'Apple'}],
      drawel: false,
      snackbar: false,
      message: "",
      dialogDelete: false,
      loader: false
    }
  },

  methods:{

    getObject(){
      ObjectService.getObjectByUser().then((obj) => {
        this.targetObject = obj
        this.loader = true
      })
    },


    deleteEquipment(uuid){
      ObjectService.deleteEquipment(uuid)
          .then(()=>{
            this.message = "Объект удален"
            this.snackbar = true
            this.$refs.equipmentTable.loadItem(1)
          })
    },
    updateEquipment(uuid){
      this.$router.push(`/worker/object/${this.targetObject.uuid}/equip/edit/${uuid}`)
    },
    openAddEquipPage(){
      this.$router.push(`/worker/object/${this.targetObject.uuid}/equip/add`)
    }

  },
  computed: {
    badgerColor(){
      if(this.targetObject.state.name === "inactive")
        return "error"
      return "success"
    }
  },
  mounted() {
    this.getObject()
  }
}
</script>

<style scoped>

</style>