<template>
	<v-app id="app">
		<v-card class="mx-auto" elevation="3">
			<div>
				<img :src="cbus" alt="Columbus Skyline" width="100%" ref="cbus" />
				<star
					v-for="star in stars"
					:key="star.date"
					:star="star"
					:imageCBUS="$refs.cbus"
				/>
			</div>
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
import cbus from "./assets/CBUS-memorial-photo.jpg";
import backupData from "./deaths.json";
import Controls from "./components/Controls.vue";
import Star from "./components/Star.vue";

export default {
	components: { Controls, Star },
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
		stars() {
			let starsArray = [];
			const newStars = this.dateCountTotals[this.selectedDay].newDeaths;
			const totalStars = this.dateCountTotals[this.selectedDay]
				.cumulativeDeaths;
			if (this.dateCountTotals.length > 0) {
				for (let i = 0; i < newStars; i++) {
					starsArray.push({
						class: "new-star"
					});
				}
				for (let i = 0; i < totalStars - newStars; i++) {
					starsArray.push({
						class: "old-star"
					});
				}
			}
			return starsArray;
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
			const response = await axios.get(requestedURL);
			this.dailyDeaths = this.compressDeathData(response.data);
		} catch (error) {
			const response = await axios.get(proxyURL + requestedURL);
			this.dailyDeaths = this.compressDeathData(response.data);
		}
	}
};
</script>
