<template>
	<div
		:key="star.date"
		:class="star.class"
		:style="`left:${star.style.left}px; top:${star.style.top}px;`"
	></div>
</template>

<script>
export default {
	props: {
		star: Object
	}
};
</script>