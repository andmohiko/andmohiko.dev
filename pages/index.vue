<template>
  <div class="home-page">
    <div class="top-container">
      <h1>andmohiko.dev</h1>
      <div class="links">
        <a href="https://twitter.com/andmohiko">
          <img src="@/assets/twitter.png" alt="twitter" />
        </a>
        <a href="https://github.com/andmohiko">
          <img src="@/assets/github.png" alt="github" />
        </a>
      </div>
    </div>
    <section class="about-container" id="about">
      <About />
    </section>

    <section class="section-container">
      <div class="title">
        <h2>Works</h2>
      </div>
      <div class="portfolio-content">
        <div class="portfolio-card">
          <div class="portfolio-text">
            <h3>スマレポ</h3>
            <span class="subtitle">スマブラ戦績記録・分析アプリ</span>
            <p class="description">
              <span>スマブラが上手くなりたすぎて作りました。</span>
              <span>対戦の記録をつけていくとキャラごとの勝率とかを見れたり</span>
              <span>勝率の変化をグラフで見れます。</span>
              <span>自分の弱みを把握して対策できるアプリです。</span>
            </p>
            <p class="description">
              <span>NuxtとFirebaseを使ってます。</span>
              <span>詳しくは<nuxt-link to="/blog/20210131">こちら</nuxt-link>のブログで書いてます。</span>
            </p>
          </div>
          <div class="portfolio-img">
            <a href="https://smarepo.me/">
              <img src="../assets/portfolios/smarepo.png" alt="smarepo" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="section-container">
      <div class="title">
        <h2>Blog</h2>
      </div>
      <div class="blog-content">
        <BlogTitleCard
          v-for="post in posts"
          v-bind:key="post.fields.slug"
          :title="post.fields.title"
          :body="post.fields.body"
          :slug="post.fields.slug"
          :publishedAt="post.fields.publishedAt"
        />
      </div>
    </section>
  </div>
</template>

<script>
import About from "~/components/About.vue";
import BlogTitleCard from "~/components/BlogTitleCard.vue";
import { createClient } from "~/plugins/contentful.js";

const client = createClient();

export default {
  transition: "slide-left",
  components: {
    About,
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
          posts: entries.items.slice(0,3)
        };
      })
      .catch(console.error);
  }
};
</script>

<style scoped lang="scss">
.home-page {
  // height: auto;
  // width: 100%;
  // padding: 100px 30px 30px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.top-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 200px);
  color: #ffffff;
  h1 {
    font-size: 32px;
    margin: 50px 0;
  }
  p {
    font-size: 16px;
  } 
}

.links {
  img {
    height: 22px;
    width: 22px;
    margin-right: 25px;
  }
}

.title {
  color: #ffffff;
  h2 {
    font-size: 2rem;
    font-weight: bolder;
    margin-bottom: 2rem;
    padding: 0.3rem 0;
    // border-bottom: 1px solid #ddd;
  }
}

a {
  color: white;
  font-weight: bold;
  text-decoration: none;
}
a:hover {
  opacity: 0.7;
}

.about-container {
  // height: calc(100vh - 80px);
  size: cover;
  width: 100%;
  // background-image: url(../assets/bg-top-min.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;

  h1 {
    font-weight: bold;
    font-size: 80px;
    margin-bottom: 30px;
  }

  h2 {
    font-size: 26px;
    position: relative;
    top: 40px;
  }
}

.section-container {
  height: auto;
  display: flex;
  flex-direction: column;
  height: auto;
  width: 100%;
  max-width: 850px;
  margin: 100px 0 0 0;
  padding: 30px;

  // @media screen and (min-width: 1000px) {
  //   margin-left: calc(100vw/2 - 500px);
  // }
}

.portfolio {
  &-content {
    h3 {
      color: #ffffff;
      font-size: 1.6rem;
      padding-bottom: 20px
    }
    .subtitle {
      color: #bbbbbb;
      font-size: 1.1rem;
    }
    .description {
      margin: 1.5rem 0 0 0;
      color: #ebebeb;
      font-size: 1rem;
      line-height: 1.6rem;
      display: flex;
      flex-direction: column;
    }
  }
  &-card {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 20px;
    padding-bottom: 0.5rem;
    border-bottom: 0.5px dashed rgb(57, 72, 85);
  }
  &-img {
    img {
      width: 100%;
      height: auto;
    }
    margin: 1rem 0;
  }
}
</style>
