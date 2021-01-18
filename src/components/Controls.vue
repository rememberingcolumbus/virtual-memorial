<template>
	<div class="text-center">
		<v-btn
			icon
			large
			@click.stop="skipToStart()"
			aria-label="Skip To Start"
			role="button"
			aria-hidden="false"
		>
			<v-icon>mdi-skip-backward</v-icon>
		</v-btn>
		<v-btn
			icon
			large
			@click.stop="play()"
			aria-label="Play"
			role="button"
			aria-hidden="false"
		>
			<v-icon color="green">mdi-play</v-icon>
		</v-btn>
		<v-btn
			icon
			large
			@click.stop="stop()"
			aria-label="Stop"
			role="button"
			aria-hidden="false"
		>
			<v-icon color="red">mdi-stop</v-icon>
		</v-btn>
		<v-btn
			icon
			large
			@click.stop="skipToEnd()"
			aria-label="Skip To End"
			role="button"
			aria-hidden="false"
		>
			<v-icon>mdi-skip-forward</v-icon>
		</v-btn>
	</div>
</template>

<script>
export default {
	name: "Controls",
	props: {
		stopPlayer: Boolean
	},
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
		this.play();
	},
	beforeDestroy() {
		clearInterval(this.player);
	},
	watch: {
		stopPlayer() {
			this.stop();
		}
	}
};
</script>