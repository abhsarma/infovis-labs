<script>
    import { onMount } from "svelte";
    import { csv } from 'd3-fetch';
    import { extent } from 'd3-array';
    import Plot from './Plot.svelte';

    let data = $state();

    // load the data
 	onMount(
		async () => {
			data = await csv('https://raw.githubusercontent.com/abhsarma/infovis-labs/refs/heads/main/labs/data/gapminder_subset.csv')
		}
	)

    let dataset = $derived.by(() => {
        if (data) {
            return data.map(d => ({
                // Besides converting the types, we also simpilify the variable names here.
                country: d.country,
                continent: d.continent,
                year: +d.year, // using + to convert to numbers; same below
                lifeExp: +d.life_expectancy, 
                income: +d.income_per_person, 
                gdp: +d.gdp_per_capita, 
                childDeaths: +d.number_of_child_deaths / 1000,
                population: +d.population
            }))
        }
    });

    let yearRange = $derived.by(() => {
        if (data) {
            return extent(dataset.map(d => d.year));
        }
    });

    let height = 640;
    let width = 960;
</script>

<section>
    <div class="section-container">
        <div>
            <h1>Choose-your-own Labs: Interactivity & Animation</h1>
            <h2>Gapminder</h2>
        </div>
        {#if data}
            <Plot {width} {height} data={dataset} {yearRange}/>
        {/if}
    </div>
</section>

<style>
    div.section-container {
        width: 1000px;
        margin: auto;
    }
</style>