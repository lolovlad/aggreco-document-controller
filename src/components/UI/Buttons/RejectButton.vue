<script>
export default {
  name: "RejectButton",
  props: {
    stateClaim: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      dialogReject: false,
      comment: ""
    }
  },
  computed: {
    isRejected() {
      return this.stateClaim === 'under_development'
    }
  },
  methods: {
    reject(){
      if (this.comment && this.comment.trim()) {
        this.$emit('reject', this.comment)
        this.comment = ""
        this.$nextTick(() => {
          this.dialogReject = false
        })
      }
    }
  }
}
</script>

<template>
  <v-dialog
      v-model="dialogReject"
      max-width="600"
      persistent
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-tooltip :text="isRejected ? 'Предложение отклонено' : 'Отклонить предложение'" location="top">
        <template v-slot:activator="{ props }">
          <span :style="disabled ? 'cursor: not-allowed; opacity: 0.6;' : ''" v-bind="disabled ? {} : props">
            <v-icon
                class="me-2"
                size="small"
                v-bind="disabled ? {} : activatorProps"
                :color="isRejected ? 'red' : 'grey'"
            >
              mdi-thumb-down
            </v-icon>
          </span>
        </template>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="text-h5">
        Отклонить предложение
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-textarea
              v-model="comment"
              label="Комментарий к отклонению"
              placeholder="Укажите причину отклонения предложения..."
              variant="outlined"
              rows="4"
              :rules="[v => !!v || 'Комментарий обязателен']"
              required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialogReject = false">
          Отмена
        </v-btn>
        <v-btn 
          color="red" 
          @click="reject"
        >
          Отклонить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
