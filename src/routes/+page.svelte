<script lang="ts">
    import { Modal, P, ButtonGroup, Button, Accordion, AccordionItem, Badge } from 'flowbite-svelte';
    import { QuestionCircleSolid } from 'flowbite-svelte-icons';
	import { parseCourses } from '$lib';

    let helpModal = $state(false);
    let searchQuery = $state('');

    const courses = parseCourses();

    let filteredCourses = $derived((() => {
        if (!searchQuery) return courses;

        const query = searchQuery.toLowerCase();
        return courses.map(course => ({
            ...course,
            courses: course.courses.filter(it => JSON.stringify(it).toLowerCase().includes(query))
        })).filter(course => course.courses.length > 0);
    })());
</script>

<Modal title="Che cos'è questo sito?" form bind:open={helpModal}>
    <div class="flex flex-col overflow-y-auto max-h-[80vh]">
        <P>
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
        </P>
    </div>
</Modal>

<h1 class="text-3xl font-bold text-white mb-4">Benvenuto su Notes
    <button class="ml-2 hover:cursor-pointer" onclick={() => (helpModal = true)}><QuestionCircleSolid class="shrink-0 h-6 w-6" /></button>
</h1>

<input type="text" placeholder="Cerca corso..." class="w-full px-5 p-2 rounded-3xl bg-gray-700 text-white" bind:value={searchQuery} />

<div class="w-full mt-5 flex flex-col gap-4">
    {#each filteredCourses as course}
    <Accordion>
        <AccordionItem open classes={{ content: 'p-2' }}>
            {#snippet header()}{course.name}{/snippet}
            
            <Accordion flush>
                {#each course.courses as it}
                <AccordionItem classes={{ button: 'p-2', content: 'p-2' }}>
                    {#snippet header()}
                        <div class="flex items-center justify-between w-full pr-4">
                            <div class="flex items-center">
                                <img src={it.flag} alt="Flag" class="w-6 h-6 rounded-full mr-2" />
                                <span class="text-white cursor-pointer">{it.name}</span>
                                {#each it.code as tag}
                                    <Badge rounded color={tag.color} class="ml-2 hidden sm:block">{tag.code}</Badge>
                                {/each}
                            </div>
                            {#if it.isNotAvailable}
                                <button class="p-2 text-white rounded-md bg-gray-500 hover:cursor-not-allowed" disabled>Apri</button>
                            {:else}
                                <a href="{it.url}" target="_blank" class="p-2 bg-secondary-900 text-white rounded-md hover:bg-secondary-800 cursor-pointer">Apri</a>
                            {/if}
                        </div>
                    {/snippet}
                    <div class="flex gap-2 mb-2">
                        {#each it.code as tag}
                            <Badge rounded color={tag.color} class="block sm:hidden">{tag.code}</Badge>
                        {/each}
                    </div>
                    {it.description}
                </AccordionItem>
                {/each}
            </Accordion>

        </AccordionItem>
    </Accordion>
    {/each}
</div>