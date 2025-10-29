<script>
export default {
  name: "ProposalCommentForm",
  props: {
    actionType: {
      type: String,
      required: true,
      validator: value => ['approve', 'reject'].includes(value)
    }
  },
  data() {
    return {
      comment: ""
    }
  },
  computed: {
    placeholder() {
      return this.actionType === 'approve' 
        ? 'Укажите причину одобрения предложения...' 
        : 'Укажите причину отклонения предложения...'
    },
    label() {
      return this.actionType === 'approve' 
        ? 'Комментарий к одобрению' 
        : 'Комментарий к отклонению'
    }
  },
  methods: {
    getComment() {
      return this.comment
    },
    clearForm() {
      this.comment = ""
    }
  }
}
</script>

<template>
  <v-form>
    <v-textarea
        v-model="comment"
        :label="label"
        :placeholder="placeholder"
        variant="outlined"
        rows="4"
        :rules="[v => !!v || 'Комментарий обязателен']"
        required
    />
  </v-form>
</template>

<style scoped>

</style>
