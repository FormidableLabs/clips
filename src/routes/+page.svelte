<script lang="ts">
  import "../app.css";
  import App from "../App.svelte";
  import { onMount } from "svelte";

  let isCheckingRequirements = true;
  let hasRequirements = false;

  /**
   * Check browser requirements.
   */
  onMount(() => {
    hasRequirements = [
      () => "VideoEncoder" in window,
      () => "AudioEncoder" in window,
      () => "MediaStreamTrackProcessor" in window,
    ].every((r) => r() === true);

    isCheckingRequirements = false;
  });
</script>

{#if isCheckingRequirements}
  <div>Checking...</div>
{:else if !hasRequirements}
  <div class="w-screen h-screen flex justify-center items-center">
    <div class="max-w-[450px] px-8">
      <h1 class="text-center font-bold text-lg mb-3">Uh oh...</h1>
      <p class="text-sm text-gray-700">
        It looks like your browser doesn't support all of the APIs required to
        run this application. Try using a Chromium-based browser.
      </p>
    </div>
  </div>
{:else}
  <App />
{/if}
