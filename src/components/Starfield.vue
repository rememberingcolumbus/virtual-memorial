<template>
	<div>
		<img :src="cbusIMG" alt="Columbus Skyline" width="100%" ref="cbusIMG" />
		<star
			v-for="(star, i) in newDeaths"
			:key="i"
			:star="newStar()"
			:imageCBUS="$refs.cbusIMG"
		/>
		<star
			v-for="(star, i) in totalDeaths - newDeaths"
			:key="i + newDeaths"
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
		newDeaths: Number,
		totalDeaths: Number
	},
	data() {
		return {
			cbusIMG: cbusIMG,
			imageBox: {}
		};
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