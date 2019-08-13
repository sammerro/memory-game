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
@import url("https://fonts.googleapis.com/css?family=Beth+Ellen|Libre+Baskerville&display=swap");
@import "src/assets/css/normalize.scss";
* {
  box-sizing: border-box;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-family: "Beth Ellen", cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
