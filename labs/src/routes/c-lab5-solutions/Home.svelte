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
			data = await csv('https://raw.githubusercontent.com/abhsarma/infovis-labs/refs/heads/main/labs/data/global-temp.csv')
		}
	)

    const categories = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const _cat = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let dataset = $derived.by(() => {
        if (data) {
            let bymonth = []
            _cat.forEach((item, i) => {
                const t = [];

                data.forEach((d) => {
                    if (d['Year'] != '2019') t.push(+d[item]);
                });
                
                bymonth.push(t);
            });

            return bymonth
        }
    });

    let height = 640;
    let width = 960;
</script>

<section>
    <div class="section-container">
        <div>
            <h1>Choose-your-own Labs: Uncertainty</h1>
            <h2>Ridge line Plots</h2>
        </div>
        {#if data}
            <Plot {width} {height} {categories} data={dataset}/>
        {/if}
    </div>
</section>

<style>
    div.section-container {
        width: 1000px;
        margin: auto;
    }
</style>