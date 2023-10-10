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
  min-height: calc(100vh - 80px);
  width: 100%;
  padding: 10px 30px 30px 30px;

  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  color: #fff;
}

.title {
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    font-weight: bold;
    font-size: 2.2rem;
    margin: 1.5rem 0 4rem 0;
    text-shadow: 0 2px 5px rgba(255, 255, 255, 0.1);
  }
}

.blog-content {
  display: flex;
  // flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  // background-color: rgba(0, 0, 0, 0.4);
}

.card {
  flex-direction: row;
  margin: 12px;
}

.post-year {
  font-size: 1.2rem;
  color: #aaaaaa;
  margin: 14px 12px;
}
</style>