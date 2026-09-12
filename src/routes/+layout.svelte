<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="flex flex-col min-h-full bg-blend-normal bg-linear-to-b from-[#1e1e1e] to-[#111111] items-center p-8 text-white">
	{@render children()}
</div>
