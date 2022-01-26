<template>
  <section class="blog-page">
    <div class="title">
      <h1>BLOG</h1>
    </div>
    <div class="blog-content">
      <div v-for="(post, index) in posts" v-bind:key="post.fields.slug">
        <p v-if="showYear(posts, index)" class="post-year">{{ post.fields.publishedAt.slice(0,4) }}</p>
        <BlogTitleCard
          :title="post.fields.title"
          :slug="post.fields.slug"
          :headerImage="post.fields.headerImage"
          :publishedAt="post.fields.publishedAt"
          :body="post.fields.body"
        />
      </div>
    </div>
  </section>
</template>

<script>
import BlogTitleCard from "~/components/BlogTitleCard.vue";
import { createClient } from "~/plugins/contentful.js";

const client = createClient();
export default {
  transition: "slide-left",
  components: {
    BlogTitleCard
  },
  async asyncData({ env, params }) {
    return await client
      .getEntries({
        content_type: env.CTF_BLOG_POST_TYPE_ID,
        order: "-fields.publishedAt"
      })
      .then(entries => {
        return {
          posts: entries.items
        };
      })
      .catch(console.error);
  },
  methods: {
    showYear(posts, index) {
      const postYear = posts[index].fields.publishedAt.slice(0,4)
      if (index === 0) return true
      const previousPostYear = posts[index-1].fields.publishedAt.slice(0,4)
      return postYear !== previousPostYear
    }
  }
};
</script>

<style scoped lang="scss">
.blog-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 80px);
  padding: 10px 30px 30px;
  color: #ffffff;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  h1 {
    margin: 1.5rem 0 4rem;
    font-size: 2.2rem;
    font-weight: bold;
  }
}

.blog-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card {
  flex-direction: row;
  margin: 12px;
}

.post-year {
  margin: 14px 12px;
  font-size: 1.2rem;
  color: #aaaaaa;
}
</style>