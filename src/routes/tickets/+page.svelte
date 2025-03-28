<script lang="ts">
    import "../../../src/app.css";  

  
    export let data: {
      tickets: Array<{
        id: number;
        userId: string;
        userName?: string;
        licensePlate: string;
        violationType: string;
        fineAmount: number;
        status: string;
      }>;
      users: Array<{
        id: string;
        fullName: string;
      }>;
    };
  
    interface NewTicket {
      userId: string;
      licensePlate: string;
      violationType: string;
      fineAmount: number;
      status: string;
    }
  
    let newTicket: NewTicket = {
      userId: data.users.length > 0 ? data.users[0].id : '',
      licensePlate: '',
      violationType: '',
      fineAmount: 0,
      status: 'unpaid',
    };
  
    let isSubmitting = false;
    let errorMessage = '';
  
    const createTicket = async () => {
      if (!newTicket.licensePlate || !newTicket.violationType || newTicket.fineAmount <= 0) {
        errorMessage = 'Please fill all fields correctly.';
        return;
      }
  
      isSubmitting = true;
      errorMessage = '';
  
      const formData = new FormData();
      formData.append('userId', newTicket.userId);
      formData.append('licensePlate', newTicket.licensePlate.toUpperCase());
      formData.append('violationType', newTicket.violationType);
      formData.append('fineAmount', newTicket.fineAmount.toString());
      formData.append('status', newTicket.status);
  
      try {
        const response = await fetch('/tickets', {
          method: 'POST',
          body: formData,
        });
  
        const responseData = await response.json();
        if (response.ok && responseData.success) {
          data.tickets = [
            ...data.tickets,
            {
              ...responseData.ticket,
              userName: data.users.find((user) => user.id === newTicket.userId)?.fullName || 'Unknown',
            },
          ];
          resetForm();
        } else {
          errorMessage = 'Error creating ticket: ' + (responseData.error || 'Unknown error');
        }
      } catch (error) {
        errorMessage = 'Failed to create ticket. Please try again later.';
        console.error('Fetch error:', error);
      } finally {
        isSubmitting = false;
      }
    };
  
    const resetForm = () => {
      newTicket = {
        userId: data.users.length > 0 ? data.users[0].id : '',
        licensePlate: '',
        violationType: '',
        fineAmount: 0,
        status: 'unpaid',
      };
    };
  </script>
  
  <div class="p-8 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-700">Traffic Tickets</h1>
  
    <ul class="mb-8 border rounded-lg shadow-md p-4">
      {#each data.tickets as ticket}
        <li class="border-b py-2 last:border-b-0 flex justify-between items-center">
          <span>
            {ticket.userName || (data.users.find((user) => user.id === ticket.userId)?.fullName || 'Unknown')} -
            {ticket.licensePlate} - {ticket.violationType} - $<span class="font-semibold">{ticket.fineAmount}</span>
          </span>
          <span class="text-sm font-medium {ticket.status === 'paid' ? 'text-green-600' : 'text-red-600'}">
            {ticket.status.toUpperCase()}
          </span>
        </li>
      {/each}
    </ul>
  
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Create a New Ticket</h2>
    <form on:submit|preventDefault={createTicket} class="space-y-4">
      <div>
        <label for="userId" class="block text-sm font-medium text-gray-700">User:</label>
        <select bind:value={newTicket.userId} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
          {#each data.users as user}
            <option value={user.id}>{user.fullName}</option>
          {/each}
        </select>
      </div>
  
      <div>
        <label for="licensePlate" class="block text-sm font-medium text-gray-700">License Plate:</label>
        <input type="text" bind:value={newTicket.licensePlate} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
      </div>
  
      <div>
        <label for="violationType" class="block text-sm font-medium text-gray-700">Violation Type:</label>
        <input type="text" bind:value={newTicket.violationType} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
      </div>
  
      <div>
        <label for="fineAmount" class="block text-sm font-medium text-gray-700">Fine Amount:</label>
        <input type="number" bind:value={newTicket.fineAmount} min="1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
      </div>
  
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700">Status:</label>
        <select bind:value={newTicket.status} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>
      </div>
  
      {#if errorMessage}
        <p class="text-red-600">{errorMessage}</p>
      {/if}
  
      <button type="submit" disabled={isSubmitting} class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
        {isSubmitting ? 'Submitting...' : 'Create Ticket'}
      </button>
    </form>
  </div>