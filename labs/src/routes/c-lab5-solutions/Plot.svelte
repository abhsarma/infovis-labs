<script>
    import {scaleLinear, scaleBand} from 'd3-scale';
    import {extent, min, mean} from 'd3-array';
    import { line, curveBasis } from 'd3-shape';
    import { interpolateViridis } from 'd3-scale-chromatic';
    import { select } from 'd3-selection';
    import { brushY } from 'd3-brush';
    import { onMount } from "svelte";

    let {width, height, categories, data = $bindable()} = $props();

    const kernelDensityEstimator = (kernel, X) => (V) => X.map(
        (x) => [x, mean(V, (v) => kernel(x - v))]
    );

    const kernelEpanechnikov = (k) => (v) => Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;

    function makeDensityArray(dat, start, stop) {
        let result = []
        for (let i = 0; i < n; i++) {
            result[i] = {
                key: categories[i],
                density: kde(dat[i].slice(start, stop)),
            };
        }
        return result;
    }

    const margin = {top: 80, left: 60, bottom: 30, right: 60};
    const dyr = 5; // 2
    const ns = Math.floor((138 - 30) / dyr) + 1.;
    const n = categories.length;
    const n_records = data[0].length;

    const scale_steps = scaleLinear()
        .range([0.5, 1])
        .domain([0, ns]);

    const x = scaleLinear()
        .domain([-1.5, 1.5])
        .range([margin.left, width - margin.right]);

    const kde = kernelDensityEstimator(kernelEpanechnikov(0.12), x.ticks(40));

    const y = scaleLinear()
        .domain([0, 25])
        .range([height - margin.bottom, margin.top]);

    const Month = scaleBand()
        .domain(categories)
        .range([margin.top, height - margin.bottom])
        .paddingInner(1);

    let allDensity = makeDensityArray(data, 0, 30);

    let density = line()
                    .curve(curveBasis)
                    .x((d) => x(d[0]))
                    .y((d) => y(d[1]));

    let allDensity2 = $state( makeDensityArray(data, 0, 30) );

    const delay = 750;
    const by = 1881;
    const ey = 1910;
    let step = $state(0);
    let start_year = $state(by);
    let stop_year = $state(ey);

    setInterval(() => {
        step = step === ns ? 0 : step + 1;
        let [start, stop] = [step * dyr + 0, step * dyr + 30];
        start_year = by + start
        stop_year = ey + start;
        if (stop > n_records) {
            stop_year -= (stop - (n_records - 1));
            stop = n_records - 1;
        }

        allDensity2 = makeDensityArray(data, start, stop);

        setTimeout(() => {}, delay * 0.3);
    }, delay);
</script>

<div>
    <svg width={width} height={height}>
        <g class="date">
            <text class="date baseline-date" x="{390}" y="20" text-anchor="middle">1881 - 1910</text>
            {#if step > 0}
                <text class="date current-date" x="{600}" y="20" text-anchor="middle">{start_year} - {stop_year}</text>
            {/if}
        </g>
        <g class="x-axis" transform="translate(0, {height - margin.bottom})">
            <line x1="{margin.left}" x2="{width - margin.right}" stroke="#333333" stroke-width="1"></line>
            {#each x.ticks(5) as d}
                <g transform="translate({x(d)}, 0)">
                    <line y1="0" y2="6" stroke="#333333" stroke-width="1"></line>
                    <text class="axis"dy ="20" text-anchor="middle">{d}</text>
                </g>
            {/each}
        </g>
        <g class="y-axis" transform="translate({margin.left}, 0)">
            <line y1="{Month.range()[0]}" y2="{Month.range()[1]}" stroke="#979797" stroke-width="1"></line>
            {#each Month.domain() as d}
                <line x1="-6" x2="{width - margin.right - margin.left}" y1={Month(d)} y2={Month(d)} stroke="#333333" stroke-width="1"></line>
                <text class="axis" dx="-8" y={Month(d)} dy ="4" text-anchor="end">{d}</text>
            {/each}
        </g>


        <g class="data joyplot-baseline" transform="translate(0, {margin.bottom})">
            {#each allDensity as d}
                <path class="{d.key}" 
                    d="{density(d.density)}" 
                    transform="translate(0, {Month(d.key) - height})" 
                    fill="{interpolateViridis(scale_steps(0))}"
                    stroke="{interpolateViridis(scale_steps(ns))}">
                </path>
            {/each}
        </g>
        {#if step > 0}
            <g class="data joyplot-updated" transform="translate(0, {margin.bottom})">
                {#each allDensity2 as d}
                    <path class="{d.key} updated" 
                        d="{density(d.density)}" 
                        transform="translate(0, {Month(d.key) - height})" 
                        fill="{interpolateViridis(scale_steps(step))}"
                        stroke="{interpolateViridis(scale_steps(ns))}">
                    </path>
                {/each}
            </g>
        {/if}
    </svg>
</div>

<style>
    text {
        font-size: 11px;
        font-family: sans-serif;
    }

    text.axis {
        text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
    }

    text.dim-label {
        font-size: 12px;
    }

    text.date {
        font-size: 14px;
    }
</style>