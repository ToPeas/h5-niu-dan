<template>
  <div id="app">
    <Active></Active>
  </div>
</template>

<script>
import Active from './components/Active'
export default {
  name: 'App',
  components: {
    Active,
  },
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
* {
  margin: 0;
}
</style>
