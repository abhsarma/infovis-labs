<script>
    import { tweened } from 'svelte/motion';
    import { cubicIn } from 'svelte/easing';
    import {interpolate} from 'd3-interpolate';

    const randnum = (min,max) => Math.round( Math.random() * (max-min) + min );

    // Props declaration
    let {d, i, scroll = $bindable(), yscale} = $props();
    let size = 20;
    let rx = 5;

    //set up grid
	let spacing = 40;
    let column = 10;
	let rows = 10;

    let x = $state(i % column * spacing);
    let y = $state(Math.floor(i / 10) % rows * spacing);
    let fill = $state("#394147");
    let alpha = $state(1.0);
    let textAlpha = $state(0);
    let width = $state(size)

    // Animation parameters
    const tweenParams = {
        duration: 500,
        easing: cubicIn,
        interpolate
    };

    let tFill = tweened(fill, {...tweenParams, delay: i * 10});
    let tAlpha = tweened(alpha, {...tweenParams, duration: 250});
    let tX = tweened(x, {...tweenParams, delay: 500, duration: 500});
    let tY = tweened(y, {...tweenParams, delay: 500, duration: 500});
    let tWidth = tweened(width, {...tweenParams, delay: 500, duration: 500});
    let tTextAlpha = tweened(textAlpha, {easing: cubicIn});

    $effect(() => {
        if (scroll == 0) {
            tX.set(i % column * spacing)
            tY.set(Math.floor(i / 10) % rows * spacing)
            tFill.set("#394147")
        } else if (scroll == 1) {
            tX.set(i % column * spacing, {delay: 100})
            tY.set(Math.floor(i / 10) % rows * spacing, {delay: 100})
            tFill.set(+d.bar ? "#99c125" : "#394147")
            tAlpha.set(0.9)
        } else if (scroll == 2) {
            tX.set(+d.caramel ? randnum(50, 100) :  randnum(250, 300), {delay: 1000})
            tY.set(i*5, {delay: 1000})
            tFill.set(+d.caramel ? "#fec89a" : "#394147")
            tAlpha.set(+d.bar ? 0.7 : 0)
            tWidth.set(size)
            tTextAlpha.set(0, {delay: 100, duration: 250});
        } else if (scroll == 3) {
            tX.set(200)
            tY.set(yscale(d.competitorname))
            tWidth.set(d.winpercent * 2)
            tFill.set(+d.caramel ? "#fec89a" : "#394147")
            tAlpha.set(+d.bar ? 0.7 : 0);
            tTextAlpha.set(1, {delay: 900, duration: 250});
        }
    })
</script>

<rect width={$tWidth} height="{size}" rx="{5}" x="{$tX}" y="{$tY}" fill={$tFill} opacity={$tAlpha}/>
{#if +d.bar}
    <text x={192} dy="15" y={yscale(d.competitorname)} text-anchor="end" opacity={$tTextAlpha}>{d.competitorname}</text>
    <text x={210} dy="15" y={yscale(d.competitorname)} text-anchor="start" opacity={$tTextAlpha}>{d.winpercent.toFixed(2)}</text>
{/if}