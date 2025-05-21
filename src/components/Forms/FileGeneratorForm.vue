<script>
import FileDocumentService from "@/store/fileDocument.service";

export default {
  name: "FileGeneratorForm",
  props:{
    idClaim: {
      type: String,
    }
  },
  data(){
    return {
      dialog: false,
      step: 1,
      items: [
        'Выбрать шаблон',
        'Дополнительная информация',
        'Сгенерировать',
      ],
      listFileDock: [],
      error: null,
      isGenerate: false,
      generate: {
        id_blueprint: null,
        data_blueprint: null
      },

      getText: null

    }
  },
  methods: {
    getListFileDock(){
      FileDocumentService.getListFiles()
          .then((files) => {
            this.listFileDock = files
          })
    },
    close(){
      this.step = 1
      this.error = null
      this.dialog = false
      this.generate.id_blueprint = null
    },
    genFile(){
      this.isGenerate = true
      FileDocumentService.generateDocument(this.idClaim, this.generate)
          .then(() => {
            this.isGenerate = false
            this.getText = "Файл успешно сгенерирован и прикреплен к регестрации"
          })
          .catch((data) => {
            this.error = "Произошла ошибка в генерации файла"
            this.isGenerate = false
            console.log(data)
          })
    }
  },
  mounted() {
    this.getListFileDock()
  }

}
</script>

<template>
  <v-dialog
      v-model="dialog"
      persistent
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
          class="text-none font-weight-regular"
          prepend-icon="mdi-text-box-plus-outline"
          text="Генерация документа"
          variant="tonal"
          v-bind="activatorProps"
      ></v-btn>
    </template>

    <v-card
        prepend-icon="mdi-account"
        title="Работа с документом"
    >
      <v-card-text>
        <v-stepper
            v-model="step"
            :items="items"
            show-actions
            :next-text="'Дальше'"
            :prev-text="'Назад'"
        >
          <template v-slot:[`item.1`]>
            <v-card title="Выбор шаблона" flat>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-select
                      label="Шаблоны"
                      :items="listFileDock"
                      item-title="name"
                      item-value="id"
                      variant="underlined"
                      v-model="generate.id_blueprint"
                  />
                </v-col>
              </v-row>
            </v-card>
          </template>

          <template v-slot:[`item.2`]>
            <v-card title="Дополнительная информация" flat>
              <h1>Для данного шаблона не требуется дополнительная информация</h1>
            </v-card>
          </template>

          <template v-slot:[`item.3`]>
            <v-card title="Генерация документа" flat>

              <v-alert
                  density="compact"
                  :text="error"
                  title="Ошибка генерации"
                  type="warning"
                  v-if="error !== null"
                  closable
              />
              <v-alert
                  density="compact"
                  :text="getText"
                  title="Файл успешно сгенерирован"
                  type="success"
                  v-if="getText !== null"
                  closable
              />
              <v-btn @click="genFile" :loading="isGenerate">Сгенерировать</v-btn>
            </v-card>
          </template>
        </v-stepper>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
            text="Закрыть"
            variant="plain"
            @click="close"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>