<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
  
    export let data;
  
    let status = data.ticket?.status;
    let successMessage = '';
  
    async function updateStatus() {
      successMessage = '';
      if (data.ticket) { // Add check here.
        const res = await fetch(`/api/tickets/${data.ticket.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
  
        if (res.ok) {
          successMessage = 'Ticket status updated!';
        } else {
          alert('Failed to update ticket.');
        }
      }
    }
  </script>
  
  {#if data.error}
    <p class="error">{data.error}</p>
  {:else if data.ticket}
    <h1>Ticket Details</h1>
    <p><strong>ID:</strong> {data.ticket.id}</p>
    <p><strong>License Plate:</strong> {data.ticket.licensePlate}</p>
    <p><strong>Violation:</strong> {data.ticket.violationType}</p>
    <p><strong>Fine:</strong> ${data.ticket.fineAmount}</p>
    <p>
      <strong>Date Issued:</strong>
      {#if data.ticket.dateIssued}
        {new Date(data.ticket.dateIssued).toLocaleDateString()}
      {:else}
        N/A
      {/if}
    </p>
  
    <label>
      <strong>Status:</strong>
      <select bind:value={status}>
        <option value="unpaid">Unpaid</option>
        <option value="paid">Paid</option>
      </select>
    </label>
  
    <button on:click={updateStatus}>Update Status</button>
  
    {#if successMessage}
      <p class="success">{successMessage}</p>
    {/if}
  {:else}
      <p>Ticket data not available.</p>
  {/if}