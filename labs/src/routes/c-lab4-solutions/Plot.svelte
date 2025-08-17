<script>
    import {scaleLinear, scaleBand} from 'd3-scale';
    import {extent, min} from 'd3-array';
    import { line } from 'd3-shape';
    import { select } from 'd3-selection';
    import { brushY } from 'd3-brush';
    import { onMount } from "svelte";

    let {width, height, data = $bindable()} = $props();

    let svg;

    const margin = {top: 30, left: 60, bottom: 30, right: 60};
    let dimensions = Object.keys(data[0]).filter(d => (d != "name") & (d != 'selected'));

    let yscale = {}

    let xscale = scaleBand().domain(dimensions).range([margin.left, width - margin.right]);

    dimensions.forEach(x => {
        yscale[x] = scaleLinear().domain(extent(data.map(d => +d[x]))).range([height - margin.bottom, margin.top])
    });

    // Returns the path for a given data point.
    function path(d) {
        return line()(dimensions.map(function(p) { return [xscale(p), yscale[p](d[p])]; }));
    }

    const brushWidth = 20;
    let brush = brushY()
        .extent([
            [-(brushWidth / 2), margin.top],
            [brushWidth / 2, height - margin.bottom]
        ])
        .on("start brush end", brushed);

    const selections = new Map();
    let selected = $state(data.map(d => true));

    function brushed(event) {
        let classes = select(this.parentNode).attr('class');
        let key = dimensions.filter((d, i) => classes.includes(d))[0];
        let selection = event.selection;

        if (selection === null) selections.delete(key);
        else selections.set(key, selection.map(yscale[key].invert));

        selected = [];
        data.forEach(d => {
            let active = Array.from(selections).every(([key, [max, min]]) => d[key] >= min && d[key] <= max )
            selected.push(active);
        })
    }

    onMount(() => {
		select(svg).select('g.y-axes').selectAll('g').append('g').call(brush);
	});
</script>

<div>
    <svg width={width} height={height} bind:this={svg}>
        <g class="data">
            {#each data as x, i}
                <path 
                    class="path" 
                    d={path(x)} 
                    fill="none" 
                    stroke="{selected[i] ? '#94d2bd' : '#cccccc'}"
                    opacity="0.5">
                </path>
            {/each}
        </g>

        <g class="y-axes">
            {#each dimensions as dim}
                <g class="{dim}" transform="translate({xscale(dim)}, 0)">
                    <line y1="{yscale[dim].range()[0]}" y2="{yscale[dim].range()[1]}" stroke="#333333" stroke-width="1"></line>
                </g>
                <g class="{dim}-axis-labels" transform="translate({xscale(dim)}, 0)">
                    <text class="dim-label" y="{yscale[dim].range()[1]}" dy="-10" text-anchor="middle">{dim}</text>
                    {#each yscale[dim].ticks(5) as x}
                         <line x1="0" x2="-4" y1={yscale[dim](x)} y2={yscale[dim](x)} stroke="#333333" stroke-width="1"></line>
                         <text class="axis" dx="-4" y={yscale[dim](x)} dy ="4" text-anchor="end">{x}</text>
                    {/each}
                </g>
            {/each}
        </g>
    </svg>
</div>

<style>
    text {
        font-size: 11px;
        font-family: sans-serif;
    }

    text.axis {
        text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
    }

    text.dim-label {
        font-size: 12px;
    }
</style>