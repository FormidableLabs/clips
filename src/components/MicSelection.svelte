<script lang="ts">
  import { micStream } from "../stores";
  import ConfigurationSection from "./ConfigurationSection.svelte";
</script>

<ConfigurationSection title="Microphone">
  {#if $micStream}
    <button class="w-full p-1 border rounded" on:click={stopMic}
      >Stop mic</button
    >
  {/if}
</ConfigurationSection>
