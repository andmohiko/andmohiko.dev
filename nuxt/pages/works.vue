<template>
  <section class="works-page">
    <div class="works-container" id="works">
      <Portfolio />
    </div>
  </section>
</template>

<script>
import Portfolio from "~/components/Portfolio.vue";

export default {
  transition: "slide-left",
  components: {
    Portfolio
  }
};
</script>

<style scoped lang="scss">
.works-container {
  height: auto;
}
</style>