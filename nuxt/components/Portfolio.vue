<template>
  <section class="portfolio-container">
    <div class="title">
      <h1>WORKS</h1>
    </div>
    <div class="portfolio-content">
      <div class="portfolio-card">
        <a href="https://smarepo.me/">
          <img src="../assets/portfolios/smarepo.png" alt="smarepo" />
        </a>
        <h2>スマブラ戦績記録・分析アプリ</h2>
        <p>
          スマブラが上手くなりたすぎてアプリを作りました。
          <br />Nuxt+Firebase+Firestoreで作ってます。
          <br />詳しくは<nuxt-link to="/blog/20210131">こちら</nuxt-link>のブログで書いてます。
        </p>
      </div>

      <div class="portfolio-card">
        <a href="https://minima-list.web.app/">
          <img src="../assets/portfolios/minima.png" alt="minima" />
        </a>
        <h2>ミニマリスト向け持ち物管理アプリ</h2>
        <p>
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

      <div class="portfolio-card">
        <a href="https://www.work-school.com/courses/5/">
          <img src="../assets/portfolios/ws-ds-min.png" alt="workschool data scientist course" />
        </a>
        <h2>オンライン学習サービスの教材</h2>
        <p>
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

      <div class="portfolio-card">
        <a href="/">
          <img src="../assets/portfolios/ps-min.png" alt="portfolio-site" />
        </a>
        <h2>ポートフォリオサイト</h2>
        <p>
          自分のブログ&ポートフォリオサイトを作りました。
          <br />Nuxt.js+Contentful+Netlifyを使ってます。
        </p>
      </div>

      <!-- <div class="portfolio-card">
        <a href="http://ajdevteam.netlify.com">
          <img src="../assets/portfolios/ajdevteam-min.png" alt="ajdevteam" />
        </a>
        <h2>AJ開発チームのホームページ</h2>
        <p>
          アイセックジャパンの開発チームのホームページを作りました(非公式)
          <br />Bootstrapを使いました。
        </p>
      </div> -->
    </div>
  </section>
</template>

<style scoped lang="scss">
.portfolio-container {
  min-height: calc(100vh - 80px);
  width: 100%;
  padding: 100px 30px 30px 30px;

  // background-image: url(../assets/bg_portfolio-min.jpg);
  // background-repeat: no-repeat;
  // background-size: cover;
  // background-position: center;

  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  color: #fff;
  // text-shadow: 0 2px 5px rgba(255, 255, 255, 0.5);
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

.portfolio-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
}

.portfolio-card {
  max-width: 720px;
  height: 400px;
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: 1px 5px 5px 1px rgba(0, 0, 0, 0.2);
  // border: 0.5px solid rgb(57, 72, 85);
  border-radius: 5px;
  padding: 15px 25px;
  margin: 10px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    max-height: 240px;
    max-width: 360px;
    text-align: center;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 1.2rem;
    font-weight: bolder;
  }
  p {
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
}
</style>