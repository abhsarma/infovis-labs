<script>
    import { onMount } from "svelte";
    import { csv } from 'd3-fetch';
    import { min, max } from 'd3-array';

    let data = $state();

    // load the data
 	onMount(
		async () => {
			data = // load the data using the csv module from d3-fetch
		}
	)

    let dataset = $derived.by(() => {
        // format the data so that all the numeric fields are actually numbers and not strings
        // also, you might want to give more readable names to some of the fields.
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
            <!-- your code goes here -->
        {/if}
    </div>
</section>

<style>
    div.section-container {
        width: 1000px;
        margin: auto;
    }
</style>