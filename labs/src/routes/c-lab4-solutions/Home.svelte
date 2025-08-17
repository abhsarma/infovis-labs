<script>
    import { onMount } from "svelte";
    import { csv } from 'd3-fetch';
    import { min, max } from 'd3-array';
    import {scaleOrdinal} from 'd3-scale';
    import Plot from './Plot.svelte';

    let data = $state();

    // load the data
 	onMount(
		async () => {
			data = await csv('https://gist.githubusercontent.com/jasondavies/1341281/raw/dd0e3eed8c45ea6aba4a22b5b58028046d153559/cars.csv')
		}
	)

    let dataset = $derived.by(() => {
        if (data) {
            return data.map(d => ({...d, selected: true}))
        }
    })

    let height = 640;
    let width = 960;
</script>

<section>
    <div class="section-container">
        <div>
            <h1>Choose-your-own Labs: Multidimensional data</h1>
            <h2>Parallel Coordinates</h2>
        </div>
        {#if data}
            <Plot {width} {height} data={dataset}/>
        {/if}
    </div>
</section>

<style>
    div.section-container {
        width: 1000px;
        margin: auto;
    }
</style>