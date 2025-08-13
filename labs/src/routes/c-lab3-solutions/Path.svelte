<script>
    // Props declaration
    let { 
        d, 
        fill,
        showTooltip,
        hideTooltip
    } = $props();

    // console.log(d, fill)
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<path 
    d={d} 
    fill={fill}
    onmouseenter={showTooltip}
    onmouseleave={hideTooltip}>
</path>