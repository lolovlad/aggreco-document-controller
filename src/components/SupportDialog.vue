<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon color="rgb(253,110,57)" class="mr-2">mdi-help-circle</v-icon>
        Обратная связь и поддержка
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pt-4">
        <v-alert
          type="info"
          variant="tonal"
          class="mb-4"
        >
          <strong>Обнаружили ошибку или есть предложение?</strong>
        </v-alert>

        <div class="mb-4">
          <p class="text-body-1 mb-2">
            При появлении ошибок или вопросов по работе системы, пожалуйста, обращайтесь:
          </p>
          
          <v-card
            variant="outlined"
            class="pa-3 mb-3"
          >
            <div class="d-flex align-center mb-2">
              <v-icon color="rgb(253,110,57)" class="mr-2">mdi-email</v-icon>
              <strong>Email:</strong>
            </div>
            <a 
              href="mailto:vladislav.skripnik@agk-russia.ru"
              class="text-decoration-none text-primary"
              style="font-size: 1rem;"
            >
              vladislav.skripnik@agk-russia.ru
            </a>
          </v-card>

          <v-card
            variant="outlined"
            class="pa-3"
          >
            <div class="d-flex align-center mb-2">
              <v-icon color="rgb(253,110,57)" class="mr-2">mdi-account</v-icon>
              <strong>Ответственный:</strong>
            </div>
            <div class="text-body-2">
              Младший инженер программист<br>
              Скрипник Владислав Викторович
            </div>
          </v-card>
        </div>

        <v-alert
          type="warning"
          variant="tonal"
          density="compact"
        >
          <small>При обращении укажите, пожалуйста, описание проблемы и шаги для её воспроизведения.</small>
        </v-alert>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="rgb(253,110,57)"
          variant="flat"
          @click="dialog = false"
        >
          Понятно
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "SupportDialog",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  computed: {
    dialog: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  }
}
</script>

<style scoped>
.text-primary {
  color: rgb(253,110,57) !important;
}
</style>
