<template>
  <section class="blog-content-container">
    <div class="blog-bg">
      <div class="blog">
        <p class="blog-date">{{ (new Date(post.fields.publishedAt)).toLocaleDateString() }}</p>
        <h1 class="blog-title">{{ post.fields.title }}</h1>
        <img
          v-if="post.fields.headerImage"
          class="blog-headerImage"
          :src="post.fields.headerImage.fields.file.url"
        />
        <div class="slug_body" v-html="$md.render(post.fields.body)"></div>
      </div>
    </div>
  </section>
</template>

<script>
import markdownIt from "markdown-it";
import { createClient } from "~/plugins/contentful.js";

const client = createClient();
export default {
  transition: "slide-left",
  components: {
    markdownIt
  },
  head() {
    const description = this.post.fields?.description || 'andmohiko.dev blog post'
    const headerImageUrl = this.post.fields?.headerImage ?
      "https:" + this.post.fields.headerImage.fields.file.url :
      '@/static/favicon.png'
    return {
      title: this.post.fields.title,
      meta: [
        { hid: 'description', name: 'description', content: description },
        { hid: 'og:site_name', property: 'og:site_name', content: this.post.fields.title + ' - andmohiko.dev' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:url', property: 'og:url', content: 'https://andmohiko.dev/blog/' + this.post.fields.slug },
        { hid: 'og:title', property: 'og:title', content: this.post.fields.title },
        { hid: 'og:description', property: 'og:description', content: description },
        { hid: 'og:image', property: 'og:image', content: headerImageUrl },
        { hid: 'twitter:card', name: 'twitter:card', content: "summary" },
        { hid: 'twitter:site', name: 'twitter:site', content: "@andmohiko"}
      ]
    }
  },
  async asyncData({ env, params }) {
    return await client
      .getEntries({
        content_type: env.CTF_BLOG_POST_TYPE_ID,
        "fields.slug": params.slug,
        order: "-sys.createdAt"
      })
      .then(entries => {
        return {
          post: entries.items[0]
        };
      })
      .catch(console.error);
  },
	// mounted() {
	// 	Prism.highlightAll()
	// }
};
</script>

<style scoped lang="scss">
.blog-content-container {
  padding: 90px 2rem 2rem;

  @media screen and (max-width: 850px) {
    padding: 90px 0 0;
  }
}

.blog-bg {
  display: flex;
  justify-content: center;
  max-width: 780px;
  margin: 0 auto;
  background-color: #f2f2f2;
  border-radius: 5px;
  box-shadow: 0 0 3px #dedddd;
}

.blog {
  width: 100%;
  max-width: 720px;
  padding: 6%;

  &-date {
    margin-top: 20px;
    font-size: 1rem;
    color: #777777;
    text-align: left;
  }

  &-title {
    margin: 40px 0;
    font-size: 2.5rem;
    font-weight: bolder;
    line-height: 3.5rem;
    color: #333333;
  }

  &-headerImage {
    max-width: 100%;
    margin-bottom: 60px;
  }
}

.slug_body {
  color: #333333;

  pre {
    /* white-space: pre-wrap; */
    overflow-x: scroll;
  }
}
</style>
