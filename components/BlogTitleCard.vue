<template>
  <article class="card">
    <nuxt-link :to="{ name: 'blog-slug', params: { slug: slug }}" class="card-title">
      <h1>{{ title }}</h1>
    </nuxt-link>
    <div class="card-date">
      <p>{{ publishedAt.slice(0,10) }}</p>
    </div>
  </article>
</template>

<script>
export default {
  props: ["title", "slug", "publishedAt", "body"]
};
</script>

<style scoped lang="scss">
.card {
  display: flex;
  justify-content: space-between;
  width: auto;
  height: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 20px;
  border-bottom: 0.5px dashed rgb(57, 72, 85);

  &-title {
    display: flex;
    text-decoration: none;

    h1 {
      font-size: 1.4rem;
      line-height: 2rem;
      color: white;
    }
  }

  &-date {
    display: flex;
    height: 25px;
    line-height: 25px;

    p {
      margin-left: 8px;
      font-size: 1rem;
      color: #aaaaaa;
      text-align: right;
      white-space: nowrap;
    }
  }
}

@media screen and (max-width: 750px) {
  .card {
    flex-direction: column;

    &-date {
      p {
        margin-left: 0;
      }
    }
  }
}
</style>
