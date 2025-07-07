<script>
	import {scaleLinear} from 'd3-scale';
	import {extent} from 'd3-array';

	let margin = { top: 20, right: 20, bottom: 20, left: 20 };
	let width = 400;
	let height = 400;

	let dataset = [
		[5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
		[410, 12], [475, 44], [25, 67], [85, 21], [220, 88]
	];

	// let scale = scaleLinear().domain([100, 500]).range([10, 350]);

	let xScale = scaleLinear()
		.domain([0, max(dataset.map(d => d[0]))])
		// .range([0, 400])
		.range([margin.left, width - margin.right]); // you can also hard code these values

	let yScale = scaleLinear()
		.domain([0, max(dataset.map(d => d[1]))])
		// .range([0, 400])
		.range([height - margin.bottom, margin.top]); // you can also hard code these values
</script>

<div>
	<h1>Lab 1</h1>
	<svg 
		height="{height}px" 
		width="{width}px"
		>
		<!-- you can remove the style line above -->
		<g>
			{#each dataset as d}
				<circle cx="{xScale(d[0])}" cy="{yScale(d[1])}" r="5"/>
			{/each}
		</g>
	</svg>
</div>

<style>
/*  CSS styles go here  */
</style>
