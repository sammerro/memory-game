<template>
  <div id="app">
    <GameContainer />
  </div>
</template>

<script>
import GameContainer from "./components/GameContainer.vue";

export default {
  name: "app",
  components: {
    GameContainer
  }
};
</script>

<style lang="scss" >
@import "src/assets/css/normalize.scss";
* {
  box-sizing: border-box;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
