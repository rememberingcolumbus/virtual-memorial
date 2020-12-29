<template>
  <div id="cbus-memorial">
    <img src="./assets/CBUS-memorial-photo.jpg" alt="Columbus Skyline" />
    <span
      v-for="point in getPoints()"
      class="dot"
      :style="calcPosition()"
    ></span>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "cbus-memorial",
  data() {
    return {
      counties: [
        "Franklin",
        "Delaware",
        "Hocking",
        "Fairfield",
        "Knox",
        "Licking",
        "Montgomery",
        "Madison",
        "Marion",
        "Perry",
        "Pickaway",
        "Union",
      ],
      totalDeaths: 0,
      newDeaths: 0,
    };
  },
  methods: {
    createStar(x, y, type) {
      var elem = document.createElement("div");
      elem.setAttribute("class", type);
      elem.setAttribute("style", "left:" + x + "px;top:" + y + "px;");
      document.getElementsByTagName("body")[0].appendChild(elem);
      return elem;
    },
    anotherStar(typeOfStar) {
      this.createStar(
        Math.floor(Math.random() * skyWidth),
        Math.floor(Math.random() * skyHeight),
        typeOfStar
      );
    },
    drawStars() {
      for (let i = 0; i < this.totalDeaths.value - this.newDeaths; i++) {
        this.anotherStar("old-star");
      }
      for (let i = 0; i < this.newDeaths; i++) {
        this.anotherStar("new-star");
      }
    },
    getCounties() {
      return this.counties.join(",");
    },
    getPoints() {
      return _.range(0, 100);
    },
    calcPosition() {
      return {
        top: _.random(0, 230) + "px",
        left: _.random(0, 210) + "px",
      };
    },
  },
  async created() {
    const response = await axios.get(
      `http://covid.maxheckel.me/api/counties/deaths?counties=${this.getCounties()}`
    );
    response.data;
  },
};
</script>

<style>
.old-star {
    position: relative;
    width: 2px;
    height: 2px;
    background: white;
}

.new-star {
  position: relative;
  width: 3px;
  height: 3px;
  background: yellow;
}

img {
  width: 80%;
  height: 30%;
}

div {
  margin: auto;
  width: 100%;
}
</style>
