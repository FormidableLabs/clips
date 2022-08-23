<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import ShareButton from "./ShareButton.svelte";
  import WebcamButton from "./WebcamButton.svelte";
  import MicButton from "./MicButton.svelte";

  export let isRecording: boolean;
  const dispatch = createEventDispatcher();

</script>

<div class="rounded bg-green-500 flex justify-center items-center p-2 gap-3">
  <div
    class="w-16 h-16 bg-red-500 shadow rounded-full cursor-pointer"
    class:bg-red-500={isRecording}
    class:bg-gray-600={!isRecording}
    on:click={() => {
      dispatch("record")
    }}></div>
  <ShareButton />
  <WebcamButton />
  <MicButton />
</div>
