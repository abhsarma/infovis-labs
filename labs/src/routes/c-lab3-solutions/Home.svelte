<script>
    import { onMount } from "svelte";
    import { csv } from 'd3-fetch';
    import Plot from './Plot.svelte';

    let data = $state();

    // load the data
 	onMount(
		async () => {
			data = await csv('https://raw.githubusercontent.com/abhsarma/infovis-labs/refs/heads/main/labs/data/COVID_US_cases.csv')
		}
	)

    let dataset = $derived.by(() => {
        if (data) {
            console.log(data);
            return data.map(d => ({
                date: new Date(d.date + 'T12:00:00.000+08:00'),  
                // Convert confirmed cases to numbers; assume 0 if missing (NA)
                newConfirmed: +d.new_confirmed > 0 ? +d.new_confirmed : 0
            }))
        }
    });

    $inspect(dataset);

    let height = 640;
    let width = 960;
</script>

<section>
    <div class="section-container">
        <div>
            <h1>Choose-your-own Labs: Temporal Data</h1>
            <h2>Spiral Days &#127744;</h2>
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