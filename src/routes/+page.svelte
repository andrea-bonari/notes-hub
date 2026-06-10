<script lang="ts">
	// This code is ugly AF and it should be refactored, but it works and I don't care enough to do it right now, so here we are
	import { sha256 } from 'js-sha256';
	import data from '$lib/data.json';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import it from '$lib/images/it.png';
	import gb from '$lib/images/gb.png';

	type Website = {
		name: string;
		code: string[];
		description: string;
		url: string;
		isNotAvailable: boolean;
		isWIP: boolean;
		isEnglish: boolean;
	};

	let finalData : Website[] = data as unknown as Website[];

	$: finalData = data.filter((website) => {
		let w = website as unknown as Website;

		if (filterType === 'all') return true;
		if (filterType === 'completed') return !w.isNotAvailable && !w.isWIP;
	}).filter((website) => {
		if (query === '') return true;
		return website.name.toLowerCase().includes(query.toLowerCase()) || website.code.join('').toLowerCase().includes(query.toLowerCase()) || website.description.toLowerCase().includes(query.toLowerCase());
	}) as unknown as Website[];

	let query = '';

	let filterType: 'all' | 'completed' | 'inProgress' | 'notAvailable' = 'all';
	let showHelpModal = false;

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

<div class="flex flex-col sm:flex-row items-center justify-center w-full p-10 h-min gap-5 pb-0">
	<div class="flex flex-row items-center gap-5 w-full">
		<button
			type="button"
			class="button variant-filled-surface h-10 w-10 rounded-full p-0 flex items-center justify-center"
			aria-label="Aiuto"
			on:click={() => (showHelpModal = true)}
		>
			?
		</button>

		<div class="flex flex-row flex-1">
			<input
				type="text"
				placeholder="Cerca..."
				class="input p-2 sm:p-5 h-10 ml-0 flex-1 w-full"
				bind:value={query}
			/>
		</div>
	</div>

	<RadioGroup class="w-full sm:w-fit" active="variant-filled-primary" hover="hover:variant-soft-primary" flexDirection="flex-col sm:flex-row" rounded="sm:rounded-token rounded-2xl">
		<RadioItem bind:group={filterType} class="h-full flex items-center justify-center" name="all" value="all">Tutti</RadioItem>
		<RadioItem bind:group={filterType} class="h-full flex items-center justify-center" name="completed" value="completed">Completati</RadioItem>
	</RadioGroup>
</div>

{#if showHelpModal}
	<div class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-8" role="presentation" on:click={() => (showHelpModal = false)}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<div class="card w-full max-w-2xl p-6 max-h-[calc(100vh-4rem)] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="help-title" on:click|stopPropagation>
			<header class="card-header flex items-center justify-between gap-4">
				<h2 id="help-title" class="text-lg font-semibold">Cos'è questo sito?</h2>
				<button type="button" class="button variant-filled-surface h-8 w-8 rounded-full p-0" aria-label="Chiudi" on:click={() => (showHelpModal = false)}>
					x
				</button>
			</header>
			<section class="p-4 text-left">
				Questo sito è un archivio pubblico degli appunti dei miei corsi universitari.

				L'obiettivo è quello di rendere facilmente accessibili e condivisibili le informazioni che ho raccolto durante i miei studi,
				sia per me che per altri studenti. Se hai trovato questo sito utile, sentiti libero di condividerlo con i tuoi amici o compagni di corso!

				Credo che il diritto di accesso alla conoscenza sia fondamentale, e spero che questo sito possa contribuire a rendere l'apprendimento più facile e accessibile per tutti. Se hai suggerimenti o feedback, non esitare a contattarmi!

				<hr class="my-4">

				Tenete a mente che questi appunti sono stati creati principalmente per uso personale, quindi potrebbero non essere sempre completi o accurati. Se notate errori o informazioni mancanti, sentitevi liberi di contribuire o segnalare eventuali problemi.

				Per farlo, potete contattarmi tramite scheda issues di <a href="https://github.com/andrea-bonari/notes-hub" target="_blank" class="text-blue-500 underline">questo repository GitHub</a>.
				O se volete contribuire direttamente, potete fare un fork del repository di un corso specifico (trovabili <a href="https://github.com/orgs/andrea-bonari/repositories" target="_blank" class="text-blue-500 underline">qui</a>), aggiungere i vostri appunti e poi creare una pull request. Sarò felice di rivedere le vostre modifiche e, se tutto è in ordine, di unirle al progetto principale.

				<hr class="my-4">

				Oltre ai corsi singoli, sto lavorando per creare una mappa completa dell'ingegneria informatica, che includa tutti i corsi e le materie correlate. L'obiettivo è quello di fornire una panoramica completa del percorso di studi in ingegneria informatica, con link agli appunti e alle risorse per ogni corso. Questo progetto è ancora in fase di sviluppo, ma spero di poterlo condividere presto!
			</section>
		</div>
	</div>
{/if}

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-10 gap-10 h-min grid-rows-[1fr]">
   {#each finalData as website}
	   <div class="card flex flex-col">
		   <header class="card-header flex items-center gap-2">
			   {website.name}
		   </header>
		   <section class="p-4 flex gap-2 items-center">
			   <img
				   src={website.isEnglish ? gb : it}
				   alt={website.isEnglish ? 'English' : 'Italian'}
				   class="w-6 h-6"
			   />
			   {#each website.code as code}
				   <span
					   class="badge constiant-filled pointer-events-none"
					   style="background-color: {codeColors.get(code)};">{code}</span>
			   {/each}

			   {#if website.isNotAvailable}
				   <span class="badge variant-filled-error border-red-800 border-4 h-6 pointer-events-none"
				   >Non disponibile</span>
			   {:else if website.isWIP}
				   <span class="badge variant-filled-warning border-red-800 border-4 h-6 pointer-events-none"
					   >In costruzione</span>
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
