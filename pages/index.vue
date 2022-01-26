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

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.top-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 200px);
  color: #ffffff;

  h1 {
    margin: 50px 0;
    font-size: 32px;
  }

  p {
    font-size: 16px;
  }
}

.links {
  img {
    width: 22px;
    height: 22px;
    margin-right: 25px;
  }
}

.title {
  color: #ffffff;

  h2 {
    padding: 0.3rem 0;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: bolder;
  }
}

a {
  font-weight: bold;
  color: white;
  text-decoration: none;
}

a:hover {
  opacity: 0.7;
}

.about-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: white;
  // background-image: url(../assets/bg-top-min.jpg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  // height: calc(100vh - 80px);
  size: cover;

  h1 {
    margin-bottom: 30px;
    font-size: 80px;
    font-weight: bold;
  }

  h2 {
    position: relative;
    top: 40px;
    font-size: 26px;
  }
}

.section-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 850px;
  height: auto;
  padding: 30px;
  margin: 100px 0 0;

  // @media screen and (min-width: 1000px) {
  //   margin-left: calc(100vw/2 - 500px);
  // }
}

.portfolio {
  &-content {
    h3 {
      padding-bottom: 20px;
      font-size: 1.6rem;
      color: #ffffff;
    }

    .subtitle {
      font-size: 1.1rem;
      color: #bbbbbb;
    }

    .description {
      display: flex;
      flex-direction: column;
      margin: 1.5rem 0 0;
      font-size: 1rem;
      line-height: 1.6rem;
      color: #ebebeb;
    }
  }

  &-card {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-bottom: 0.5rem;
    margin-bottom: 20px;
    border-bottom: 0.5px dashed #394855;
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
