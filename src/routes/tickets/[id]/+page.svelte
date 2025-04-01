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
    <p class="text-red-700 bg-red-200 p-4 rounded-lg text-center">{data.error}</p>
  {:else if data.ticket}
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h1 class="text-2xl font-semibold mb-4">Ticket Details</h1>
      <p><strong class="text-gray-800">ID:</strong> {data.ticket.id}</p>
      <p><strong class="text-gray-800">License Plate:</strong> {data.ticket.licensePlate}</p>
      <p><strong class="text-gray-800">Violation:</strong> {data.ticket.violationType}</p>
      <p><strong class="text-gray-800">Fine:</strong> ${data.ticket.fineAmount}</p>
      <p>
        <strong class="text-gray-800">Date Issued:</strong>
        {#if data.ticket.dateIssued}
          {new Date(data.ticket.dateIssued).toLocaleDateString()}
        {:else}
          N/A
        {/if}
      </p>
  
      <label class="block mb-4">
        <strong class="text-black">Status:</strong>
        <select bind:value={status} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50">
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>
      </label>
  
      <button on:click={updateStatus} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Update Status
      </button>
  
      {#if successMessage}
        <p class="text-green-700 bg-green-200 p-4 rounded-lg text-center mt-4">{successMessage}</p>
      {/if}
    </div>
  {:else}
    <p class="text-gray-500 text-center">Ticket data not available.</p>
  {/if}
  