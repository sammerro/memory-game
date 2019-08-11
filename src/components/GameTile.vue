<template>
  <div class="tile-container">
    <!-- 'tile-guessed' : guessed -->
    <div
      class="tile"
      :class="{'tile-revealed': reveal,  }"
      :style="{backgroundImage: `url(${imageUrl})`}"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    /*     guessed: {
      type: Boolean,
      default: false
    }, */
    reveal: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
.tile-container {
  border-radius: 0.2em;
  overflow: visible;
  background-color: rgb(126, 81, 81);
}
.tile {
  width: 70px;
  height: 70px;
  clip-path: circle(0%);
  // clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%);
  transition: all 0.5s ease-in-out;
}
.tile-revealed {
  clip-path: circle(100%);
  // clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}
</style>