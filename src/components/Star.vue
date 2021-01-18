<template>
	<div :class="star.class" :style="`left:${left()}px; top:${top()}px;`">
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
		left() {
			return Math.floor(Math.random() * this.skyWidth) + this.leftSide;
		},
		top() {
			return Math.floor(Math.random() * this.skyHeight * 0.7) + this.topSide;
		}
	},
	computed: {
		skyWidth() {
			return this.imageCBUS?.getBoundingClientRect().width || 400;
		},
		skyHeight() {
			return this.imageCBUS?.getBoundingClientRect().height || 400;
		},
		leftSide() {
			return this.imageCBUS?.getBoundingClientRect().left || 0;
		},
		topSide() {
			return this.imageCBUS?.getBoundingClientRect().top || 0;
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