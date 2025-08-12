<script>
    import {geoAlbersUsa, geoPath} from "d3-geo";
    import { feature, mesh } from 'topojson-client';
    import { scaleBand, scaleOrdinal, scaleLinear, scaleSqrt } from 'd3-scale';
    import { sum, max, extent } from "d3-array";
    import { brush } from 'd3-brush';
    import { select } from 'd3-selection';
	import { onMount } from "svelte";

    // this is not best practice for loading data
    // but will do for now
    import USstates from "./states.json"
    import centroids from "./states-centroid-data.json"
  import Page from "../+page.svelte";


    let width = 640, height = 400;
    let margin = { top: 20, left: 60, right: 20, bottom: 80 };

    let projection = geoAlbersUsa();

    // NOTE: path and circleProjection are functions
    let path = geoPath()
                .projection(projection);
    let circleProjection = path.pointRadius(d => 10); 

    let variableOptions = ["name", "population", "unemployment"];
    let sortVar = $state('name');

    let states = feature(USstates, USstates.objects.usStates).features;
    let stateCentroids = centroids.features; // .sort((a, b) => b.properties[sortVar] - a.properties[sortVar])
    let selected = $state(stateCentroids.map(d => false));

    let scatterPlotSVG;

    let xscale = scaleLinear().domain(extent(centroids.features.map(d => d.properties.population))).range([margin.left, width - margin.right]);
    let yscale = scaleLinear().domain([0, max(centroids.features.map(d => d.properties.unemployment))]).range([height - margin.bottom, margin.top]);
    let barData = $state(stateCentroids.sort((a, b) => b.properties[sortVar] < a.properties[sortVar]));
    
    $effect(() => {
        // if there's no selection, show everything
        if (selected.every(d => d === false)) {
            barData = stateCentroids.sort((a, b) => b.properties[sortVar] < a.properties[sortVar])
        } 
        else {
            barData = stateCentroids.sort((a, b) => b.properties[sortVar] < a.properties[sortVar]).filter((d, i) => selected[i]);
        }
    });

    let xscaleStates = $derived(
        scaleBand()
                .domain(barData.map(d => d.properties.name))
                .range([margin.left, width - margin.right])
                .paddingInner(0.1)
    );

    // define colorScale
    let colorScale = scaleOrdinal()
        .domain([false, true])
        .range(["green", "blue"])
        .unknown("green"); 

    function update(event) {
        let ext = event.selection;
        if (ext && ext.length > 0) {
            let minPop = xscale.invert(ext[0][0]);
            let maxPop = xscale.invert(ext[1][0]);
            let minUnemp = yscale.invert(ext[1][1]);
            let maxUnemp = yscale.invert(ext[0][1]);

            let sel = []

            for (let i in stateCentroids) {
                let d = stateCentroids[i];
                sel[i] = (minPop <= d.properties.population && d.properties.population <= maxPop &&
                            minUnemp <= d.properties.unemployment && d.properties.unemployment <= maxUnemp);
            }
            selected = sel;
        } else {
            selected = stateCentroids.map(d => false);
        }
    }

    // Add the brush feature using the brush function from d32
    const brushArea = brush()
        .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("start", function() { selected = stateCentroids.map(d => false) }) // reset the selection
        .on("brush", update);

    onMount(() => {
		select(scatterPlotSVG).append("g").attr("class", "brush").call(brushArea);
	});
  </script>

    <div>
        <h1>Lab 3</h1>
        <svg class="map-vis" height="{height}px" width="{width}px">
            <g transform="scale(0.7)">
                <g class="states">
                    {#each states as state}
                        <path class="states" d={path(state)}/>
                    {/each}
                </g>

                <g class="centroids">
                    {#each stateCentroids as x, i}
                        <path class="symbol" d="{circleProjection(x)}" fill={colorScale(selected[i])}/>
                    {/each}
                </g>
            </g>
        </svg>

        <svg bind:this={scatterPlotSVG} class="scatterplot-vis" height="{height}px" width="{width}px">
            <g>
                {#each stateCentroids as d, i}
                    <circle cx={xscale(d.properties.population)} cy={yscale(d.properties.unemployment)} r="4" fill={colorScale(selected[i])}/>
                {/each}
            </g>

            <g class="x-axis" transform="translate(0, {height - margin.bottom})">
                <text text-anchor="middle" x="{sum(xscale.range())/2}" dy="40" style="font-size: 16px;">Population</text>
                <line x1="{xscale.range()[0]}" x2="{xscale.range()[1]}" y1="0" y2="0"/>
                {#each xscale.ticks(10) as tick}
                    <g transform="translate({xscale(tick)}, 0)">
                        <line class="tick" y1="0" y2="4"/>
                        <text text-anchor="middle" dy="15">{tick}</text>
                    </g>
                {/each}
            </g>

            <g class="y-axis" transform="translate({margin.left}, 0)">
                <text text-anchor="middle" dx="-{sum(yscale.range())/2}" dy={-30} style="font-size: 16px;" transform="rotate(-90)">Unemployment</text>
                <line x1="0" x2="0" y1="{yscale.range()[0]}" y2="{yscale.range()[1]}"/>
                {#each yscale.ticks(10) as tick}
                    <g transform="translate(0, {yscale(tick)})">
                        <line class="tick" x1="0" x2="-4"/>
                        <text text-anchor="end" dx="-4" dy="3">{tick}</text>
                    </g>
                {/each}
            </g>
        </svg>

        <svg class="barplot-vis" height="{height}px" width="{width}px">
            <g>
                {#each barData as d, i}
                    <rect 
                        x={xscaleStates(d.properties.name) + 4} 
                            y={yscale(0) - yscale(d.properties.unemployment)} 
                            height={yscale(d.properties.unemployment)} 
                            width="{xscaleStates.bandwidth()}" 
                            fill="blue"/>
                {/each}
            </g>

            <g class="x-axis" transform="translate(0, {height - margin.bottom})">
                <text text-anchor="middle" x="{sum(xscale.range())/2}" dy="72" style="font-size: 16px;">State</text>
                <line x1="{xscale.range()[0]}" x2="{xscale.range()[1]}" y1="0" y2="0"/>
                {#each barData as d, i}
                    <g transform="translate({xscaleStates(d.properties.name) + xscaleStates.bandwidth()/2}, {12})">
                        <line class="tick" y1="-12" y2="-6"/>
                        <text text-anchor="end" transform="rotate(-45)">{d.properties.name}</text>
                    </g>
                {/each}
            </g>

            <g class="y-axis" transform="translate({margin.left}, 0)">
                <text text-anchor="middle" dx="-{sum(yscale.range())/2}" dy={-30} style="font-size: 16px;" transform="rotate(-90)">Unemployment</text>
                <line x1="0" x2="0" y1="{yscale.range()[0]}" y2="{yscale.range()[1]}"/>
                {#each yscale.ticks(10) as tick}
                    <g transform="translate(0, {yscale(tick)})">
                        <line class="tick" x1="0" x2="-4"/>
                        <text text-anchor="end" dx="-4" dy="3">{tick}</text>
                    </g>
                {/each}
            </g>
        </svg>

        <div class='control'>
            Sort by: 
                <select id="sizeSelection" class="dropdown" bind:value={sortVar}>
                    {#each variableOptions as variable}
                        <option value={variable}>{variable}</option>
                    {/each}
                </select>
        </div>
    </div>

<style>
    div.control {
        display: inline-block;
    }
    
    .states {
        fill: #ccc;
        stroke: #fff;
    }

    .symbol {
        fill-opacity: .8;
        stroke: #fff;
    }

    text {
        font-size: 10px;
    }

    line {
        stroke: #979797;
    }
</style>