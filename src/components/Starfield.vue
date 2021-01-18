<template>
	<div>
		<img :src="cbus" alt="Columbus Skyline" width="100%" ref="cbus" />
		<star
			v-for="star in stars"
			:key="star.date"
			:star="star"
			:imageCBUS="$refs.cbus"
		/>
	</div>
</template>

<script>
import cbus from "../assets/CBUS-memorial-photo.jpg";
import Star from "./Star.vue";

export default {
	components: { Star },
	name: "starfield",
	props: {
		newDeaths: Number,
		totalDeaths: Number
	},
	data() {
		return {
			cbus: cbus
		};
	},
	computed: {
		stars() {
			let starsArray = [];
			const newStars = this.newDeaths;
			const totalStars = this.totalDeaths;

			if (this.totalDeaths > 0) {
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
		}
	}
};
</script>

<style>
</style>