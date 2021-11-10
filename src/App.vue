<template>
	<v-app id="app">
		<v-card class="ma-1" elevation="2">
			<starfield
				:Count="activeWeek.Count"
				:Cumulative="activeWeek.Cumulative"
			/>
			<v-row class="d-flex justify-space-around">
				<v-col cols="12" md="4" class="text-center py-0 py-sm-1">
					<v-card-title
						class="
							justify-center
							text-subtitle-2 text-sm-subtitle-1 text-md-h5 text-lg-h4
						"
						>Week Starting</v-card-title
					>
					<v-card-subtitle
						class="text-md-subtitle-1 text-md-h6 text-lg-h5 text-xl-h4 pb-0"
						>{{ displayWeek }}</v-card-subtitle
					>
				</v-col>
				<v-col cols="12" sm="6" md="4" class="text-center py-0 py-sm-1">
					<v-card-title
						class="
							justify-center
							text-subtitle-2 text-sm-subtitle-1 text-md-h5 text-lg-h4
						"
						>New Deaths</v-card-title
					>
					<v-card-subtitle
						class="text-md-subtitle-1 text-md-h6 text-lg-h5 text-xl-h4 pb-0"
						>{{ activeWeek.Count }}</v-card-subtitle
					>
				</v-col>
				<v-col cols="12" sm="6" md="4" class="text-center py-0 py-sm-1">
					<v-card-title
						class="
							justify-center
							text-subtitle-2 text-sm-subtitle-1 text-md-h5 text-lg-h4
						"
						>Cumulative Deaths</v-card-title
					>
					<v-card-subtitle
						class="text-md-subtitle-1 text-md-h6 text-lg-h6 text-xl-h4 pb-0"
						>{{ activeWeek.Cumulative }}</v-card-subtitle
					>
				</v-col>
			</v-row>
			<v-container width="80%">
				<v-slider
					v-model="selectedWeek"
					:color="color"
					track-color="grey"
					min="0"
					:max="weeklyDeaths.length - 1"
				>
				</v-slider>
				<controls
					:stopPlayer="selectedWeek >= weeklyDeaths.length - 1"
					@nextWeek="nextWeek()"
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
			color: "#30f",
			// dataURL: "http://covid.maxheckel.me/api/counties/deaths?counties=",
			// counties: [
			// 	"Franklin",
			// 	"Delaware",
			// 	"Hocking",
			// 	"Fairfield",
			// 	"Knox",
			// 	"Licking",
			// 	"Morrow",
			// 	"Madison",
			// 	"Marion",
			// 	"Perry",
			// 	"Pickaway",
			// 	"Union"
			// ],
			weeklyDeaths: [],
			selectedWeek: 0
		};
	},
	computed: {
		activeWeek() {
			return this.weeklyDeaths[this.selectedWeek];
		},
		// dateCountTotals() {
		// 	let cumulativeTotal = 0;

		// 	return this.dailyDeaths.map(day => {
		// 		cumulativeTotal += day.count;
		// 		return {
		// 			date: day.date,
		// 			newDeaths: day.count,
		// 			cumulativeDeaths: cumulativeTotal
		// 		};
		// 	});
		// },
		displayWeek() {
			return new Date(this.activeWeek?.Week).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			});
		}
	},
	methods: {
		// addCountyToCentralOhioTotals(dailyDeathsByCounty) {
		// 	const totalsForCentralOhioObj = {};

		// 	dailyDeathsByCounty.forEach(county => {
		// 		for (let [key, value] of Object.entries(county)) {
		// 			if (!totalsForCentralOhioObj[key]) {
		// 				totalsForCentralOhioObj[key] = value;
		// 			} else {
		// 				totalsForCentralOhioObj[key] += value;
		// 			}
		// 		}
		// 	});

		// 	return totalsForCentralOhioObj;
		// },
		// compressDeathData(data) {
		// 	const dateDeathCountByCounty = this.getDaysFromData(data.counties);
		// 	const centralOhioTotalsObj = this.addCountyToCentralOhioTotals(
		// 		dateDeathCountByCounty
		// 	);

		// 	const result = [];
		// 	for (let [key, value] of Object.entries(centralOhioTotalsObj)) {
		// 		result.push({
		// 			date: key,
		// 			count: value
		// 		});
		// 	}
		// 	return this.sortDaysAscending(result);
		// },
		// countyReducer(dailyCountArray) {
		// 	if (dailyCountArray) {
		// 		return dailyCountArray.reduce((acc, day) => {
		// 			if (!acc[day.date]) {
		// 				acc[day.date] = day.count;
		// 			} else {
		// 				acc[day.date] = day.count;
		// 			}
		// 			return acc;
		// 		}, {});
		// 	}
		// 	return [];
		// },
		// getDaysFromData(counties) {
		// 	return counties.map(county => {
		// 		return this.countyReducer(county.days);
		// 	});
		// },
		// sortDaysAscending(array) {
		// 	// const filteredArray = array.filter(day => day.date < Date("2020-01-01"));
		// 	return array.sort((a, b) => new Date(a.Week) - new Date(b.Week));
		// },
		nextWeek() {
			if (this.selectedWeek < this.weeklyDeaths.length - 1) {
				this.selectedWeek++;
			}
		},
		skipToStart() {
			this.selectedWeek = 0;
		},
		skipToEnd() {
			this.selectedWeek = this.weeklyDeaths.length - 1;
		},
		async getDataFromSheet() {
			return await axios.get(
				"https://sheet.best/api/sheets/94f6f216-b70c-42f0-82dd-f917ca394a85/tabs/Weekly"
			);
		}
	},
	async created() {
		this.weeklyDeaths = backupData;

		// const proxyURL = "https://cors-anywhere.herokuapp.com/";
		// const requestedURL = this.dataURL + this.counties.join(",");
		try {
			// const response = await axios.get(proxyURL + requestedURL);
			// this.dailyDeaths = this.compressDeathData(response.data);
			const sheetsData = await this.getDataFromSheet();
			this.weeklyDeaths = sheetsData.data;
		} catch (error) {
			console.error(error.message);
		}
	}
};
</script>
<style>
div.v-card__title {
	word-break: normal;
}
</style>
