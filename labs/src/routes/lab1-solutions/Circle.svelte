<script>
    import { Tween } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { interpolate } from 'd3-interpolate';

    // Props declaration
    let { x = $bindable(), y = $bindable(), size = $bindable(), fill = $bindable(), xScale, yScale } = $props();

    // Animation parameters
    const tweenParams = {
        duration: 2000,
        easing: cubicOut,
        interpolate
    };


    let tFill = new Tween(fill, tweenParams);
    let tSize = new Tween(size, tweenParams);
    let tX = new Tween(x, tweenParams);
    let tY = new Tween(y, tweenParams);

    // Run the animation via Tweens
    $effect(() => {
        // animate the circle position and size
        tX.target = x;
        tY.target = y;
        tSize.target = size;
        // animate the bar fill color
        tFill.target = fill;
    });

    $inspect(x, y, size, fill);
</script>

<circle 
    cx="{xScale(tX.current)}" 
    cy="{yScale(tY.current)}" 
    r="{tSize.current}" 
    fill="{tFill.current}"/>