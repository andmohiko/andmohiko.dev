<template>
  <div class="footer-container">
    <div class="links">
      <a href="https://twitter.com/andmohiko">
        <img src="~/assets/twitter.png" alt="twitter" />
      </a>
      <a href="https://github.com/andmohiko">
        <img src="~/assets/github.png" alt="github" />
      </a>
    </div>
    <div class="copyright">
      <p>
        <small>© 2021 @andmohiko</small>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.footer-container {
  display: flex;
  justify-content: space-between;
  height: 80px;
  padding: 33px;
  background-color: #111111;
}

.links {
  display: flex;
  align-items: center;
  justify-content: left;

  img {
    width: 22px;
    height: 22px;
    margin-right: 25px;
  }
}

.copyright {
  display: flex;
  align-items: center;
  justify-content: right;

  p {
    font-size: 12px;
    line-height: 80px;
    color: #cccccc;
  }
}
</style>