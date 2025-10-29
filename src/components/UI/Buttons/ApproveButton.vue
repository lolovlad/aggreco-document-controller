<script>
export default {
  name: "ApproveButton",
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
      dialogApprove: false,
      comment: ""
    }
  },
  computed: {
    isApproved() {
      return this.stateClaim === 'accepted'
    }
  },
  methods: {
    approve(){
      if (this.comment && this.comment.trim()) {
        this.$emit('approve', this.comment)
        this.comment = ""
        this.$nextTick(() => {
          this.dialogApprove = false
        })
      }
    }
  }
}
</script>

<template>
  <v-dialog
      v-model="dialogApprove"
      max-width="600"
      persistent
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-tooltip :text="isApproved ? 'Предложение одобрено' : 'Одобрить предложение'" location="top">
        <template v-slot:activator="{ props }">
          <span :style="disabled ? 'cursor: not-allowed; opacity: 0.6;' : ''" v-bind="disabled ? {} : props">
            <v-icon
                class="me-2"
                size="small"
                v-bind="disabled ? {} : activatorProps"
                :color="isApproved ? 'green' : 'grey'"
            >
              mdi-thumb-up
            </v-icon>
          </span>
        </template>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="text-h5">
        Одобрить предложение
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-textarea
              v-model="comment"
              label="Комментарий к одобрению"
              placeholder="Укажите причину одобрения предложения..."
              variant="outlined"
              rows="4"
              :rules="[v => !!v || 'Комментарий обязателен']"
              required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialogApprove = false">
          Отмена
        </v-btn>
        <v-btn 
          color="green" 
          @click="approve"
        >
          Одобрить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
