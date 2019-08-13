<template>
  <div class="game-container">
    <app-header class="app-header"></app-header>
    <div class="stats">
      <p>Time: {{seconds}} sec.</p>
      <p>Round number: {{round}}</p>
    </div>
    <main class="game-container__main">
      <game-grid
        v-if="renderComponent"
        @win="handleWin()"
        @endOfRound="handleEndOfRound()"
        :imageUrls="mixedDuplicatedImages"
        :key="numberOfGames"
      ></game-grid>
    </main>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import GameGrid from "@/components/GameGrid.vue";

import { _shuffleArray } from "@/helpers/helpers";
import { setInterval, clearInterval } from "timers";

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
      mixedDuplicatedImages: [],
      round: 0,
      startTime: 0,
      seconds: 0,
      intervalId: undefined,
      numberOfGames: 0,
      renderComponent: true
    };
  },
  mounted() {
    this.start();
  },
  methods: {
    start() {
      this.getImages();
      this.shuffle();
      this.startTimer();
      this.round = 0;
    },
    startTimer() {
      const start = new Date();
      this.intervalId = setInterval(() => {
        this.seconds = ((new Date() - start) / 1000).toFixed(1);
      }, 1000 / 60);
    },
    clear() {
      console.log("clear");
      clearInterval(this.intervalId);
    },
    stopTimer() {
      clearInterval(this.intervalId);
    },
    handleEndOfRound() {
      this.round++;
    },
    handleWin() {
      this.stopTimer();
      alert(
        `YOU WON!!!, your time: ${this.seconds} seconds. Number of round: ${this.round}`
      );
      this.forceRerender();
      this.start();
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
    },
    forceRerender() {
      this.renderComponent = false;

      this.$nextTick().then(() => {
        this.renderComponent = true;
      });
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
  background: #0f0c29; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #24243e,
    #302b63,
    #0f0c29
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #24243e,
    #302b63,
    #0f0c29
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.app-header {
  flex: 0 0 2em;
  color: antiquewhite;
}
.game-container__main {
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: rgb(163, 122, 122); */
  flex: 1 0 auto;
}
.stats {
  color: rgb(196, 184, 168);
  text-align: center;
}
</style>
