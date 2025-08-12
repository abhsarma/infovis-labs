<script>
    import { tweened } from 'svelte/motion';
    import { linear, cubicOut } from 'svelte/easing';
    import { interpolate } from 'd3-interpolate';

    // Props declaration
    let { 
        d = $bindable(), 
        i = $bindable(), 
        x = $bindable(), 
        y = $bindable(), 
        r = $bindable(), 
        xscale = $bindable(), 
        yscale = $bindable(), 
        rscale = $bindable(), 
        fill,
        showTooltip,
        hideTooltip
    } = $props();

    // Animation parameters
    const tweenParams = {
        duration: 250,
        easing: linear
    };

    let country = $derived(d.country);
    let tR = tweened(r, tweenParams);
    let tX = tweened(x, tweenParams);
    let tY = tweened(y, tweenParams);

    // Run the animation via Tweens
    $effect(() => {
        // animate the circle position and size
        tX.set(x);
        tY.set(y);
        tR.set(r);
    });
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<circle 
    id="{i} {country}"
    cx="{xscale($tX)}" 
    cy="{yscale($tY)}" 
    r="{rscale($tR)}" 
    fill="{fill}"
    onmouseenter={showTooltip}
    onmouseleave={hideTooltip}
    opacity=0.7/>
