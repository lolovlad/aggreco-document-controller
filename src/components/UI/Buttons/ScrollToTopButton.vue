<script>
export default {
  name: "ScrollToTopButton",
  data() {
    return {
      showButton: false,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.showButton = window.scrollY > 100;
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
  }
}
</script>

<template>
  <v-fade-transition>
    <v-btn
        v-if="showButton"
        class="scroll-to-top-button"
        @click="scrollToTop"
        icon
    >
      <v-icon color="white">mdi-arrow-up</v-icon>
    </v-btn>
  </v-fade-transition>
</template>

<style scoped>
.scroll-to-top-button {
  position: fixed;
  bottom: 16px;
  right: 16px;
  background-color: rgb(45, 53, 64);
  color: white;
  z-index: 1000;
}
</style>