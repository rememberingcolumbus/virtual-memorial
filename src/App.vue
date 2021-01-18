<template>
	<v-app id="app">
		<v-card class="mx-auto" elevation="3">
			<starfield
				:newDeaths="activeDay.newDeaths"
				:totalDeaths="activeDay.cumulativeDeaths"
			/>
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
					><span class="title">{{ activeDay.newDeaths }}</span></v-col
				>
				<v-col class="text-center"
					><span class="title">{{ activeDay.cumulativeDeaths }}</span></v-col
				>
			</v-card-subtitle>
			<v-container width="80%">
				<v-slider
					v-model="selectedDay"
					:color="color"
					track-color="grey"
					min="0"
					:max="dateCountTotals.length - 1"
				>
				</v-slider>
				<controls
					@nextDay="nextDay()"
					@skipToStart="skipToStart()"
					@skipToEnd="skipToEnd()"
				/>
			</v-container>
		</v-card>
	</v-app>
</template>

<script>
import axios from "axios";
import backupData from "./deaths.json";
import Starfield from "./components/Starfield.vue";
import Controls from "./components/Controls.vue";

export default {
	components: { Controls, Starfield },
	name: "cbus-remembers",
	data() {
		return {
			color: "blue",
			dataURL: "http://covid.maxheckel.me/api/counties/deaths?counties=",
			counties: [
				"Franklin",
				"Delaware",
				"Hocking",
				"Fairfield",
				"Knox",
				"Licking",
				"Morrow",
				"Madison",
				"Marion",
				"Perry",
				"Pickaway",
				"Union"
			],
			dailyDeaths: [],
			selectedDay: 0
		};
	},
	computed: {
		activeDay() {
			return this.dateCountTotals[this.selectedDay];
		},
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
			const chosenDate = new Date(this.activeDay?.date);
			return chosenDate.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			});
		}
	},
	methods: {
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
		sortDaysAscending(array) {
			return array.sort((a, b) => new Date(a.date) - new Date(b.date));
		},
		nextDay() {
			this.selectedDay++;
		},
		skipToStart() {
			this.selectedDay = 0;
		},
		skipToEnd() {
			this.selectedDay = this.dateCountTotals.length - 1;
		}
	},
	async created() {
		this.dailyDeaths = this.compressDeathData(backupData);

		const proxyURL = "https://cors-anywhere.herokuapp.com/";
		const requestedURL = this.dataURL + this.counties.join(",");
		try {
			// const response = await axios.get(requestedURL);
			// this.dailyDeaths = this.compressDeathData(response.data);
			const response = await axios.get(proxyURL + requestedURL);
			this.dailyDeaths = this.compressDeathData(response.data);
		} catch (error) {
			console.error(error.message);
		}
	}
};
</script>
