<!-- src/routes/tickets/+page.svelte -->
<script lang="ts">
    import "../../../src/app.css";
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    
    export let data;
    export let form;
    
    let showCreateForm = false;
    let editingTicket: {
      id: number;
      licensePlate: string;
      violationType: string;
      fineAmount: number;
      dateIssued?: string;
      status: string;
    } | null = null;

    // Filter and sort states
    let search = data.filters.search || '';
    let selectedStatus = data.filters.status || '';
    let selectedUserId = data.filters.userId || '';
    let sortBy = data.filters.sortBy || 'dateIssued';
    let sortOrder = data.filters.sortOrder || 'desc';

    function toggleCreateForm() {
        showCreateForm = !showCreateForm;
        editingTicket = null;
    }
    
    function startEdit(ticket: any) {
        editingTicket = { ...ticket };
        showCreateForm = false;
    }
    
    function cancelEdit() {
        editingTicket = null;
    }
    
    function cancelCreate() {
        showCreateForm = false;
    }

    function confirmDelete(id: number) {
        if (confirm('Are you sure you want to delete this ticket?')) {
            // Create a form element dynamically and submit
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '?/deleteTicket';

            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'id';
            input.value = id.toString();

            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        }
    }
    
    // Function to apply filters and sorting
    function applyFilters() {
        const params = new URLSearchParams();
        
        if (search) params.set('search', search);
        if (selectedStatus) params.set('status', selectedStatus);
        if (selectedUserId) params.set('userId', selectedUserId);
        if (sortBy) params.set('sortBy', sortBy);
        if (sortOrder) params.set('sortOrder', sortOrder);
        
        goto(`?${params.toString()}`);
    }
    
    // Function to reset filters
    function resetFilters() {
        search = '';
        selectedStatus = '';
        selectedUserId = '';
        sortBy = 'dateIssued';
        sortOrder = 'desc';
        
        goto('?');
    }
    
    // Function to toggle sort order
    function toggleSort(field: "status" | "licensePlate" | "violationType" | "fineAmount" | "dateIssued") {
    if (sortBy === field) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        sortBy = field; // No type error now
        sortOrder = 'asc';
    }

    applyFilters();
}

    
    // Helper function to get sort indicator
    function getSortIndicator(field: string) {
        if (sortBy !== field) return '';
        return sortOrder === 'asc' ? '↑' : '↓';
    }
</script>

<div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Traffic Tickets</h1>
    
    <!-- Notification messages -->
    {#if form?.error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span class="block sm:inline">{form.error}</span>
        </div>
    {/if}
    
    {#if form?.success}
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span class="block sm:inline">{form.message || 'Operation completed successfully'}</span>
        </div>
    {/if}
    
    <!-- Action buttons -->
    <div class="flex justify-between mb-6">
        <button 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            on:click={toggleCreateForm}
        >
            {showCreateForm ? 'Cancel' : 'Create New Ticket'}
        </button>
    </div>
    
    <!-- Filters Section -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-xl font-semibold mb-4">Filter and Sort</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search Input -->
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="search">
                    Search
                </label>
                <input 
                    id="search" 
                    type="text" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="License plate, violation, name..."
                    bind:value={search}
                >
            </div>
            
            <!-- Status Filter -->
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="status-filter">
                    Status
                </label>
                <select 
                    id="status-filter" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    bind:value={selectedStatus}
                >
                    <option value="">All Statuses</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                </select>
            </div>
            
            <!-- User Filter -->
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="user-filter">
                    User
                </label>
                <select 
                    id="user-filter" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    bind:value={selectedUserId}
                >
                    <option value="">All Users</option>
                    {#each data.users as user}
                        <option value={user.id}>{user.fullName}</option>
                    {/each}
                </select>
            </div>
        </div>
        
        <!-- Sort Controls -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="sort-by">
                    Sort By
                </label>
                <select 
                    id="sort-by" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    bind:value={sortBy}
                >
                    <option value="dateIssued">Date Issued</option>
                    <option value="licensePlate">License Plate</option>
                    <option value="violationType">Violation Type</option>
                    <option value="fineAmount">Fine Amount</option>
                    <option value="status">Status</option>
                </select>
            </div>
            
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="sort-order">
                    Sort Order
                </label>
                <select 
                    id="sort-order" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    bind:value={sortOrder}
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
        </div>
        
        <!-- Filter Action Buttons -->
        <div class="flex items-center justify-between mt-4">
            <button 
                type="button" 
                on:click={applyFilters}
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Apply Filters
            </button>
            <button 
                type="button" 
                on:click={resetFilters}
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Reset Filters
            </button>
        </div>
    </div>
    
    <!-- Create Ticket Form -->
    {#if showCreateForm}
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 class="text-xl font-semibold mb-4">Create New Ticket</h2>
            <form method="POST" action="?/createTicket" use:enhance>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="userId">
                            User
                        </label>
                        <select 
                            id="userId" 
                            name="userId" 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Select User</option>
                            {#each data.users as user}
                                <option value={user.id}>{user.fullName}</option>
                            {/each}
                        </select>
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="licensePlate">
                            License Plate
                        </label>
                        <input 
                            id="licensePlate" 
                            name="licensePlate" 
                            type="text" 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="violationType">
                            Violation Type
                        </label>
                        <input 
                            id="violationType" 
                            name="violationType" 
                            type="text" 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="fineAmount">
                            Fine Amount
                        </label>
                        <input 
                            id="fineAmount" 
                            name="fineAmount" 
                            type="number" 
                            step="0.01" 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="dateIssued">
                            Date Issued
                        </label>
                        <input 
                            id="dateIssued" 
                            name="dateIssued" 
                            type="date" 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="status">
                            Status
                        </label>
                        <select 
                            id="status" 
                            name="status" 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="unpaid">Unpaid</option>
                            <option value="paid">Paid</option>
                        </select>
                    </div>
                </div>
                
                <div class="flex items-center justify-between mt-4">
                    <button 
                        type="submit" 
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Create Ticket
                    </button>
                    <button 
                        type="button" 
                        on:click={cancelCreate}
                        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    {/if}
    
    <!-- Edit Ticket Form -->
    {#if editingTicket}
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 class="text-xl font-semibold mb-4">Edit Ticket #{editingTicket.id}</h2>
            <form method="POST" action="?/updateTicket" use:enhance>
                <input type="hidden" name="id" value={editingTicket.id}>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-licensePlate">
                            License Plate
                        </label>
                        <input 
                            id="edit-licensePlate" 
                            name="licensePlate" 
                            type="text" 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={editingTicket.licensePlate}
                            required
                        >
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-violationType">
                            Violation Type
                        </label>
                        <input 
                            id="edit-violationType" 
                            name="violationType" 
                            type="text" 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={editingTicket.violationType}
                            required
                        >
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-fineAmount">
                            Fine Amount
                        </label>
                        <input 
                            id="edit-fineAmount" 
                            name="fineAmount" 
                            type="number" 
                            step="0.01" 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={editingTicket.fineAmount}
                            required
                        >
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-dateIssued">
                            Date Issued
                        </label>
                        <input 
                            id="edit-dateIssued" 
                            name="dateIssued" 
                            type="date" 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={editingTicket.dateIssued ? new Date(editingTicket.dateIssued).toISOString().substring(0, 10) : ''}
                        >
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-status">
                            Status
                        </label>
                        <select 
                            id="edit-status" 
                            name="status" 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="unpaid" selected={editingTicket.status === 'unpaid'}>Unpaid</option>
                            <option value="paid" selected={editingTicket.status === 'paid'}>Paid</option>
                        </select>
                    </div>
                </div>
                
                <div class="flex items-center justify-between mt-4">
                    <button 
                        type="submit" 
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Update Ticket
                    </button>
                    <button 
                        type="button" 
                        on:click={cancelEdit}
                        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    {/if}
    
    <!-- Results Summary -->
    <div class="mb-4 text-gray-700">
        <p>
            Showing {data.tickets.length} {data.tickets.length === 1 ? 'ticket' : 'tickets'}
            {data.filters.search ? `matching "${data.filters.search}"` : ''}
            {data.filters.status ? `with status "${data.filters.status}"` : ''}
            {data.filters.userId ? `for selected user` : ''}
        </p>
    </div>
    
    <!-- Tickets Table -->
    {#if data.error}
        <p class="text-red-600 bg-red-100 p-4 rounded-lg text-center">{data.error}</p>
    {:else if data.tickets.length === 0}
        <p class="text-gray-600 text-center">No tickets found.</p>
    {:else}
        <div class="overflow-x-auto shadow-lg rounded-lg">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead class="bg-gray-800 text-white">
                    <tr>
                        <th class="py-3 px-4 text-left">ID</th>
                        <th class="py-3 px-4 text-left">Assigned To</th>
                        <th class="py-3 px-4 text-left cursor-pointer" on:click={() => toggleSort('licensePlate')}>
                            License Plate {getSortIndicator('licensePlate')}
                        </th>
                        <th class="py-3 px-4 text-left cursor-pointer" on:click={() => toggleSort('violationType')}>
                            Violation {getSortIndicator('violationType')}
                        </th>
                        <th class="py-3 px-4 text-left cursor-pointer" on:click={() => toggleSort('fineAmount')}>
                            Fine {getSortIndicator('fineAmount')}
                        </th>
                        <th class="py-3 px-4 text-left cursor-pointer" on:click={() => toggleSort('dateIssued')}>
                            Date Issued {getSortIndicator('dateIssued')}
                        </th>
                        <th class="py-3 px-4 text-left cursor-pointer" on:click={() => toggleSort('status')}>
                            Status {getSortIndicator('status')}
                        </th>
                        <th class="py-3 px-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.tickets as ticket}
                        <tr class="border-b border-gray-200 hover:bg-gray-100">
                            <td class="py-3 px-4">{ticket.id}</td>
                            <td class="py-3 px-4 relative group">
                                {#if ticket.user}
                                    <span class="text-blue-600 cursor-pointer hover:underline">
                                        {ticket.user.fullName}
                                    </span>
                                    
                                    <!-- User details tooltip that appears on hover -->
                                    <div class="absolute z-10 invisible group-hover:visible bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64 mt-2 -ml-2">
                                        <h3 class="font-bold text-lg mb-2">{ticket.user.fullName}</h3>
                                        <p><span class="font-semibold">Email:</span> {ticket.user.email || 'N/A'}</p>
                                        <p><span class="font-semibold">Phone:</span> {ticket.user.phoneNumber || 'N/A'}</p>
                                        <p><span class="font-semibold">Address:</span> {ticket.user.address || 'N/A'}</p>
                                    </div>
                                {:else}
                                    <span class="text-gray-500">Unknown</span>
                                {/if}
                            </td>
                            <td class="py-3 px-4">{ticket.licensePlate}</td>
                            <td class="py-3 px-4">{ticket.violationType}</td>
                            <td class="py-3 px-4">${ticket.fineAmount}</td>
                            <td class="py-3 px-4">
                                {#if ticket.dateIssued}
                                    {new Date(ticket.dateIssued).toLocaleDateString()}
                                {:else}
                                    N/A
                                {/if}
                            </td>
                            <td class="py-3 px-4">
                                <span
                                class="px-2 py-1 rounded-full text-xs font-semibold"
                                class:bg-green-200={ticket.status === 'paid'}
                                class:bg-yellow-200={ticket.status === 'unpaid'}
                                class:bg-red-200={ticket.status === null}
                              >
                                {ticket.status || 'N/A'}
                              </span>
                            </td>
                            <td class="py-3 px-4 flex space-x-2">
                                <a href={`/tickets/${ticket.id}`} class="text-blue-500 hover:underline">View</a>
                                
                                <button 
                                    on:click={() => startEdit(ticket)} 
                                    class="text-green-500 hover:underline"
                                >
                                    Edit
                                </button>
                                
                                <form method="POST" action="?/deleteTicket" use:enhance class="inline">
                                    <input type="hidden" name="id" value={ticket.id}>
                                    <button 
                                        type="button" 
                                        class="text-red-500 hover:underline"
                                        on:click={() => confirmDelete(ticket.id)}
                                    >
                                        Delete
                                    </button>
                                </form>
                                
                                {#if ticket.status !== 'paid'}
                                    <form method="POST" action="?/payTicket" use:enhance class="inline">
                                        <input type="hidden" name="id" value={ticket.id}>
                                        <button 
                                            type="submit" 
                                            class="text-purple-500 hover:underline"
                                        >
                                            Mark as Paid
                                        </button>
                                    </form>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>