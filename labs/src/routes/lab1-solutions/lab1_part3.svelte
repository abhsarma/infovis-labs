<script>
	import {scaleLinear} from 'd3-scale';
	import {max, extent} from 'd3-array';

	let margin = { top: 20, right: 20, bottom: 20, left: 20 };
	let width = 400;
	let height = 400;

	let dataset = [
		[5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
		[410, 12], [475, 44], [25, 67], [85, 21], [220, 88]
	];

	let xyMax = max(dataset.flatMap(d => d))

	let xScale = scaleLinear()
		.domain([0, xyMax])
		.range([margin.left, width - margin.right]);

	let yScale = scaleLinear()
		.domain([0, xyMax])
		.range([height - margin.bottom, margin.top]);
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

		<g class="x-axis" transform="translate(0, {height - margin.bottom})">
        	<line
            	x1="{xScale.range()[0]}" x2="{xScale.range()[1]}" y1="0" y2="0"
            	stroke="#979797" stroke-width="1"/>

        	{#each xScale.ticks(10) as tick}
            	<line class="tick"
                	x1="{xScale(tick)}"
                	x2="{xScale(tick)}"
                	y1="0"
                	y2="4"
                	stroke="#979797"
                	stroke-width="1"/>
            	<text
                	text-anchor="middle"
                	x="{xScale(tick)}"
                	dx = "0"
                	y="0"
                	dy="15"
                	style="font-size: 10px">{tick}
            	</text>
        	{/each}
    	</g>

		<g class="y-axis" transform="translate({margin.left}, 0)">
			<line 
				x1="0" x2="0" y1="{yScale.range()[0]}" y2="{yScale.range()[1]}"
				stroke="#979797" stroke-width="1"/>

			{#each yScale.ticks(10) as tick}
				<line class="tick" 
					x1="0"
					x2="-4"
					y1="{yScale(tick)}"
					y2="{yScale(tick)}"
					stroke="#979797"
					stroke-width="1"/>
				<text
					text-anchor="end"
					x="0"
					dx="-4"
					y="{yScale(tick)}"
					dy="3"
					style="font-size: 10px">{tick}
				</text>
			{/each}
		</g>
	</svg>
</div>

<style>
/*  CSS styles go here  */
</style>
