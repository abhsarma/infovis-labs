<script>
    import {geoAlbersUsa, geoPath} from "d3-geo";
    import { feature, mesh } from 'topojson-client';
    import { scaleLinear } from 'd3-scale';

    // this is not best practice for loading data
    // but will do for now
    import USstates from "./states.json"
    import centroids from "./states-centroid-data.json"


    let width = 960, height = 500;
    let margin = { top: 10, left: 10, right: 10, bottom: 40 };

    // creates a geoAlbers instance for drawing  
    // the Albers equal-area conic projection
    let projection = geoAlbersUsa();

    // Creates a new geographic path generator using the above projection
    // path is a function that takes a given GeoJSON geometry or feature object 
    // and generates SVG path data string
    let path = geoPath()
      .projection(projection);

    // circleProjection is also a function that takes a given GeoJSON geometry or feature object 
    // and generates SVG path data string
    let circleProjection = path.pointRadius(d => 10);

    let variableOptions = ["none", "population", "unemployment"];

    let states = feature(USstates, USstates.objects.usStates).features;
    let stateCentroids = centroids.features.sort((a, b) => b.properties.population - a.properties.population);
  </script>

  <div>
	<h1>Lab 2</h1>
    <div>
        Variable to map to size: 
            <select id="sizeSelection" class="dropdown">
            </select><br>
        Variable to map to color: 
            <select id="colorSelection" class="dropdown">
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
                <path 
                    class="symbol" 
                    d="{circleProjection(x)}" 
                    fill="green"/>
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