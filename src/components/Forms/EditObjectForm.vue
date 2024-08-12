<template>
  <v-form @submit.prevent>
    <v-row>
      <v-col cols="12" md="12">
        <v-text-field
          type="text"
          v-model="obj.name"
          label="Название"
          variant="underlined"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-text-field
            type="text"
            v-model="obj.address"
            label="Адрес"
            variant="underlined"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
            type="number"
            v-model="obj.cx"
            label="X"
            variant="underlined"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
            type="number"
            v-model="obj.cy"
            label="Y"
            variant="underlined"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-text-field
            type="text"
            v-model="obj.counterparty"
            label="Контрагент"
            variant="underlined"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-select
            v-model="obj.id_state"
            :items="stateObj"
            item-title="description"
            item-value="id"
            label="Состояние"
            variant="underlined"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-textarea
            v-model="obj.description"
            variant="underlined"
            label="Описание"
            auto-grow
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" v-if="addMode">
        <ButtonAgrea @click="addObject">Сохранить</ButtonAgrea>
      </v-col>
      <v-col cols="12" md="4" v-else>
        <ButtonAgrea @click="updateObject">Обновить</ButtonAgrea>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import ButtonAgrea from "@/components/UI/ButtonAgrea";
import ObjectService from "@/store/object.service";
export default {
  name: "EditObjectForm",
  components: {ButtonAgrea},
  props: {
    addMode: {
      type: Boolean,
      default: true
    },
    idObject: {
      type: String,
      default: null
    }
  },
  data(){
    return{
      obj: {
        name: null,
        address: null,
        cx: 0,
        cy: 0,
        counterparty: null,
        id_state: 1,
        description: null
      },
      stateObj: []
    }
  },
  methods: {
    loadState(){
      ObjectService.getStateObject().then((state) => {
        this.stateObj = state
      })
    },

    getObject(){
      ObjectService.getObjectByUuid(this.idObject)
          .then((object) => {
            this.obj.name = object.name
            this.obj.address = object.address
            this.obj.cx = object.cx
            this.obj.cy = object.cy
            this.obj.counterparty = object.counterparty
            this.obj.id_state = object.id_state
            this.obj.description = object.description
          })
          .catch((error) => {
            console.log(error)
          })
    },

    addObject(){
      this.$emit("add", this.obj)
    },
    updateObject(){
      this.$emit("update", this.obj, this.idObject)
    },

  },
  mounted() {
    this.loadState()
    if(this.addMode === false){
      this.getObject()
    }
  }
}
</script>

<style scoped>

</style>