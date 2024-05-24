<script lang="ts">
	import { sha256 } from 'js-sha256';
	import data from '$lib/data.json';

	const codeColors = (() => {
		const codes = data.map((website) => website.code).flat();
		const uniqueCodes = [...new Set(codes)];

		const colorMap = new Map<string, string>();

		uniqueCodes.forEach((code) => {
			const hash = sha256(code);

			const r = parseInt(hash.slice(0, 2), 16);
			const g = parseInt(hash.slice(2, 4), 16);
			const b = parseInt(hash.slice(4, 6), 16);

			const color = `rgb(${r}, ${g}, ${b})`;

			colorMap.set(code, color);
		});

		return colorMap;
	})();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-10 gap-10 h-min">
	{#each data as website}
		<div class="card h-min">
			<header class="card-header">{website.name}</header>
			<section class="p-4 flex gap-2">
				{#each website.code as code}
					<span
						class="badge constiant-filled pointer-events-none"
						style="background-color: {codeColors.get(code)};">{code}</span
					>
				{/each}

				{#if website.isNotAvailable}
					<span class="badge variant-filled-error border-red-800 border-4 pointer-events-none"
					>Non disponibile</span
				>
				{:else if website.isWIP}
					<span class="badge variant-filled-warning border-red-800 border-4 pointer-events-none"
						>In costruzione</span
					>
				{/if}

				
			</section>
			<footer class="text-sm card-footer p text-ellipsis w-[calc(100%)] overflow-hidden">
				<p>
					{website.description}
				</p>
				{#if website.isNotAvailable}
					<p class="button variant-filled-surface cursor-not-allowed chip mt-3 float-right">Apri</p>
				{:else}
					<a href={website.url} target="_blank" class="button variant-filled-secondary chip mt-3 float-right card-hover">
						Apri
					</a>
				{/if}
			</footer>
		</div>
	{/each}
</div>
