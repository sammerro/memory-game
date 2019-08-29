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
  // background-color: rgb(126, 81, 81);
  background: #3c3b3f; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to left,
    #605c3c,
    #3c3b3f
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left,
    #605c3c,
    #3c3b3f
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.tile-container:hover {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}
.tile {
  width: 70px;
  height: 70px;
  // clip-path: circle(0%);
  // clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%);
  opacity: 0;
  transition: all 0.3s ease-in-out;
}

.tile-revealed {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  opacity: 0.8;
  clip-path: circle(100%);
  // clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}
</style>