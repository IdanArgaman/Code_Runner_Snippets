<template>
  <div id="app">
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
</style>
