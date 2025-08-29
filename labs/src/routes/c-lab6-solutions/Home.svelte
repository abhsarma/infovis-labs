<script>
    import { onMount } from "svelte";
    import { json } from 'd3-fetch';
    import { min, max } from 'd3-array';
    import {scaleOrdinal} from 'd3-scale';
    import { hierarchy, pack } from 'd3-hierarchy';
    import Plot from './Plot.svelte';

    let data = $state();

    let height = 720;
    let width = 720;
    let margin = 20;

    // Create the pack layout.
    let packLayout = pack()
        .size([width - margin * 2, height - margin * 2])
        .padding(3);

    // load the data
 	onMount(
		async () => {
			data = await json('https://raw.githubusercontent.com/abhsarma/infovis-labs/refs/heads/main/labs/data/household.json')
		}
	)

    let root = $derived.by(() => {
        if (data) {
            return hierarchy(data)
                    .sum(function(d) { return d.value; })
                    .sort(function(a, b) { return b.value - a.value; });
        }
    });
</script>

<section>
    <div class="section-container">
        <div>
            <h1>Choose-your-own Labs: Hierarchy</h1>
            <h2>Zoomable Circle Packing</h2>
        </div>
        {#if data}
            <Plot {width} {height} {root} {packLayout}/>
        {/if}
    </div>
</section>

<style>
    div.section-container {
        width: 1000px;
        margin: auto;
    }
</style>