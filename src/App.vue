<template>
	<div id="cbus-memorial" ref="app">
		<img :src="cbus" alt="Columbus Skyline" width="100%" />
		<div
			v-for="(star, i) in stars"
			:key="i"
			:class="star.class"
			:style="`left:${star.style.left}px; top:${star.style.top}px;`"
		></div>
		<span>Total Deaths: {{ totalDeaths }}</span>
	</div>
</template>

<script>
import axios from "axios";
import cbus from "./assets/CBUS-memorial-photo.jpg";

export default {
	name: "cbus-remembers",
	data() {
		return {
			cbus: cbus,
			dataURL: "http://covid.maxheckel.me/api/counties/deaths?counties=",
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
				"Union"
			],
			totalDeaths: 0,
			dailyDeathsByCounty: [],
			stars: []
		};
	},
	computed: {
		dailyDeaths() {
			const mergeDailyDeathsObj = {};
			this.dailyDeathsByCounty.forEach(county => {
				for (let [key, value] of Object.entries(county)) {
					if (!mergeDailyDeathsObj[key]) {
						mergeDailyDeathsObj[key] = value;
					} else {
						mergeDailyDeathsObj[key] += value;
					}
				}
			});

			const result = [];
			for (let [key, value] of Object.entries(mergeDailyDeathsObj)) {
				result.push({
					date: key,
					count: value
				});
			}
			return this.sortDaysAscending(result);
		}
	},
	skyHeight() {
		return this.$refs.app.clientHeight;
	},
	skyWidth() {
		return this.$refs.app.clientWidth;
	},
	methods: {
		countyReducer(dailyCountArray) {
			if (dailyCountArray) {
				return dailyCountArray.reduce((acc, day) => {
					if (!acc[day.date]) {
						acc[day.date] = day.count;
					} else {
						acc[day.date] = day.count;
					}
					return acc;
				}, {});
			}
			return [];
		},
		createStar(x, y, type) {
			var elem = this.$el.createElement("div");
			elem.setAttribute("class", type);
			elem.setAttribute("style", "left:" + x + "px;top:" + y + "px;");
			this.$el.getElementByName("cbus-memorial")[0].appendChild(elem);
			return elem;
		},
		randomX() {
			return Math.floor(Math.random() * this.skyWidth);
		},
		randomY() {
			return Math.floor(Math.random() * this.skyHeight * 0.65);
		},
		sortDaysAscending(array) {
			return array.sort((a, b) => Date(a.date) - Date(b.date));
		}
	},
	async created() {
		const proxyURL = "https://cors-anywhere.herokuapp.com/";
		const requestedURL = this.dataURL + this.counties.join(",");
		const response = await axios.get(proxyURL + requestedURL);

		this.totalDeaths = response.data.total;
		this.dailyDeathsByCounty = response.data.counties.map(county => {
			return this.countyReducer(county.days);
		});

		for (let i = 0; i < this.totalDeaths; i++) {
			this.stars.push({
				class: "old-star",
				style: {
					left: this.randomX(),
					top: this.randomY()
				}
			});
		}
	}
};
</script>

<style>
.old-star {
	position: absolute;
	width: 2px;
	height: 2px;
	background: white;
	z-index: 20;
}

.new-star {
	position: relative;
	width: 3px;
	height: 3px;
	background: yellow;
}

div {
	margin: auto;
	width: 100%;
}
</style>
