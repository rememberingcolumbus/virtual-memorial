<template>
	<div id="cbus-memorial" ref="app">
		<img :src="cbus" alt="Columbus Skyline" width="100%" />
		<input
			v-model="selectedDay"
			type="range"
			min="0"
			:max="dateCountTotals.length-1"
			id="date-selector"
			step="1"
			@change="selectDate()"
		/>
		<!-- <span
			><output for="date-selector">{{ "day.date" }}</output></span
		> -->
		<div
			v-for="star in stars"
			:key="star.date"
			:class="star.class"
			:style="`left:${star.style.left}px; top:${star.style.top}px;`"
		></div>
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
			dailyDeaths: [],
			stars: [],
			selectedDay: 0
		};
	},
	computed: {
		dateCountTotals() {
			let cumulativeTotal = 0;

			return this.dailyDeaths.map(day => {
				cumulativeTotal += day.count;
				return {
					date: day.date,
					newDeaths: day.count,
					cumulativeDeaths: cumulativeTotal
				};
			});
		},
		skyHeight() {
			return this.$refs.app.clientHeight;
		},
		skyWidth() {
			return this.$refs.app.clientWidth;
		}
	},
	methods: {
		selectDate() {
			this.stars = [];
			for (let i = 0; i < this.dateCountTotals[this.selectedDay].cumulativeDeaths; i++) {
				this.stars.push({
					class: "old-star",
					style: {
						left: this.randomX(),
						top: this.randomY()
					}
				});
			}
		},
		addCountyToCentralOhioTotals(dailyDeathsByCounty) {
			const totalsForCentralOhioObj = {};

			dailyDeathsByCounty.forEach(county => {
				for (let [key, value] of Object.entries(county)) {
					if (!totalsForCentralOhioObj[key]) {
						totalsForCentralOhioObj[key] = value;
					} else {
						totalsForCentralOhioObj[key] += value;
					}
				}
			});

			return totalsForCentralOhioObj;
		},
		compressDeathData(data) {
			const dateDeathCountByCounty = this.getDaysFromData(data.counties);
			const centralOhioTotalsObj = this.addCountyToCentralOhioTotals(
				dateDeathCountByCounty
			);

			const result = [];
			for (let [key, value] of Object.entries(centralOhioTotalsObj)) {
				result.push({
					date: key,
					count: value
				});
			}
			return this.sortDaysAscending(result);
		},
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
		// createStar(x, y, type) {
		// 	var elem = this.$el.createElement("div");
		// 	elem.setAttribute("class", type);
		// 	elem.setAttribute("style", "left:" + x + "px;top:" + y + "px;");
		// 	this.$el.getElementByName("cbus-memorial")[0].appendChild(elem);
		// 	return elem;
		// },
		getDaysFromData(counties) {
			return counties.map(county => {
				return this.countyReducer(county.days);
			});
		},
		randomX() {
			return Math.floor(Math.random() * this.skyWidth);
		},
		randomY() {
			return Math.floor(Math.random() * this.skyHeight * 0.7);
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

		this.dailyDeaths = this.compressDeathData(response.data);
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
