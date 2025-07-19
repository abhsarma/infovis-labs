<script>
    import {geoAlbersUsa, geoPath} from "d3-geo";
    import { feature, mesh } from 'topojson-client';
    import { scaleLinear, scaleSqrt } from 'd3-scale';
    import { extent } from "d3-array";

    // this is not best practice for loading data
    // but will do for now
    import USstates from "./states.json"
    import centroids from "./states-centroid-data.json"


    let width = 960, height = 500;
    let margin = { top: 10, left: 10, right: 10, bottom: 40 };

    let projection = geoAlbersUsa();

    // NOTE: path and circleProjection are functions
    let path = geoPath()
      .projection(projection);
    
    // this is how I am mapping variables to circle size (but you may have used a different approach)
    let circleProjection = path.pointRadius(d => sizeScale(d.properties[sizeVar])); 

    let variableOptions = ["none", "population", "unemployment"];
    let sizeVar = $state("none");
    let colorVar = $state("none");

    let states = feature(USstates, USstates.objects.usStates).features;
    let stateCentroids = centroids.features.sort((a, b) => b.properties.population - a.properties.population);

    // define sizeScale
    let sizeScale = $derived(
        scaleSqrt()
            .domain(extent(centroids.features, d => d.properties[sizeVar]))
            .range([4,20])
            .unknown(10)
    );

    // define colorScale
    let colorScale = $derived(
        scaleLinear()
            .domain(extent(centroids.features, d => d.properties[colorVar]))
            .range(["green","blue"])
            .unknown("green")
    );    
  </script>

  <div>
	<h1>Lab 2</h1>
    <div>
        Variable to map to size: 
            <select id="sizeSelection" class="dropdown" bind:value={sizeVar}>
                {#each variableOptions as variable}
                    <option value={variable}>{variable}</option>
                {/each}
            </select><br>
        Variable to map to color: 
            <select id="colorSelection" class="dropdown" bind:value={colorVar}>
                {#each variableOptions as variable}
                    <option value={variable}>{variable}</option>
                {/each}
            </select>
    </div>
	<svg 
        height="{height}px" 
        width="{width}px">

        <!-- add states -->
        <g class="states">
            {#each states as state}
                <path class="states" d={path(state)}/>
            {/each}
        </g>


        <!-- draw circles -->
        <g class="centroids">
            {#each stateCentroids as x}
                <!-- path.pointRadius(d => 10) returns a function -->
                <!-- it takes as an argument a geoJSON variable -->
                <!-- stateCentroids is an array of geoJSON  -->
                {console.log(x)}
                <path
                    class="symbol" 
                    d="{circleProjection(x)}" 
                    fill="{colorScale(x.properties[colorVar])}"/>
            {/each}
        </g>
	</svg>
</div>

<style>
    .states {
        fill: #ccc;
        stroke: #fff;
    }

    .symbol {
        fill-opacity: .8;
        stroke: #fff;
    }
</style>