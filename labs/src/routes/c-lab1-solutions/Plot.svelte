<script>
    import { onMount } from "svelte"
    import { csv } from 'd3-fetch';
    import { scaleBand } from 'd3-scale';

    import Rect from "./Rect.svelte";

    let {scrollIndex = $bindable()} = $props();

    let data = $state();

 	onMount(
		async () => {
			data = await csv('https://raw.githubusercontent.com/fivethirtyeight/data/refs/heads/master/candy-power-ranking/candy-data.csv')
		}
	)

    //set up grid
	let spacing = 40;
    let column = 10;
	let rows = 10;
    
    let margin = {top: 20, left: 20, bottom: 20, right: 20};
    let width = column*spacing + margin.right;
    let height = 540;
    
    let dataset = $derived.by(() => {
        if (data) {
            return data.map(d => ({...d, winpercent: +d.winpercent})).sort((a, b) => b.winpercent - a.winpercent);
        }
    });

    let yscale = $derived.by(() => {
        if (data) {
            return scaleBand().domain(dataset.filter(d => +d.bar).map(d => d.competitorname)).range([margin.top, height - margin.bottom]);
        }
    });
</script>

<svg width={width} height={height}>
    <g transform="translate({margin.left}, {margin.top})">
        {#each dataset as d, i}
            <g class="candy {d.competitorname}">
                <!-- <rect width={size} height="{size}" rx="{5}" x="{i % column * spacing}" y="{Math.floor(i / 10) % rows * spacing}"/> -->
                <!-- <Rect width={size} height={size} rx={5} x={i % column * spacing} y={Math.floor(i / 10) % rows * spacing}/> -->
                <Rect {d} {i} scroll={scrollIndex} {yscale}/>
            </g>
        {/each}
    </g>
</svg>