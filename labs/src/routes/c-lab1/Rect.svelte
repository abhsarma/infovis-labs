<script>
    import { tweened } from 'svelte/motion';
    import { cubicIn } from 'svelte/easing';
    import {interpolate} from 'd3-interpolate';

    const randnum = (min,max) => Math.round( Math.random() * (max-min) + min );

    // Props declaration
    let {d, i, scroll = $bindable()} = $props();
    let size = 20;
    let rx = 5;

    //set up grid
	let spacing = 40;
    let column = 10;
	let rows = 10;

    // Animation parameters
    const tweenParams = {
        duration: 500,
        easing: cubicIn,
        interpolate
    };

    let x = i % column * spacing;
    let y = Math.floor(i / 10) % rows * spacing;
    let alpha = 1.0;

    let fill = $state("#394147");
    // note that I am using tweened here (and not Tween as in Lab 1)
    let tFill = tweened(fill, {...tweenParams, delay: i * 10});

    $effect(() => {
        if (scroll == 0) {
            tFill.set("#394147")
            // your code here for slide 1 (if necessary)

        } else if (scroll == 1) {
            tFill.set(+d.bar ? "#99c125" : "#394147")
            // your code here for slide 2 (if necessary)

        } else if (scroll == 2) {
            // your code here for slide 3
            
        } else if (scroll == 3) {
            // your code here for slide 4            
        }
    })
</script>

<rect width={size} height="{size}" rx="{5}" x="{x}" y="{y}" fill={$tFill} opacity={alpha}/>