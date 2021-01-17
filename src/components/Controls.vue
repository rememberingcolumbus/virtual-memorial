<template>
	<div class="text-center">
		<v-btn icon large @click.stop="skipToStart()">
			<v-icon>mdi-skip-backward</v-icon>
		</v-btn>
		<v-btn icon large @click.stop="play()">
			<v-icon color="green">mdi-play</v-icon>
		</v-btn>
		<v-btn icon large @click.stop="stop()">
			<v-icon color="red">mdi-stop</v-icon>
		</v-btn>
		<v-btn icon large @click.stop="skipToEnd()">
			<v-icon>mdi-skip-forward</v-icon>
		</v-btn>
	</div>
</template>

<script>
export default {
	name: "Controls",
	data() {
		return {
			interval: 1000,
			player: null
		};
	},
	methods: {
		play() {
			this.player = setInterval(() => {
				this.$emit("nextDay");
			}, this.interval);
		},
		stop() {
			clearInterval(this.player);
		},
		skipToStart() {
			clearInterval(this.player);
			this.$emit("skipToStart");
		},
		skipToEnd() {
			clearInterval(this.player);
			this.$emit("skipToEnd");
		}
	},
	mounted() {
		this.player = setInterval(() => {
			this.$emit("nextDay");
		}, this.interval);
	},
	beforeDestroy() {
		clearInterval(this.player);
	}
};
</script>