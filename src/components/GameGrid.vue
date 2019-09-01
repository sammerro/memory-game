<template>
  <section class="game-grid">
    <slot></slot>
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
  position: relative;
  grid-template-columns: $tile-size $tile-size $tile-size $tile-size;
  grid-template-rows: $tile-size $tile-size $tile-size $tile-size;
  grid-gap: 1em;
  @media (max-width: 370px) {
    grid-template-columns: $tile-size-small $tile-size-small $tile-size-small $tile-size-small;
    grid-template-rows: $tile-size-small $tile-size-small $tile-size-small $tile-size-small;
  }
  .restart-button {
    position: absolute;
    top: -3.5rem;
    right: 0;
    cursor: pointer;
    padding: 0.75rem 1rem;
    background-color: #353238;
    color: #817575;
    border: none;
    border-radius: 0.2rem;
    transition: all 0.1s ease;
    opacity: 0.6;
    &:hover {
      opacity: 1;
      transition: none;
    }
    &:active {
      transform: translateY(1px);
    }
  }
}
</style>