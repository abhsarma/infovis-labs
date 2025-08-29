<script>
    import {scaleLinear, scaleBand} from 'd3-scale';
    import { interpolateHcl, interpolateZoom } from 'd3-interpolate';
    import { select, selectAll } from 'd3-selection';
    import { transition } from 'd3-transition';
    import { onMount } from 'svelte';

    let {width, height, root, packLayout} = $props();

    let margin = {top: 20, right: 20, bottom: 20, left: 20};
    let diameter = width - margin.left - margin.right;
    
    let focus = $state(root);
    let nodes = packLayout(root).descendants();
    let view;

    let colorScale = scaleLinear()
        .domain([-1, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(interpolateHcl);

    let svg;
    let node;
    let label;

    // load the data
 	onMount(() => {
        node = select(svg).selectAll('circle');
        label = select(svg).selectAll('text');
        zoomTo([focus.x, focus.y, focus.r * 2]);
    })

    function zoomTo(v) {
        const k = diameter / v[2]; 
        view = v;
        label.attr("transform", (d, i) => `translate(${(nodes[i].x - v[0]) * k},${(nodes[i].y - v[1]) * k})`);
        node.attr("transform", (d, i) => `translate(${(nodes[i].x - v[0]) * k},${(nodes[i].y - v[1]) * k})`);
        node.attr("r", (d, i) => nodes[i].r * k);
    }

    function zoom(e, d) {
        let focus0 = focus; 
        focus = d;

        let zoomTransition = transition()
            .duration(event.altKey ? 7500 : 750)
            .tween("zoom", (d, i) => {
                const interp = interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                return t => zoomTo(interp(t));
            });
    }

    function highlightNode(e, state) {
        if (state) {
            select(e.target).attr("stroke", "#000");
        } else {
            select(e.target).attr("stroke", null);
        }
    }
</script>

<div>
    <svg width={width} height={width} style="background: {colorScale(-1)}" bind:this={svg}>
        <g transform="translate({margin.left + diameter / 2}, {margin.top + diameter / 2})">
            {#each nodes as d, i}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                <circle
                    class="{d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"}"
                    r="{d.r}"
                    fill="{d.children ? colorScale(d.depth) : null}"
                    transform="translate({d.x - diameter / 2}, {d.y - diameter / 2})"
                    onclick={(event) => focus !== d && (zoom(event, d), event.stopPropagation())}
                    onmouseover={(event) => highlightNode(event, true)}
                    onmouseleave={(event) => highlightNode(event, false)}
                    >
                </circle>
            {/each}
            {#each nodes as d, i}
                <text
                    text-anchor="middle"
                    opacity="{focus == d.parent ? 1 : 0}"
                    display="{focus == d.parent ? 'inline' : 'none'}"
                    transform="translate({d.x - diameter / 2}, {d.y - diameter / 2})">
                    {d.data.name}
                </text>
            {/each}
        </g>
    </svg>
</div>

<style>
    .node--leaf {
        fill: white;
    }
</style>