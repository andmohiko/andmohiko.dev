<template>
  <section class="works-page">
    <h1 class="title">WORKS</h1>
    <div class="works-content">
      <div class="work">
        <a href="https://smarepo.me/">
          <img src="../assets/portfolios/smarepo.png" alt="smarepo" />
        </a>
        <h2 class="work-title">スマブラ戦績記録・分析アプリ</h2>
        <div class="work-tags">
          <span class="tag">Nuxt.js</span>
          <span class="tag">Firebase</span>
          <span class="tag">Firestore</span>
          <span class="tag">個人開発</span>
        </div>
        <p class="work-body">
          スマブラが上手くなりたすぎてアプリを作りました。
          詳しくは<nuxt-link to="/blog/20210131">こちら</nuxt-link>のブログで書いてます。
        </p>
      </div>

      <div class="work">
        <a href="https://minima-list.web.app/">
          <img src="../assets/portfolios/minima.png" alt="minima" />
        </a>
        <h2 class="work-title">ミニマリスト向け持ち物管理アプリ</h2>
        <div class="work-tags">
          <span class="tag">Nuxt.js</span>
          <span class="tag">Firebase</span>
          <span class="tag">Rails</span>
          <span class="tag">個人開発</span>
        </div>
        <p class="work-body">
          はじめて作ったウェブアプリです。Nuxt+Rails+FirebaseAuthで作ってます。
          <br />詳しくは<nuxt-link to="/blog/20200904">こちら</nuxt-link>のブログで書いてます。
        </p>
      </div>


      <!-- <div class="portfolio-card">
        <a href="https://speakerdeck.com/andmohiko/wen-zhang-falsebekutoruhua">
          <img src="../assets/portfolios/sentenceembedding.png" alt="scentence embedding" />
        </a>
        <h2>文章のベクトル化と類似判定</h2>
        <p>
          ニュース記事のタイトルをベクトル化し、タイトルの類似性を判定する機械学習モデルを作りました。
          <br />使っている技術はPython, 機械学習, 自然言語処理です。
        </p>
      </div> -->

      <!-- <div class="portfolio-card">
        <a href="https://qiita.com/andmohiko/items/e185cbb59d9c32e6dd6a">
          <img src="../assets/portfolios/pokemondatascience2.png" alt="pokemon data science" />
        </a>
        <h2>ポケモンをデータ分析してみた</h2>
        <p>
          ポケモンのデータを分析したり機械学習してみました。分析結果をアドベントカレンダーとして書いてます。
          <br />Python, Numpy, Pandas, Matplotlib, sklearnと定番なところを全部突っ込みました。
        </p>
      </div> -->

      <div class="work">
        <a href="https://www.work-school.com/courses/5/">
          <img src="../assets/portfolios/ws-ds-min.png" alt="workschool data scientist course" />
        </a>
        <h2 class="work-title">オンライン学習サービスの教材</h2>
        <div class="work-tags">
          <span class="tag">データサイエンス</span>
          <span class="tag">機械学習</span>
          <span class="tag">Python</span>
          <span class="tag">Pandas</span>
          <span class="tag">scikit-learn</span>
        </div>
        <p class="work-body">
          Workschoolというオンライン学習サービスのデータサイエンティストコースの教材を作りました。
          <br />PythonでPandasを使ってデータを分析したりscikit-learnで機械学習してみるという内容になってます。
        </p>
      </div>

      <!-- <div class="portfolio-card">
        <a href="https://speakerdeck.com/andmohiko/predicting-categories-of-news-articles">
          <img src="../assets/portfolios/categoryprediction.png" alt="categoryprediction" />
        </a>
        <h2>ニュース記事のカテゴリー分類</h2>
        <p>
          ニュースアプリで配信する記事を適切なカテゴリータブに分類する問題を機械学習で解きました。
          <br />使っている技術はPython, 機械学習, 自然言語処理です。
        </p>
      </div> -->

      <div class="work">
        <a href="/">
          <img src="../assets/portfolios/ps-min.png" alt="portfolio-site" />
        </a>
        <h2 class="work-title">ポートフォリオサイト</h2>
        <div class="work-tags">
          <span class="tag">Nuxt.js</span>
          <span class="tag">Contentful</span>
          <span class="tag">Netlify</span>
          <span class="tag">個人開発</span>
        </div>
        <p class="work-body">
          自分のブログ&ポートフォリオサイトを作りました。
        </p>
      </div>

      <div class="work">
        <a href="http://ajdevteam.netlify.com">
          <img src="../assets/portfolios/ajdevteam-min.png" alt="ajdevteam" />
        </a>
        <h2 class="work-title">AJ開発チームのホームページ</h2>
        <div class="work-tags">
          <span class="tag">HTML5</span>
          <span class="tag">CSS3</span>
          <span class="tag">Bootstrap</span>
        </div>
        <p class="work-body">
          アイセックジャパンの開発チームのホームページを作りました(非公式)
          <br />Bootstrapを使いました。
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  components: {
  }
};
</script>

<style scoped lang="scss">
.works-page {
  display: flex;
  flex-direction: column;;
  align-items: center;
  min-height: calc(100vh - 90px - 80px);
  color: #fff;
}
.title {
  font-weight: bold;
  font-size: 2.2rem;
  margin: 1.5rem 0 4rem 0;
  text-shadow: 0 2px 5px rgba(255, 255, 255, 0.1);
}

.works-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3rem 6rem;
}

.work, .portfolio-card {
  width: 375px;
  height: auto;
  display: flex;
  flex-direction: column;

  img {
    height: auto;
    width: 100%;
  }

  &-title {
    margin-top: 20px;
    font-size: 1.2rem;
    font-weight: bolder;
  }
  &-tags {
    margin-top: 0.6rem;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 8px;
    .tag {
      background-color: #7ca339;
      padding: 2px 8px;
      border-radius: 3px;
    }
  }
  &-body {
    color: #e1e1e1;
    margin: 10px 0;
    line-height: 1.5rem;
  }
  a {
    color: white;
    font-weight: bold;
    text-decoration: none;
  }
  a:hover {
    opacity: 0.7;
  }
}</style>