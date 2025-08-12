<script>
    import { min, max, extent } from 'd3-array';
    import { scaleLinear, scaleSqrt, scaleOrdinal } from 'd3-scale';
    import { schemeObservable10 } from 'd3-scale-chromatic';
    import { tweened } from 'svelte/motion';
    import { cubicInOut } from 'svelte/easing';

    import Circle from './Circle.svelte';

    let {width, height, data = $bindable(), yearRange} = $props();
    
    const margin = {top: 80, left: 100, bottom: 60, right: 60};
    const options = ['income', 'lifeExp', 'gdp', 'population', 'childDeaths'];
    const continents = ['Africa', 'Asia', 'Oceania', 'Americas', 'Europe']
    const colorScale = scaleOrdinal(continents, schemeObservable10);

    let currYear = $state(1965);
    let dataset = $derived(data.filter(d => d.year == currYear));

    let xVar = $state('gdp');
    let yVar = $state('lifeExp');
    let rVar = $state('population');

    let xscale = $derived(scaleLinear().domain([0, max(data.map(d => d[xVar]))]).range([margin.left, width - margin.right]));
    let yscale = $derived(scaleLinear().domain([0, max(data.map(d => d[yVar]))]).range([height - margin.bottom, margin.top]));
    let rscale  = $derived(scaleSqrt().domain(extent(data.map(d => d[rVar]))).range([3, 20]));

    const yearScaleMargin = 30;
    const xAdjust = 10;
    const yearScale = scaleLinear().domain(yearRange).range([yearScaleMargin + xAdjust, width - (yearScaleMargin + xAdjust)]);

    let visible = $state(false);
    let tooltipData = $state();
    let tooltipPos = $state({x: 0, y: 0});

    let size = 10; // legend size

    function updateTooltip(event, data, state) {
        tooltipPos = {x: event.pageX + 20, y: event.pageY - 20};
        visible = state;
        tooltipData = data;
    }
</script>

<div>
    <div class="controls">
        <div class="year-control">
            <div class="year-input-container" style="margin-left: {yearScaleMargin}px">
                <input type="range" name="Year" min="{yearRange[0]}" max="{yearRange[1]}" bind:value={currYear} style="width: {width - 2*yearScaleMargin}px"/>
            </div>
            <svg width={width} height="60">
                <g class="input-ticks" transform="translate(0, 30)">
                    {#each yearScale.ticks(10) as tick, i}
                        <line class="tick" x1="{yearScale(tick)}" x2="{yearScale(tick)}" y1="-10" y2="0" stroke="#979797" stroke-width="1"/>
            	        <text text-anchor="middle" x="{yearScale(tick)}" dx = "0" y="0" dy="15" style="font-size: 10px">{tick}</text>
                    {/each}
                </g>
            </svg>
        </div>
        x: 
        <select id="xVarSelection" class="dropdown" bind:value={xVar}>
            {#each options as variable}
                <option value={variable}>{variable}</option>
            {/each}
        </select>
        y: 
        <select id="yVarSelection" class="dropdown" bind:value={yVar}>
            {#each options as variable}
                <option value={variable}>{variable}</option>
            {/each}
        </select>
        size: 
        <select id="rVarSelection" class="dropdown" bind:value={rVar}>
            {#each options as variable}
                <option value={variable}>{variable}</option>
            {/each}
        </select>
    </div>
    <svg width={width} height={height}>
        <g class="data">
            {#each dataset as d, i}
                <Circle {d} {i} x={d[xVar]} y={d[yVar]} r={d[rVar]} xscale={xscale} yscale={yscale} rscale={rscale} fill={colorScale(d.continent)} opacity = 0.5
                showTooltip={(e) => updateTooltip(e, d, true)}
                hideTooltip={(e) => updateTooltip(e, d, false)}/>
            {/each}
        </g>

        <g class="legend">
            {#each continents as continent, i}
                <rect x={i*(size + 150) + 120} y={margin.top/2} width={size} height={size} fill={colorScale(continent)}></rect>
                <text x={i*(size + 150) + 120} y={margin.top/2} dx={size + 4} dy={10} fill={colorScale(continent)}>{continent}</text>
            {/each}
        </g>

       <g class="x-axis" transform="translate(0, {height - margin.bottom})">
        	<line
            	x1="{xscale.range()[0]}" x2="{xscale.range()[1]}" y1="0" y2="0"
            	stroke="#979797" stroke-width="1"/>
            <text x="{(xscale.range()[1] + xscale.range()[0])/2}" dy="36" anchor="end">{xVar}</text>
        	{#each xscale.ticks(10) as tick}
                <g class="x-axis-tick" transform="translate({xscale(tick)}, 0)">
                    <line class="tick" y1="0" y2="4" stroke="#979797" stroke-width="1"/>
                    <text text-anchor="middle" dy="15" style="font-size: 10px">{tick}
                    </text>
                </g>            	
        	{/each}
    	</g>

		<g class="y-axis" transform="translate({margin.left}, 0)">
			<line 
				x1="0" x2="0" y1="{yscale.range()[0]}" y2="{yscale.range()[1]}"
				stroke="#979797" stroke-width="1"/>
            <text x="{-(yscale.range()[0] + yscale.range()[1])/2}" dy="-60" anchor="middle" transform="rotate(-90)">{yVar}</text>
			{#each yscale.ticks(10) as tick}
                <g class="x-axis-tick" transform="translate(0, {yscale(tick)})">
                    <line class="tick" x1="0" x2="-4" stroke="#979797" stroke-width="1"/>
                    <text text-anchor="end" dx="-4" dy="3" style="font-size: 10px">{tick}
                    </text>
                </g>
			{/each}
		</g>
    </svg>

    <div id="tooltip" class={visible ? '' : 'not-visible'} style="left: {tooltipPos.x}px; top: {tooltipPos.y}px;">
        {#if tooltipData}
            <strong>{tooltipData.country}</strong><br/>Continent: {tooltipData.continent}
        {/if}
    </div>
</div>

<style>
    svg {
        background-color: #fff;
        position: relative;
    }

    text {
        font-family: sans-serif;
    }

    div.year-input-container {
        position: fixed;
        z-index: 99;
    }

    #tooltip {
        position: absolute; /* So we can move it with the cursor */
        padding: 10px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        pointer-events: none; /* Prevent tooltip from interfering with mouse events */
        font-size: 12px;
    }

    .not-visible {
        display: none;
    }
</style>