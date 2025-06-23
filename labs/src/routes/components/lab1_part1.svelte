<script>
/* Javascript goes here */
	let margin = { top: 20, right: 20, bottom: 20, left: 20 };
	let width = 400 - margin.left - margin.right;
	let height = 400 - margin.top - margin.bottom;

	// Add your answers to Part 1 Question 5 here
	// scale(300) -> 180
	// scale(100) ->
	// scale(200) ->
	// scale(500) ->

	// Add your code here

	function modify() {}

	function reset() {}
</script>

<div>
	<h1>Lab 1</h1>
	<svg 
		height="{height}px" 
		width="{width}px"
		style="background-color: #eee;"
		>
		<!-- you can remove the style line above -->
		<g>

		</g>
	</svg>
	<button on:click={() => modify()}>Modify</button>
	<button on:click={() => reset()}>Reset</button>
</div>

<style>
/*  CSS styles go here  */
</style>
