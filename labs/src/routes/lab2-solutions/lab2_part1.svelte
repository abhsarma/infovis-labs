<script>
    import {scaleLinear} from "d3-scale";
    
    // EXAMPLE
    let linearScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, 10])

    console.log(linearScale(20))
    // this maps 0-100 to 0-10
    // you can test:
    // linearScale(0) // return 0
    // linearScale(50) // return 5
    // linearScale(7.9) // return 0.79
    // note that this will not return an error if your
    // input is <0 or >100
    // so linearScale(110) will give you 11

    //------------------------------------------------------------
    // Step 1.1
    // look at the documentation for scaleLinear
    // https://observablehq.com/@d3/d3-scalelinear
    // Define a linear scale that maps 100-300 to 10-1000

    let weightScale = d3.scaleLinear()
        .domain([100, 300])
        .range([10, 1000])

    // weightScale(150) should return 257.5
    // weightScale(250) should return 752.5

    //------------------------------------------------------------
    // Step 1.2
    // Create a linear color scale
    // that maps 0-10 to white-lightblue

    let colorScale = d3.scaleLinear()
        .domain([0, 10])
        .range(["white", "lightblue"])

    // colorScale(5) should return 'rgb(214, 236, 243)'

    //------------------------------------------------------------
    // Step 1.3
    // Create a diverging color scale
    // that maps -32, 0, 32 to blue, white, red.

    let colorDiverge = d3.scaleLinear()
        .domain([-32, 0, 32])
        .range(["blue", "white", "red"])

    // colorDiverge(12) should return 'rgb(255, 159, 159)'
    // colorDiverge(-12) should return 'rgb(159, 159, 255)'

    //------------------------------------------------------------
    // Step 1.4
    // Create a square root scale
    // that maps 0-1000000 to 0-15

    let sqrtScale = d3.scaleSqrt()
        .domain([0, 1000000])
        .range([0, 15])

    // sqrtScale(4000) should return 0.9487...
    // sqrtScale(800000) should return 13.4164...
</script>