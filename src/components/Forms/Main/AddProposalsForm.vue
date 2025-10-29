<template>
  <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      fullscreen
  >
    <template v-slot:activator="{ props: activatorProps }">
      <FixedButton
          v-bind="activatorProps"
      />
    </template>

    <v-card>
      <v-toolbar>
        <v-btn
            icon="mdi-close"
            @click="dialog = false"
        ></v-btn>

        <v-toolbar-title>{{title}}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn
              text="Сохранить"
              variant="text"
              @click="saveProposal"
          ></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="12" sm="12">
              <v-text-field
                  label="Название *"
                  variant="underlined"
                  v-model="proposal.name"
                  :rules="[v => !!v || 'Название обязательно']"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12">
              <v-select
                  label="Объект *"
                  :items="listObject"
                  item-title="name"
                  item-value="uuid"
                  variant="underlined"
                  v-model="proposal.uuid_object"
                  :rules="[v => !!v || 'Объект обязателен']"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12">
              <v-textarea
                  label="Предложение *"
                  variant="underlined"
                  v-model="proposal.offer"
                  :rules="[v => !!v || 'Предложение обязательно']"
                  rows="4"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12">
              <v-textarea
                  label="Дополнительные материалы"
                  variant="underlined"
                  v-model="proposal.additional_material"
                  rows="3"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <small class="text-caption text-medium-emphasis">* - Поле обязательное</small>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import FixedButton from "@/components/UI/FixedButton";
import ObjectService from "@/store/object.service";
import ProposalsService from "@/store/proposals.service";

export default {
  name: "AddProposalsForm",
  components: {FixedButton},
  props: {
    title: {
      type: String,
      default: "Добавить предложение"
    }
  },
  data(){
    return{
      dialog: false,

      listObject: [],

      proposal: {
        name: "",
        offer: "",
        additional_material: "",
        comment: "",
        uuid_object: null
      },

      proposalSchema: {
        name: "",
        offer: "",
        additional_material: "",
        comment: "",
        uuid_object: null
      }
    }
  },
  methods: {
    validate(){
      return this.proposal.name && this.proposal.offer && this.proposal.uuid_object;
    },

    getListObject(){
      ObjectService.getListObject().then(
          data => {
            this.listObject = data
          }
      )
    },
    
    saveProposal(){
      if(this.validate()){
        this.dialog = false
        ProposalsService.addEntity(this.proposal).then(()=> {
          this.$emit("save", this.proposal)
          this.clearForm()
        })
      }
    },
    
    clearForm(){
      Object.assign(this.proposal, this.proposalSchema)
    }
  },
  mounted() {
    this.getListObject()
  }
}
</script>

<style scoped>

</style>