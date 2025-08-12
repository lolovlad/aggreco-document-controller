<template>
  <v-container v-if="loader">
    <v-row class="mb-4" v-if="objects.length > 1">
      <v-col cols="12">
        <v-slide-group
            class="pa-2"
            v-model="selectedIndex"
            show-arrows
            center-active
        >
          <v-slide-group-item
              v-for="(item, index) in objects"
              :key="item.uuid"
              :value="index"
          >
            <v-chip
                class="ma-2"
                :color="targetObject.uuid === item.uuid ? 'primary' : ''"
                @click="selectObject(item, index)"
                outlined
            >
              {{ item.name }}
            </v-chip>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>
    </v-row>

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
                <p>Долгота: {{targetObject.cx}}</p>
              </v-col>
              <v-col cols="12" md="6">
                <p>Широта: {{targetObject.cy}}</p>
              </v-col>
              <v-col cols="12" md="12">
                <p>Полный Адрес: {{targetObject.address}}</p>
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
                    @delete="deleteEquipment"
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
      dialogDelete: false,
      loader: false,
      selectedIndex: 0,
      objects: []
    }
  },

  methods:{

    getObject(){
      ObjectService.getObjectByUser().then((obj) => {
        this.objects = obj
        this.targetObject = obj[0]
        this.loader = true
      })
    },
    selectObject(obj, index) {
      this.targetObject = obj;
      this.selectedIndex = index;
      this.$nextTick(() => {
        this.$refs.equipmentTable.loadItem({page: 1, itemsPerPage: 20})
      })
    },

    deleteEquipment(uuid){
      ObjectService.deleteEquipment(uuid)
          .then(()=>{
            this.$refs.equipmentTable.loadItem({page: 1, itemsPerPage: 20})
          })
    },
    updateEquipment(uuid){
      this.$router.push(`/worker/object/${this.targetObject.uuid}/equip/edit/${uuid}`)
    },
    openAddEquipPage(){
      this.$refs.equipmentTable.saveState()
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