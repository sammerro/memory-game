<template>
  <div class="game-container">
    <app-header class="app-header"></app-header>
    <main class="game-container__main">
      <game-grid :imageUrls="mixedDuplicatedImages"></game-grid>
    </main>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import GameGrid from "@/components/GameGrid.vue";

import { _shuffleArray } from "@/helpers/helpers";

export default {
  props: {
    /*     sizeOfImage: {
      type: Number,
      default: 80
    } */
  },
  components: {
    AppHeader,
    GameGrid
  },
  data() {
    return {
      images: [],
      mixedDuplicatedImages: []
    };
  },
  mounted() {
    this.getImages();
    this.start();
  },
  methods: {
    start() {
      this.shuffle();
    },
    shuffle() {
      this.mixedDuplicatedImages = _shuffleArray([
        ...this.images,
        ...this.images
      ]);
    },
    getImages() {
      this.images = Array.from(
        { length: 8 },
        (v, i) => `https://picsum.photos/id/${i * 100 + 15}/70/70`
      );
    }
  }
};
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-items: center;
  align-content: center;
}
.app-header {
  flex: 0 0 6em;
}
.game-container__main {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(192, 99, 99);
  flex: 1 0 auto;
}
</style>
