<template>
	<div id="app">
		<v-app id="cbus-remembers-memorial">
			<v-card class="mx-auto" elevation="3">
				<img :src="cbus" alt="Columbus Skyline" width="100%" ref="cbus" />
				<v-card-title class="d-flex justify-space-between">
					<v-col class="text-center"><span>Date</span></v-col>
					<v-col class="text-center"><span>New Deaths</span></v-col>
					<v-col class="text-center"><span>Cumulative Deaths</span></v-col>
				</v-card-title>
				<v-card-subtitle class="d-flex justify-space-between">
					<v-col class="text-center"
						><span class="title">{{ displayDate }}</span></v-col
					>
					<v-col class="text-center"
						><span class="title">{{ displayNewDeaths }}</span></v-col
					>
					<v-col class="text-center"
						><span class="title">{{ displayCumulativeDeaths }}</span></v-col
					>
				</v-card-subtitle>
				<v-container width="80%">
					<v-slider
						v-model="selectedDay"
						:color="color"
						track-color="grey"
						min="0"
						:max="dateCountTotals.length - 1"
						@change="selectDate()"
					>
					</v-slider>
				</v-container>
				<div
					v-for="star in stars"
					:key="star.date"
					:class="star.class"
					:style="`left:${star.style.left}px; top:${star.style.top}px;`"
				></div>
			</v-card>
		</v-app>
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
			color: "blue",
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
		displayDate() {
			const chosenDate = new Date(this.dateCountTotals[this.selectedDay]?.date);
			return chosenDate.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			});
		},
		displayNewDeaths() {
			return this.dateCountTotals[this.selectedDay]?.newDeaths;
		},
		displayCumulativeDeaths() {
			return this.dateCountTotals[this.selectedDay]?.cumulativeDeaths;
		},
		skyHeight() {
			return this.$refs.cbus.clientHeight;
		},
		skyWidth() {
			return this.$refs.cbus.clientWidth;
		}
	},
	methods: {
		selectDate() {
			this.stars = [];
			for (
				let i = 0;
				i < this.dateCountTotals[this.selectedDay].cumulativeDeaths;
				i++
			) {
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
			return array.sort((a, b) => new Date(a.date) - new Date(b.date));
		},
		increment() {
			this.selectedDay++;
		},
		decrement() {
			this.selectedDay--;
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
