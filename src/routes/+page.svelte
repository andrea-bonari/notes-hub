<script lang="ts">
	import { sha256 } from 'js-sha256';
	import data from '$lib/data.json';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	type Website = {
		name: string;
		code: string[];
		description: string;
		url: string;
		isNotAvailable: boolean;
		isWIP: boolean;
	};

	let finalData : Website[] = data as unknown as Website[];

	$: finalData = data.filter((website) => {
		let w = website as unknown as Website;

		if (filterType === 'all') return true;
		if (filterType === 'completed') return !w.isNotAvailable && !w.isWIP;
		if (filterType === 'inProgress') return w.isWIP;
		if (filterType === 'notAvailable') return w.isNotAvailable;
	}).filter((website) => {
		if (query === '') return true;
		return website.name.toLowerCase().includes(query.toLowerCase()) || website.code.join('').toLowerCase().includes(query.toLowerCase()) || website.description.toLowerCase().includes(query.toLowerCase());
	}) as unknown as Website[];

	let query = '';

	let filterType: 'all' | 'completed' | 'inProgress' | 'notAvailable' = 'all';

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

<div class="flex flex-col sm:flex-row items-center justify-center w-full p-10 h-min">
	<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary" flexDirection="flex-col sm:flex-row" rounded="sm:rounded-token rounded-2xl">
		<RadioItem bind:group={filterType} class="h-full flex items-center justify-center" name="all" value="all">Tutti</RadioItem>
		<RadioItem bind:group={filterType} class="h-full flex items-center justify-center" name="completed" value="completed">Completati</RadioItem>
		<RadioItem bind:group={filterType} name="inProgress" value="inProgress">In corso</RadioItem>
		<RadioItem bind:group={filterType} name="notAvailable" value="notAvailable">Non disponibili</RadioItem>
	</RadioGroup>

	<input
		type="text"
		placeholder="Cerca..."
		class="input p-1 h-10 ml-0 mt-5 sm:ml-5 sm:mt-0 w-[50%]"
		bind:value={query}
	/>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-10 gap-10 h-min grid-rows-[1fr]">
	{#each finalData as website}
		<div class="card flex flex-col">
			<header class="card-header">{website.name}</header>
			<section class="p-4 flex gap-2">
				{#each website.code as code}
					<span
						class="badge constiant-filled pointer-events-none"
						style="background-color: {codeColors.get(code)};">{code}</span
					>
				{/each}

				{#if website.isNotAvailable}
					<span class="badge variant-filled-error border-red-800 border-4 h-6 pointer-events-none"
					>Non disponibile</span
				>
				{:else if website.isWIP}
					<span class="badge variant-filled-warning border-red-800 border-4 h-6 pointer-events-none"
						>In costruzione</span
					>
				{/if}

				
			</section>
			<footer class="text-sm card-footer p text-ellipsis w-[calc(100%)] overflow-hidden flex flex-col flex-1">
				<p class="flex-grow">
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
