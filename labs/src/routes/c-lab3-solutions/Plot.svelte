<script>
    import { max } from 'd3-array';
    import { scaleLinear, scaleSequential, scaleSequentialPow } from 'd3-scale';
    import { interpolateYlGnBu } from 'd3-scale-chromatic';
    import {timeFormat} from 'd3-time-format'; 
    import {select} from 'd3-selection';
    import {utcFormat} from 'd3-time-format';
    
    import {spiralArc} from './spiral.js';

    import Path from './Path.svelte'
    

    let {width, height, data = $bindable()} = $props();
    
    const margin = {top: 80, left: 100, bottom: 60, right: 60};

    const svg = select('svg');

    // const WIDTH = 10;
    const BASE_RADIUS = 30;
    const OFFSET = 0.2
    const angle = Math.PI * 2 / 365;

    let caseScale = scaleLinear().domain([1, max(data.map(d => d.newConfirmed))]).range([1, 150]);
    let colorScale = scaleSequentialPow(interpolateYlGnBu).exponent(1/2).domain([0, max(data.map(d => d.newConfirmed))]);

    let path = [];
    let color = [];
    let yearTimeStamp = [];
    let monthTimeStamp = [];

    for (let index = 0; index < data.length; index++) {
        const fromAngle = angle * index;
        const toAngle = angle * (index + 1);

        let w = caseScale(data[index].newConfirmed);

        const fromRadius =  BASE_RADIUS + index * OFFSET - w/2;
        const toRadius = BASE_RADIUS + index * OFFSET - w/2;

        path.push(spiralArc(fromRadius, toRadius, w, fromAngle, toAngle));
        color.push(colorScale(data[index].newConfirmed));

        if (data[index].date.getDate() === 12 && data[index].date.getMonth() === 0) {
            let yearRadius = fromRadius;
            let yearAngle = fromAngle - angle * 12;
            yearTimeStamp.push([data[index].date, Math.sin(yearAngle) * yearRadius, -Math.cos(yearAngle) * yearRadius])
        }

        if (data[index].date.getDate() === 1){
            let textRadius = fromRadius + 30 // A magic number - feel free to improve!
            monthTimeStamp.push([data[index].date, Math.sin(fromAngle) * textRadius, -Math.cos(fromAngle) * textRadius])
        }
    }

    const formatYear = timeFormat("%Y");
    const formatMonth = timeFormat("%b");    // 'Jan', 'Feb', 'Mar', ...

    const legendData = [50000, 100000, 250000, 500000, 1000000, 1500000];

    let visible = $state(false);
    let tooltipData = $state();
    let tooltipPos = $state({x: 0, y: 0});

    function updateTooltip(event, i, state) {
        console.log(state);
        tooltipPos = {x: event.pageX + 20, y: event.pageY - 20};
        visible = state;
        tooltipData = data[i];
    }

    const formatTime = utcFormat("%b %d, %Y");
</script>

<div>
    <p>
        Data based on Google's <a href="https://health.google.com/covid-19/open-data/raw-data">COVID-19 Open Data Repository</a>.<br/><br/>
        We use the USA column in <i>Epidemiology.csv</i> and set 'NA' to 0. Here we use the same scale for all bars' height. It seems that neither New York Times' cyclic time or those redesigns gave us the whole picture.
    </p>
    <svg width={width} height={height}>
        <g class="data" transform='translate(300,300)'>
            {#each path as d, i}
                <!-- <path d={d} fill={color[i]}></path> -->
                <Path {d} fill={color[i]} showTooltip={(e) => updateTooltip(e, i, true)} hideTooltip={(e) => updateTooltip(e, i, false)}/>
            {/each}
            {#each yearTimeStamp as d}
                <g transform="translate({d[1]}, {d[2]})">
                    <text class="labels">{formatYear(d[0]).toLowerCase()}</text>
                </g>
            {/each}
            {#each monthTimeStamp.slice(-12) as d}
                <g transform="translate({d[1]}, {d[2]})">
                    <text class="labels">{formatMonth(d[0]).toUpperCase()}</text>
                </g>
            {/each}
        </g>
        <g class="legend">
            {#each legendData as d, i}
                <text class="legend"x="{480 + 32*i}" y={16 + caseScale(max(legendData))/2 - caseScale(d)/2} text-anchor="middle">{d < 1e6 ? d/1000 + "K" : d/1e6 + "M"}</text>
                <rect height={caseScale(d)} width="8" x="{480 + 32*i}" y={24 + caseScale(max(legendData))/2 - caseScale(d)/2} rx="4" fill={colorScale(d)}></rect>
            {/each}
        </g>
    </svg>

     <div id="tooltip" class={visible ? '' : 'not-visible'} style="left: {tooltipPos.x}px; top: {tooltipPos.y}px;">
        {#if tooltipData}
            <!-- {console.log(tooltipData)} -->
            <strong>{formatTime(tooltipData.date)}</strong><br/>New confirmed cases: {tooltipData.newConfirmed}
        {/if}
    </div>
</div>

<style>
    svg {
        background-color: #fff;
        position: relative;
    }

    .labels {
        font-weight: 500;
        font-size: 12px;
        text-anchor: 'middle';
        font-family: 'Helvetica', 'sans-serif';
        paint-order: stroke;
        stroke: #ffffffaa;
        stroke-width: 3px;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    text.legend{
        font-size: 12px;
        font-family: 'Helvetica', 'sans-serif';
    }

    div#tooltip {
        position: absolute; /* So we can move it with the cursor */        
        font-size: 14px;
        font-family: 'Helvetica', 'sans-serif';
        width: 200px;
        padding: 12px;
        border: 2px solid #eeeeee;
        background-color: #fff;
        z-index: 99;
    }

    .not-visible {
        display: none;
    }
</style>