<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12" md="12">
        <v-text-field
            type="text"
            v-model="equip.name"
            label="Название *"
            variant="underlined"
            :rules="nameRule"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-text-field
            type="text"
            v-model="equip.code"
            label="Номер *"
            variant="underlined"
            :rules="codeRule"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-select
            v-model="equip.id_type"
            :items="typeEquip"
            item-title="name"
            item-value="id"
            label="Тип *"
            variant="underlined"
            :rules="typeRule"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-textarea
            v-model="equip.description"
            variant="underlined"
            label="Описание"
            auto-grow
            :rules="descriptionRule"
        />
      </v-col>
      <v-col cols="12" md="12">
        <small class="text-caption text-medium-emphasis">* - Поле обязательное</small>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" v-if="addMode">
        <ButtonAgrea @click="addEquipment">Сохранить</ButtonAgrea>
      </v-col>
      <v-col cols="12" md="4" v-else>
        <ButtonAgrea @click="updateEquipment">Обновить</ButtonAgrea>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import ButtonAgrea from "@/components/UI/ButtonAgrea";
import ObjectService from "@/store/object.service";
import EnvService from "@/store/env.service";

export default {
  name: "EditEquipmentFrom",
  components: {ButtonAgrea},
  props: {
    addMode: {
      type: Boolean,
      default: true
    },
    idObject: {
      type: String,
      default: null
    },
    idEquipment: {
      type: String,
      default: null
    }
  },
  data(){
    return{
      equip: {
        name: null,
        id_type: null,
        description: null,
        code: null
      },
      typeEquip: [],

      nameRule: [
          v => !!v || 'Название не заполнено',
          v => (v && v.length >= 3 && v.length <= 20) || 'Название должно быть от 3 до 21 символа'
      ],
      codeRule: [
        v => !!v || 'Код не заполнено',
        v => /^[^\u0400-\u04FF]{2,25}$/.test(v) || 'Код не может содержать русских букв и быть от 2 до 26 сиволов'
      ],
      typeRule: [
        v => !!v || 'Тип не выбран',
      ],
      descriptionRule: [
        v => (!v || v.length <= 300) || 'Описание не может быть болше 300 симворлов'
      ]
    }
  },
  methods: {
    loadType(){
      EnvService.getTypeEquipment()
          .then((types) => {
            this.typeEquip = types
          })
    },

    getEquipment(){
      ObjectService.getEquipmentByUuid(this.idEquipment)
          .then((equipment) => {
            this.equip.name = equipment.name
            this.equip.id_type = equipment.id_type
            this.equip.description = equipment.description
            this.equip.code =equipment.code
          })
    },

    async addEquipment(){
      const valid = await this.$refs.form.validate()
      if(valid.valid)
        this.$emit("add", this.equip)
    },
    async updateEquipment(){
      const valid = await this.$refs.from.validate()
      if(valid.valid)
        this.$emit("update", this.equip, this.idEquipment)
    },

  },
  mounted() {
    this.loadType()
    if(this.addMode === false){
      this.getEquipment()
    }
  }
}
</script>

<style scoped>

</style>