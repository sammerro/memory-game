<template>
  <section class="game-grid">
    <game-tile
      :style="{cursor: gameIsWon ? 'auto' : 'pointer', visibility: foundPairs.includes(index)? 'hidden' : 'visible'}"
      @click.native="choose(index)"
      v-for="(imageUrl, index) in imageUrls"
      :key="index"
      :reveal="chosenTiles.includes(index)"
      :imageUrl="imageUrl"
    ></game-tile>
  </section>
</template>

<script>
import GameTile from "@/components/GameTile.vue";
import { setTimeout } from "timers";
export default {
  components: {
    GameTile
  },
  props: {
    imageUrls: {
      type: Array
    }
  },
  data() {
    return {
      freeze: false,
      chosenTiles: [],
      foundPairs: [],
      round: 0,
      startTime: 0
    };
  },
  computed: {
    endOfRound() {
      return this.chosenTiles.length === 2;
    },
    roundIsWon() {
      return (
        this.chosenTiles.length === 2 &&
        this.imageUrls[this.chosenTiles[0]] ===
          this.imageUrls[this.chosenTiles[1]]
      );
    },
    gameIsWon() {
      return (
        this.foundPairs.length > 0 &&
        this.foundPairs.length === this.imageUrls.length
      );
    }
  },
  watch: {
    gameIsWon(val) {
      if (val) {
        this.$emit("win");
      }
    }
  },
  methods: {
    choose(index) {
      if (
        this.freeze ||
        this.chosenTiles.includes(index) ||
        this.foundPairs.includes(index)
      )
        return;
      this.chosenTiles.push(index);
      this.freeze = true;
      setTimeout(() => {
        if (!this.endOfRound) {
          this.freeze = false;
          return;
        } else {
          this.$emit("endOfRound");
          setTimeout(() => {
            if (this.roundIsWon) {
              this.foundPairs = [...this.foundPairs, ...this.chosenTiles];
            }
            this.chosenTiles = [];
            this.freeze = false;
          }, 300);
        }
      }, 300);
    }
  }
};
</script>

<style lang="scss" scoped>
.game-grid {
  display: grid;
  grid-template-columns: $tile-size $tile-size $tile-size $tile-size;
  grid-template-rows: $tile-size $tile-size $tile-size $tile-size;
  grid-gap: 1em;
  @media (max-width: 370px) {
    flex-direction: column-reverse;
    grid-template-columns: $tile-size-small $tile-size-small $tile-size-small $tile-size-small;
    grid-template-rows: $tile-size-small $tile-size-small $tile-size-small $tile-size-small;
  }
}
</style>