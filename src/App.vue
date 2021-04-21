<template>
  <div id="app">
    <nav>
      <router-link :to="{ name: 'code', params: { codeBase: 'code' } }">
        ES6 Snippets
      </router-link>
      <router-link :to="{ name: 'code', params: { codeBase: 'algorithms' } }">
        Algorithms
      </router-link>
    </nav>
    <CodeRunner />
  </div>
</template>

<script>
import CodeRunner from "./components/CodeRunner.vue";

export default {
  name: "CodeRunnerApp",
  components: {
    CodeRunner,
  },
};
</script>

<style>
#app {
}

nav {
  display: flex;
  flex-wrap: wrap;
  width: 75%;
}

nav a {
  flex-basis: 150px;
  display: block;
}

nav a:link,
nav a:visited {
  white-space: nowrap;
  background-color: DarkSalmon;
  border: none;
  color: #ffffff;
  padding: 10px 40px;
  text-align: center;
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  text-decoration: none;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  display: inline-block;
  border-left: 1px solid white;
  border-top: 1px solid white;
}
nav a:hover,
nav a:active,
nav a.router-link-active {
  background-color: DarkRed;
}
</style>
