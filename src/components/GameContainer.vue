<template>
  <div class="in-two-container">
    <div class="records">
      <h2>Records Book</h2>

      <span v-if="loading">Loading Data...</span>
      <ol v-else>
        <li
          v-for="(record, index) in showMore? recordsSrorted : recordsSrorted.slice(0,3)"
          :key="index"
          :style="{color: placeColor(index + 1), marginBottom: index === 2 ? '2rem': 'auto', position: 'relative'}"
        >
          <p class="number">{{index + 1}}.</p>
          <p class="name" :style="{color: placeColor(index + 1)}">{{record.nick}}</p>
          <p class="rounds" :style="{color: placeColor(index + 1)}">
            <span class="bigger" :style="{color: placeColor(index + 1)}">{{record.rounds}}</span> rounds
          </p>
          <p class="time" :style="{color: placeColor(index + 1)}">{{record.time}} s.</p>
          <a
            v-if="index===2"
            style="color: gray; font-size: 1rem; cursor: pointer; position: absolute; bottom: -2rem; left: 50%; transform: translateX(-50%)"
            @click="showMore = !showMore"
          >{{showMore? 'Show less...' : "Show More..."}}</a>
        </li>
      </ol>
    </div>
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
        >
          <button class="restart-button" @click="restart()">
            <font-awesome-icon :icon="seconds===0 ? 'play' : 'redo'"></font-awesome-icon>
          </button>
        </game-grid>
      </main>
    </div>
    <app-modal @close="modal = false" v-if="modal">
      <template #header>
        <h3 class="modal__header">You won!</h3>
      </template>
      <template #body>
        <p>Rounds: {{round}}</p>
        <p>Time: {{seconds}} seconds</p>
        <div class="input__container">
          <label for="name">Your&nbsp;name:</label>
          <input v-model="name" type="text" id="name" />
        </div>
      </template>
      <template #footer>
        <p>Do you want to save your results?</p>
        <div class="btn__container">
          <button class="btn btn--yes" @click="modalYes()">Yes</button>
          <button class="btn btn--no" @click="modalNo()">No</button>
        </div>
      </template>
    </app-modal>
  </div>
</template>

<script>
import { db } from "@/main";
import AppHeader from "@/components/AppHeader.vue";
import AppModal from "@/components/AppModal.vue";
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
    AppModal,
    AppHeader,
    GameGrid
  },
  data() {
    return {
      modal: false,
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
      recordsCollection: [],
      showMore: false,
      name: ""
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
    placeColor(place) {
      if (place === 1) return "gold";
      if (place === 2) return "silver";
      if (place === 3) return "#cd7f32";
    },
    getDbData() {
      this.loading = true;
      this.recordsCollection = [];
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
    restart() {
      this.stopTimer();
      this.forceRerender();
      this.start();
    },
    start() {
      this.getImages();
      this.shuffle();
      this.round = 0;
      this.startTimer();
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
    saveCurrentResults() {
      if (this.name) {
        db.collection("records")
          .add({
            nick: this.name,
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
    },
    modalYes() {
      this.saveCurrentResults();
      this.modal = false;
      this.forceRerender();
      this.start();
    },
    modalNo() {
      this.modal = false;
      this.forceRerender();
      this.start();
    },
    handleWin() {
      this.stopTimer();
      this.modal = true;
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
$text-dark: rgb(48, 48, 48);
.in-two-container {
  display: flex;
  background-color: #353238;
  color: $text-dark;
  @media (max-width: 750px) {
    flex-direction: column-reverse;
  }
}
.records {
  color: rgb(245, 245, 245);
  padding: 1rem 0;
  flex: 0 0 25rem;
  @media (max-width: 750px) {
    flex: 0 0 100%;
  }
  font-size: 0.875rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  overflow: auto;
  height: 100vh;
  span {
    font-weight: 700;
    margin-right: 1rem;
  }
  ol {
    width: 90%;
    list-style: none;
    padding-left: 0;
    margin: 1rem auto auto;
    list-style-type: decimal;
    li {
      border-bottom: 1px dashed #6b6570;
      display: flex;
      align-content: center;
      align-items: center;
      list-style-type: decimal;
      margin: auto;
      .number {
        font-weight: 700;
        margin: 0 1rem 0 0;
      }
      .name {
        text-align: left;
        margin-right: auto;
        font-size: 1.25rem;
        color: rgb(245, 245, 245);
      }
      .rounds {
        flex: 0 0 4rem;
        text-align: right;
        color: #bebebe;
        margin: 0.25rem;
        .bigger {
          color: white;
          font-size: 1.125rem;
        }
      }
      .time {
        flex: 0 0 4rem;
        margin: 0.25rem;
        text-align: right;
        color: #bebebe;
      }
    }
  }
}
.input__container {
  display: flex;
  flex-direction: column;
  & > * {
    display: block;
  }
  label {
    margin-bottom: 0.375rem;
  }
  input {
    padding: 0.25rem 0.25rem;
    background-color: #ffffff;
  }
}
.game-container {
  position: relative;
  flex: 1 0 30%;
  min-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-items: center;
  align-content: center;
  align-items: center;
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
  flex: 1 0 auto;
}
.stats {
  color: rgb(196, 184, 168);
  text-align: center;
}
.gold {
  background-color: gold;
}
.modal {
  &__header {
    color: text;
  }
}
.btn {
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  cursor: pointer;
  background: #efefef;
  padding: 0.5rem 1rem;
  border-radius: 2px;
  /* inherit font & color from ancestor */
  color: inherit;
  font: inherit;
  &__container {
    display: flex;
    justify-content: space-around;
  }
  &--yes {
    background-color: #694e85;
    color: rgb(245, 245, 245);
  }
  &--no {
    background-color: #848385;
    color: rgb(245, 245, 245);
  }
}
</style>
