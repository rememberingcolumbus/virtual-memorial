<template>
	<div>
		<img :src="cbusIMG" alt="Columbus Skyline" width="100%" ref="cbusIMG" />
		<star
			v-for="(star, i) in Count"
			:key="i"
			:star="newStar()"
			:imageCBUS="$refs.cbusIMG"
		/>
		<star
			v-for="(star, i) in Cumulative - Count"
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