<script>
export default {
  name: "PasswordField",
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Пароль'
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showPassword: false
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    }
  }
}
</script>

<template>
  <v-text-field
      :type="showPassword ? 'text' : 'password'"
      :label="label"
      :value="modelValue"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="togglePassword"
      @update:modelValue="$emit('update:modelValue', $event)"
      variant="underlined"
      clearable
      :rules="rules"
  />
</template>

<style scoped>

</style>