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
        <small>© 2022 @andmohiko</small>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.footer-container {
  height: 80px;
  background-color: #111;
  display: flex;
  padding: 33px;
  justify-content: space-between;
}

.links {
  display: flex;
  justify-content: left;
  align-items: center;

  img {
    height: 22px;
    width: 22px;
    margin-right: 25px;
  }
}

.copyright {
  display: flex;
  justify-content: right;
  align-items: center;

  p {
    line-height: 80px;
    color: #ccc;
    font-size: 12px;
  }
}
</style>