<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12" md="12">
        <v-text-field
          type="text"
          v-model="obj.name"
          label="Название *"
          variant="underlined"
          :rules="nameRules"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-select
            v-model="obj.id_region"
            :items="regions"
            item-title="name"
            item-value="id"
            label="Регион *"
            variant="underlined"
            :rules="regionRules"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-text-field
            type="text"
            v-model="obj.address"
            label="Адрес *"
            variant="underlined"
            :rules="addressRules"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
            type="number"
            v-model="obj.cx"
            label="Долгота"
            variant="underlined"
            :rules="latitudeRules"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
            type="number"
            v-model="obj.cy"
            label="Широта"
            variant="underlined"
            :rules="longitudeRules"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-text-field
            type="text"
            v-model="obj.counterparty"
            label="Контрагент *"
            variant="underlined"
            :rules="counterpartyRules"
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
            label="Состояние *"
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
            :rules="descriptionRules"
        />
      </v-col>
      <v-col cols="12" md="12">
        <small class="text-caption text-medium-emphasis">* - Поле обязательное</small>
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
        description: null,
        id_region: 1
      },

      nameRules: [
        v => !!v || 'Назывние не заполнена',
        v => /^[а-яА-ЯёЁ\s-]{2,20}$/.test(v) || 'Назывние может содержать только русские символы и длинной от 2 до 32 символа'
      ],
      addressRules: [
        v => !!v || 'Адресс не заполнена',
        v => (!!v && v.length >= 10 && v.length <= 50) || 'Адресс может быть длинной от 10 до 50 символов'
      ],
      latitudeRules: [
        v => (!v || /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(v)) || 'Широта некорректна',
      ],
      longitudeRules: [
        v => (!v || /^-?((1[0-7]\d|[1-9]?\d)(\.\d+)?|180(\.0+)?)$/.test(v)) || 'Долгота некорректна',
      ],
      regionRules: [
        v => !!v || 'Тип не выбран',
      ],

      counterpartyRules: [
        v => !!v || 'Контрагент не заполнена',
        v => (!!v && v.length >= 5 && v.length <= 50) || 'Контрагент может быть длинной от 5 до 50 символов'
      ],
      descriptionRules: [
        v => (!v || v.length <= 300) || 'Описание не может быть болше 300 симворлов'
      ],
      stateObj: [],
      regions: []
    }
  },
  methods: {
    loadState(){
      ObjectService.getStateObject().then((state) => {
        this.stateObj = state
      })
    },

    loadRegion(){
      ObjectService.getRegion().then((region) => {
        this.regions = region
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
            this.obj.id_region = object.id_region
          })
          .catch((error) => {
            console.log(error)
          })
    },

    async addObject(){
      const valid = await this.$refs.form.validate()
      if(valid.valid)
        this.$emit("add", this.obj)
    },
    async updateObject(){
      const valid = await this.$refs.form.validate()
      if(valid.valid)
        this.$emit("update", this.obj, this.idObject)
    },



  },
  mounted() {
    this.loadState()
    this.loadRegion()
    if(this.addMode === false){
      this.getObject()
    }
  }
}
</script>

<style scoped>

</style>