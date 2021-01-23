<template>
	<v-app id="app">
		<v-card class="mx-auto" elevation="3">
			<starfield
				:newDeaths="activeDay.newDeaths"
				:totalDeaths="activeDay.cumulativeDeaths"
			/>
			<v-row class="d-flex justify-space-around">
				<v-col cols="12" md="4" class="text-center py-0 py-sm-1">
					<v-card-title
						class="justify-center text-subtitle-2 text-sm-subtitle-1 text-md-h5 text-lg-h4"
						>Date</v-card-title
					>
					<v-card-subtitle
						class="text-md-subtitle-1 text-md-h6 text-lg-h5 text-xl-h4 pb-0"
						>{{ displayDate }}</v-card-subtitle
					>
				</v-col>
				<v-col cols="12" sm="6" md="4" class="text-center py-0 py-sm-1">
					<v-card-title
						class="justify-center text-subtitle-2 text-sm-subtitle-1 text-md-h5 text-lg-h4"
						>New Deaths</v-card-title
					>
					<v-card-subtitle
						class="text-md-subtitle-1 text-md-h6 text-lg-h5 text-xl-h4 pb-0"
						>{{ activeDay.newDeaths }}</v-card-subtitle
					>
				</v-col>
				<v-col cols="12" sm="6" md="4" class="text-center py-0 py-sm-1">
					<v-card-title
						class="justify-center text-subtitle-2 text-sm-subtitle-1 text-md-h5 text-lg-h4"
						>Cumulative Deaths</v-card-title
					>
					<v-card-subtitle
						class="text-md-subtitle-1 text-md-h6 text-lg-h6 text-xl-h4 pb-0"
						>{{ activeDay.cumulativeDeaths }}</v-card-subtitle
					>
				</v-col>
			</v-row>
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
					:stopPlayer="selectedDay >= dateCountTotals.length - 1"
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
			color: "#30f",
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
			if (this.selectedDay < this.dateCountTotals.length - 1) {
				this.selectedDay++;
			}
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
<style>
div.v-card__title {
	word-break: normal;
}
</style>
