<template>
	<div>
		<img :src="cbusIMG" alt="Columbus Skyline" width="100%" ref="cbusIMG" />
		<star
			v-for="(star, i) in countDividedBy100"
			:key="i"
			:star="newStar()"
			:imageCBUS="$refs.cbusIMG"
		/>
		<star
			v-for="(star, i) in cumulativeDividedBy100 - countDividedBy100"
			:key="i + Count"
			:star="totalStar()"
			:imageCBUS="$refs.cbusIMG"
		/>
	</div>
</template>

<script>
import cbusIMG from "../assets/CBUS-memorial-photo.jpg";
import Star from "./Star.vue";

export default {
	components: { Star },
	name: "starfield",
	props: {
		Count: String,
		Cumulative: String
	},
	data() {
		return {
			cbusIMG: cbusIMG,
			imageBox: {}
		};
	},
	computed: {
		countDividedBy100() {
			dividedBy100 = Math.round(this.Count / 100)
			return dividedBy100 > 0 ? dividedBy100 : 0
		},
		cumulativeDividedBy100() {
			dividedBy100 = Math.round(this.Cumulative / 100)
			return dividedBy100 > 0 ? dividedBy100 : 0
		}
	},
	methods: {
		totalStar() {
			return { class: "old-star" };
		},
		newStar() {
			return { class: "new-star" };
		}
	}
};
</script>

<style>
</style>