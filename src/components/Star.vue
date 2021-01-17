<template>
	<div
		:key="star.date"
		:class="star.class"
		:style="`left:${randomX()}px; top:${randomY()}px;`"
	>
		<v-icon v-if="star.class == 'new-star'" x-small color="yellow"
			>mdi-star-four-points</v-icon
		>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		star: Object,
		imageCBUS: HTMLImageElement
	},
	methods: {
		randomX() {
			return Math.floor(Math.random() * this.skyWidth);
		},
		randomY() {
			return Math.floor(Math.random() * this.skyHeight * 0.7);
		}
	},
	computed: {
		skyWidth() {
			return this.imageCBUS?.getBoundingClientRect().width || 400;
		},
		skyHeight() {
			return this.imageCBUS?.getBoundingClientRect().height || 400;
		}
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
	position: absolute;
}
</style>