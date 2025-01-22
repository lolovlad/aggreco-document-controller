<script>

import ObjectService from "@/store/object.service";

export default {
  name: "ItemObjectSelection",
  components: {},
  props: {
    uuidObject: {
      type: String
    },
    modelValue: {
      type: Object
    },
    readonly: {
      type: Boolean,
    },
    textBtn: {
      type: String,
      default: "Выбрать оборудованние"
    }
  },
  data: () => ({
    dialog: false,
    equipment: [],

    loading: false,
    search: '',
    selected: [],

    content: {}

  }),
  computed: {
    allSelected() {
      return this.selected.length === 5
    },
  },

  watch: {
    search(){
      ObjectService.searchEquipmentInObject(this.uuidObject, this.search)
          .then(equipment => {
            this.equipment = equipment
          })
    }
  },

  methods: {
    open(){
      this.getUserList()
      this.$nextTick(()=>{
        this.dialog = true
      })
    },

    addEquipment(equipment){
      this.content[equipment.uuid] = equipment
      this.handleInput()
    },

    deleteEquipment(uuid){
      delete this.content[uuid]
      this.handleInput()
    },

    handleInput(){
      this.$emit("update:modelValue", this.content)
    },
  },
  mounted() {
    for(let i of this.modelValue){
      this.content[i.uuid] = i
    }
    this.handleInput()
  }
}
</script>

<template>
  <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      max-width="500"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-row align="center" justify="start">
        <v-col cols="auto" v-if="Object.keys(content).length > 0">
          <v-chip-group>
            <v-chip v-for="item in this.modelValue" :key="item.uuid">{{item.name}} ({{item.code}})</v-chip>
          </v-chip-group>
        </v-col>
        <v-col cols="auto">
          <v-btn
              class="text-none font-weight-regular"
              prepend-icon="mdi-engine"
              variant="tonal"
              v-bind="activatorProps"
              :disabled="readonly"
          >{{textBtn}}</v-btn>
        </v-col>
      </v-row>
    </template>
    <v-card>
      <v-container>
        <v-row align="center" justify="start">
          <v-col
              v-for="item in this.modelValue"
              :key="item.uuid"
              class="py-1 pe-0"
              cols="auto"
          >
            <v-chip
                :disabled="loading"
                closable
                @click:close="deleteEquipment(item.uuid)"
            >
              {{ item.name }}
            </v-chip>
          </v-col>

          <v-col v-if="!allSelected" cols="12">
            <v-text-field
                ref="searchField"
                v-model="search"
                label="Поиск по названию или коду"
                hide-details
                single-line
            ></v-text-field>
          </v-col>
        </v-row>
        <v-divider v-if="!allSelected"></v-divider>
        <v-row>
          <v-col cols="12" md="12">
            <v-list v-if="equipment.length > 0">
              <template v-for="equip in equipment" :key="equip.uuid">
                <v-list-item
                    :disabled="loading"
                    @click="addEquipment(equip)"
                >
                  <v-list-item-title v-text="`${equip.name} (${equip.code})`"/>

                </v-list-item>
              </template>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>