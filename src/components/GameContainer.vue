<template>
  <div class="in-two-container">
    <div class="records">
      <h2>RECORD book :)</h2>
      <span v-if="loading">Loading Data...</span>
      <ol v-else>
        <li v-for="(record, index) in recordsSrorted" :key="index">
          <p class="name">{{record.nick}}:</p>
          <p>{{record.rounds}} rounds.</p>
          <p>{{record.time}} seconds.</p>
        </li>
      </ol>
    </div>
    <div class="game-container">
      <app-header class="app-header"></app-header>
      <div class="stats">
        <p>Time: {{seconds}} sec.</p>
        <p>Round number: {{round}}</p>
      </div>
      <div class="in-two-container"></div>
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
  </div>
</template>

<script>
import { db } from "@/main";
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
      errors: undefined,
      loading: false,
      images: [],
      mixedDuplicatedImages: [],
      round: 0,
      startTime: 0,
      seconds: 0,
      intervalId: undefined,
      numberOfGames: 0,
      renderComponent: true,
      recordsCollection: []
    };
  },
  mounted() {
    this.getDbData();
    this.start();
  },
  computed: {
    recordsSrorted() {
      return this.recordsCollection.sort(
        (a, b) => (a.rounds - b.rounds) * 10000 + (a.time - b.time)
      );
    }
  },
  methods: {
    getDbData() {
      this.loading = true;
      db.collection("records")
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            this.recordsCollection.push(doc.data());
          });
          this.loading = false;
        });
      console.log(db);
    },
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
      // this.handleWin();
    },
    handleWin() {
      this.stopTimer();
      alert(
        `YOU WON!!!, your time: ${this.seconds} seconds. Number of round: ${this.round}`
      );
      let name = prompt(
        "SIGN your name, so the world remembers your achievement!",
        name
      );
      this.forceRerender();
      if (name) {
        db.collection("records")
          .add({
            nick: name,
            rounds: this.round,
            time: this.seconds
          })
          .then(res => {
            if (res) {
              console.log(res);
            }
            this.getDbData();
          });
      }
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

<style lang="scss" scoped>
.in-two-container {
  display: flex;
  color: #efefef;
  background-color: #544f5a;
}
.name {
  margin-right: auto;
  font-size: 1.25rem;
  color: rgb(245, 245, 245);
}
.records {
  flex: 0 0 30%;
  font-size: 0.875rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
.records ul {
  list-style-type: decimal;
}
.records li {
  border-top: 1px solid whitesmoke;
  display: flex;
  align-content: center;
  align-items: center;
  list-style-type: decimal;
  margin: auto;
}
.game-container {
  flex: 1 0 30%;
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
