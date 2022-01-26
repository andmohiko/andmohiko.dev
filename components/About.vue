<template>
  <div class="about-container">
    <div class="about">
      <div class="profile">
        <div class="profile-content">
          <p class="profile-name">andmohiko</p>
          <p class="profile-text">
            <span>メンヘラテクノロジー</span>
            <span>Python / Machine Learning / NLP / React / Vue.js / Typescript / Rails / Firebase / BigQuery</span>
          </p>
        </div>
        <div class="profile-icon">
          <a href="https://twitter.com/andmohiko">
            <img src="../assets/profilepich.png" alt="profilepic" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // width: 100%;
  max-width: 850px;
  height: auto;
  padding: 100px 0 30px;
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
    text-shadow: 0 2px 5px rgba(255, 255, 255, 10%);
  }
}

.about {
  width: 100%;
  height: auto;
  padding: 30px;
  line-height: 28px;
  color: #ffffff;
  text-align: center;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 30%);
  // background-color: rgba(0, 0, 0, 0.6);
  border-radius: 5px;

  h2 {
    margin-bottom: 1.5rem;
    font-size: 1.6rem;
    font-weight: bold;
  }

  h3 {
    margin-bottom: 20px;
    font-size: 1.2rem;
  }
}

.profile {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  justify-content: space-between;

  &-icon {
    img {
      width: 200px;
      height: 200px;
      margin: 30px 0;
      border-radius: 100%;
    }
  }

  &-content {
    margin-right: 50px;
    color: #ffffff;
    text-align: left;

    span {
      display: block;
    }
  }

  &-name {
    margin: 2rem 0;
    font-size: 2rem;
    font-weight: bold;
  }

  &-text {
    font-size: 1rem;
  }
}

</style>
