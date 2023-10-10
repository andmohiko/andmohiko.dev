<template>
  <section class="contact-page">
    <div class="contact-container" id="contact">
      <Contact />
    </div>
  </section>
</template>

<script>
import Contact from "~/components/Contact.vue";

export default {
  transition: "slide-left",
  components: {
    Contact
  }
};
</script>

<style scoped lang="scss">
.contact-container {
  height: auto;
}
</style>