<template>
  <header class="header-container">
    <h1 class="header-logo">
      <nuxt-link to="/">
        <img src="~/assets/logo.png" alt="andmohiko" />
      </nuxt-link>
    </h1>
    <nav>
      <ul>
        <li>
          <nuxt-link to="/">TOP</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/blog">BLOG</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/works">WORKS</nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
.header-container {
  position: fixed;
  top: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 90px;
  padding: 0 30px;
  margin: 0 auto;
  line-height: 90px;
  background-color: rgb(36, 35, 38);

  ul {
    display: flex;
  }

  li {
    margin-left: 4rem;
    list-style-type: none;
  }

  a {
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
    text-decoration: none;
  }

  a:hover {
    opacity: 0.7;
  }
}

.header-logo {
  margin: 6px 0;

  img {
    height: 25px;
  }
}

@media screen and (max-width: 750px) {
  .header-container {
    justify-content: center;
    padding: 0;

    li {
      margin-left: 1.5rem;
    }
  }

  .header-logo {
    img {
      display: none;
    }
  }
}
</style>