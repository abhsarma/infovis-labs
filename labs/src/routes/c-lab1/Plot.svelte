<script>
    import { onMount } from "svelte"
    import { csv } from 'd3-fetch';
    import { scaleBand } from 'd3-scale';

    import Rect from "./Rect.svelte";

    let {scrollIndex = $bindable()} = $props();

    let data = $state();

    // load the data
 	onMount(
		async () => {
			data = await csv('https://raw.githubusercontent.com/fivethirtyeight/data/refs/heads/master/candy-power-ranking/candy-data.csv')
		}
	)

    //set up grid
	let spacing = 40;
    let column = 10;
	let rows = 10;
    
    // set up SVG parameters
    let margin = {top: 20, left: 20, bottom: 20, right: 20};
    let width = column*spacing + margin.right;
    let height = 540;
    
    // modify the dataset and store it as a separate variable
    let dataset = $derived.by(() => {
        if (data) {
            return data.map(d => ({...d, winpercent: +d.winpercent}))
        }
    });
</script>

<svg width={width} height={height}>
    <g transform="translate({margin.left}, {margin.top})">
        {#each dataset as d, i}
            <g class="candy {d.competitorname}">
                <!-- Pass the necessary variables to a Rect component which will handle the animation -->
                <Rect {d} {i} scroll={scrollIndex}/>
            </g>
        {/each}
    </g>
</svg>