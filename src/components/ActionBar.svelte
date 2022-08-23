<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import ShareButton from "./ShareButton.svelte";
  import WebcamButton from "./WebcamButton.svelte";
  import MicButton from "./MicButton.svelte";

  export let isRecording: boolean;
  const dispatch = createEventDispatcher();
</script>

<div class="rounded bg-gray-200 flex justify-center items-center p-2 gap-4">
  <!-- TODO: Move into its own component? -->
  <button
    class="w-16 h-16 shadow rounded-full cursor-pointer border-4 border-gray-500 p-1 flex items-center justify-center group"
    on:click={() => {
      dispatch("record");
    }}
  >
    <div
      class="bg-red-500 transition transition-all duration-300 ease-in-out {isRecording
        ? 'w-1/2 h-1/2 rounded-lg group-hover:shadow-xl'
        : 'w-full h-full rounded-[100%]'}"
    />
  </button>
  <ShareButton />
  <WebcamButton />
  <MicButton />
</div>
