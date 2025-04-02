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

    interface User {
        id: string; // Assuming user ID is a string (based on uuid in your schema)
        fullName: string;
        email: string;
        phoneNumber?: string | null; // Optional or nullable properties
        address?: string | null;
    }

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


    let userSearchTerm = '';
    let filteredUsers: User[] = [];
    function handleUserSearch(event: Event) {
        const userSearchTerm = event.target ? (event.target as HTMLInputElement).value : '';
        filterUsers(userSearchTerm);
    }

    function filterUsers(userSearchTerm: string) {
        if (!userSearchTerm) {
            filteredUsers = []; // Or perhaps show a limited initial list if desired
            return;
        }
        filteredUsers = data.users.filter(user =>
            user.fullName.toLowerCase().includes(userSearchTerm.toLowerCase())
        );
    }



    // Optional: Initialize filteredUsers if you want to show a limited list initially
    // onMount(() => {
    //     filteredUsers = data.users.slice(0, 10); // Show the first 10 users initially
    // });
</script>

<nav class="!bg-emerald-500 shadow-lg fixed w-full top-0 z-50">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" class="text-2xl font-semibold tracking-wide text-white">TrafficFlow</a>
        <div class="hidden md:flex space-x-6 ">
            <a href="/" class="!text-white hover:text-cyan-300 transition-colors font-medium">Home</a>
            <a href="/tickets" class=" !text-white hover:text-cyan-300 transition-colors font-medium">Tickets</a>
            <a href="/dashboard" class="!text-white hover:text-cyan-300 transition-colors font-medium">Dashboard</a>
            <a href="/users" class="!text-white hover:text-cyan-300 transition-colors font-medium">Users</a>
        </div>
        <button class="md:hidden focus:outline-none" id="menu-toggle" aria-label="Toggle mobile menu">
            <svg class="h-8 w-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
        </button>
    </div>
</nav>
<div class="container mx-auto p-6">

    <h1 class="text-3xl font-bold text-white mb-6 text-center">Traffic Tickets</h1>
    
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
    <div class="bg-gradient-to-r from-red-500 via-blue-700 to-emerald-600 p-8 rounded-lg shadow-lg mb-6">
        <h2 class="text-2xl font-semibold text-white mb-6">Filter and Sort</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Search Input -->
            <div class="mb-6">
                <label class="block text-white text-sm font-bold mb-2" for="search">
                    Search
                </label>
                <input 
                    id="search" 
                    type="text" 
                    class="shadow-lg appearance-none border rounded w-full py-3 px-4 !text-black leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                    placeholder="License plate, violation, name..."
                    bind:value={search}
                >
            </div>
            
            <!-- Status Filter -->
            <div class="mb-6">
                <label class="block text-white text-sm font-bold mb-2" for="status-filter">
                    Status
                </label>
                <select 
                    id="status-filter" 
                    class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                    bind:value={selectedStatus}
                >
                    <option value="">All Status</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                </select>
            </div>
            
            <!-- User Filter -->
            <div class="mb-6">
                <label class="block text-white text-sm font-bold mb-2" for="user-filter">
                    User
                </label>
                <select 
                    id="user-filter" 
                    class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div class="mb-6">
                <label class="block text-white text-sm font-bold mb-2" for="sort-by">
                    Sort By
                </label>
                <select 
                    id="sort-by" 
                    class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50" 
                    bind:value={sortBy}
                >
                    <option value="dateIssued">Date Issued</option>
                    <option value="licensePlate">License Plate</option>
                    <option value="violationType">Violation Type</option>
                    <option value="fineAmount">Fine Amount</option>
                    <option value="status">Status</option>
                </select>
            </div>
            
            <div class="mb-6">
                <label class="block text-white text-sm font-bold mb-2" for="sort-order">
                    Sort Order
                </label>
                <select 
                    id="sort-order" 
                    class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                    bind:value={sortOrder}
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
        </div>
        
        <!-- Filter Action Buttons -->
        <div class="flex items-center justify-between mt-6">
            <button
                type="button"
                on:click={applyFilters}
                class="bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 hover:from-blue-600 hover:to-indigo-700"
            >
                Apply Filters
            </button>
            <button
                type="button"
                on:click={resetFilters}
                class="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 hover:from-gray-600 hover:to-gray-700"
            >
                Reset Filters
            </button>
        </div>
    </div>
    
    
    <!-- Create Ticket Form -->
    {#if showCreateForm}
    <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-lg shadow-lg mb-6">
        <h2 class="text-2xl font-semibold text-white mb-6">Create New Ticket</h2>
        <form method="POST" action="?/createTicket" use:enhance>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="mb-6">
                    <label class="block text-white text-sm font-bold mb-2" for="userId">
                        User
                    </label>
                    <input
                        type="text"
                        id="userSearch"
                        placeholder="Search for a user..."
                        class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                        on:input={handleUserSearch}
                    />
                    {#if filteredUsers && filteredUsers.length > 0}
                        <select
                            id="userId"
                            name="userId"
                            class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 mt-2 bg-amber-50"
                            required
                        >
                            <option value="">Select User</option>
                            {#each filteredUsers as user}
                                <option value={user.id}>{user.fullName}</option>
                            {/each}
                        </select>
                    {:else if userSearchTerm}
                        <p class="text-white text-sm mt-2 italic">No users found matching your search.</p>
                    {/if}
                </div>

                <div class="mb-6">
                    <label class="block text-white text-sm font-bold mb-2" for="licensePlate">
                        License Plate
                    </label>
                    <input
                        id="licensePlate"
                        name="licensePlate"
                        type="text"
                        class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                        required
                    >
                </div>

                <div class="mb-6">
                    <label class="block text-white text-sm font-bold mb-2" for="violationType">
                        Violation Type
                    </label>
                    <input
                        id="violationType"
                        name="violationType"
                        type="text"
                        class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                        required
                    >
                </div>

                <div class="mb-6">
                    <label class="block text-white text-sm font-bold mb-2" for="fineAmount">
                        Fine Amount
                    </label>
                    <input
                        id="fineAmount"
                        name="fineAmount"
                        type="number"
                        step="0.01"
                        class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                        required
                    >
                </div>

                <div class="mb-6">
                    <label class="block text-white text-sm font-bold mb-2" for="dateIssued">
                        Date Issued
                    </label>
                    <input
                        id="dateIssued"
                        name="dateIssued"
                        type="date"
                        class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                    >
                </div>

                <div class="mb-6">
                    <label class="block !text-black text-sm font-bold mb-2" for="status">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        class="shadow-lg appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50 text-black"
                    >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                    </select>
                </div>
            </div>

            <div class="flex items-center justify-between mt-6">
                <button
                    type="submit"
                    class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                    Create Ticket
                </button>
                <button
                    type="button"
                    on:click={cancelCreate}
                    class="bg-gradient-to-r from-gray-500 to-gray-600 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                    Cancel
                </button>
            </div>
        </form>
    </div>
{/if}

    
    <!-- Edit Ticket Form -->
    {#if editingTicket}
    <div class="bg-gradient-to-r from-red-300  to-blue-500 p-8 rounded-lg shadow-lg mb-6">
        <h2 class="text-2xl font-semibold text-white mb-6">Edit Ticket #{editingTicket.id}</h2>
        <form method="POST" action="?/updateTicket" use:enhance>
            <input type="hidden" name="id" value={editingTicket.id}>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="mb-6">
                    <label class="block text-white text-sm font-bold mb-2" for="edit-licensePlate">
                        License Plate
                    </label>
                    <input 
                        id="edit-licensePlate" 
                        name="licensePlate" 
                        type="text" 
                        class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                        value={editingTicket.licensePlate}
                        required
                    >
                </div>
                
                <div class="mb-6">
                    <label class="block text-white text-sm font-bold mb-2" for="edit-violationType">
                        Violation Type
                    </label>
                    <input 
                        id="edit-violationType" 
                        name="violationType" 
                        type="text" 
                        class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                        value={editingTicket.violationType}
                        required
                    >
                </div>
                
                <div class="mb-6">
                    <label class="block text-white text-sm font-bold mb-2" for="edit-fineAmount">
                        Fine Amount
                    </label>
                    <input 
                        id="edit-fineAmount" 
                        name="fineAmount" 
                        type="number" 
                        step="0.01" 
                        class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                        value={editingTicket.fineAmount}
                        required
                    >
                </div>
                
                <div class="mb-6">
                    <label class="block text-white text-sm font-bold mb-2" for="edit-dateIssued">
                        Date Issued
                    </label>
                    <input 
                        id="edit-dateIssued" 
                        name="dateIssued" 
                        type="date" 
                        class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                        value={editingTicket.dateIssued ? new Date(editingTicket.dateIssued).toISOString().substring(0, 10) : ''}
                    >
                </div>
                
                <div class="mb-6">
                    <label class="block text-black text-sm font-bold mb-2" for="edit-status">
                        Status
                    </label>
                    <select 
                        id="edit-status" 
                        name="status" 
                        class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                    >
                        <option value="unpaid" selected={editingTicket.status === 'unpaid'}>Unpaid</option>
                        <option value="paid" selected={editingTicket.status === 'paid'}>Paid</option>
                    </select>
                </div>
            </div>
            
            <div class="flex items-center justify-between mt-6">
                <button 
                    type="submit" 
                    class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 mr-2 bg-amber-50"
                >
                    Update Ticket
                </button>
                <button 
                    type="button" 
                    on:click={cancelEdit}
                    class="bg-gradient-to-r from-gray-500 to-gray-600 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-amber-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    </div>
{/if}

    
    <!-- Results Summary -->
    <div class="mb-4 text-gray-900">
        <p class="text-lg font-semibold">
            Showing {data.tickets.length} {data.tickets.length === 1 ? 'ticket' : 'tickets'}
            {data.filters.search ? `matching "${data.filters.search}"` : ''}
            {data.filters.status ? `with status "${data.filters.status}"` : ''}
            {data.filters.userId ? `for selected user` : ''}
        </p>
    </div>
    
    <!-- Tickets Table -->
    {#if data.error}
        <p class="text-red-800 bg-red-200 p-4 rounded-lg text-center shadow-lg">{data.error}</p>
    {:else if data.tickets.length === 0}
        <p class="text-gray-800 text-center">No tickets found.</p>
    {:else}
        <div class="overflow-x-auto shadow-2xl rounded-lg bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 p-4">
            <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <thead class="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
                    <tr>
                        <th class="py-3 px-4 text-left font-semibold text-sm">ID</th>
                        <th class="py-3 px-4 text-left font-semibold text-sm">Assigned To</th>
                        <th class="py-3 px-4 text-left font-semibold text-sm cursor-pointer" on:click={() => toggleSort('licensePlate')}>
                            License Plate {getSortIndicator('licensePlate')}
                        </th>
                        <th class="py-3 px-4 text-left font-semibold text-sm cursor-pointer" on:click={() => toggleSort('violationType')}>
                            Violation {getSortIndicator('violationType')}
                        </th>
                        <th class="py-3 px-4 text-left font-semibold text-sm cursor-pointer" on:click={() => toggleSort('fineAmount')}>
                            Fine {getSortIndicator('fineAmount')}
                        </th>
                        <th class="py-3 px-4 text-left font-semibold text-sm cursor-pointer" on:click={() => toggleSort('dateIssued')}>
                            Date Issued {getSortIndicator('dateIssued')}
                        </th>
                        <th class="py-3 px-4 text-left font-semibold text-sm cursor-pointer" on:click={() => toggleSort('status')}>
                            Status {getSortIndicator('status')}
                        </th>
                        <th class="py-3 px-4 text-left font-semibold text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.tickets as ticket}
                        <tr class="border-b border-gray-200 hover:bg-teal-50 transition-all duration-300">
                            <td class="py-3 px-6 text-gray-900">{ticket.id}</td>
                            <td class="py-3 px-6 text-gray-900 relative group">
                                {#if ticket.user}
                                    <span class="text-blue-700 cursor-pointer hover:underline">
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
                                    <span class="text-gray-700">Unknown</span>
                                {/if}
                            </td>
                            <td class="py-3 px-6 text-gray-900">{ticket.licensePlate}</td>
                            <td class="py-3 px-6 text-gray-900">{ticket.violationType}</td>
                            <td class="py-3 px-6 text-gray-900">${ticket.fineAmount}</td>
                            <td class="py-3 px-6 text-gray-900">
                                {#if ticket.dateIssued}
                                    {new Date(ticket.dateIssued).toLocaleDateString()}
                                {:else}
                                    N/A
                                {/if}
                            </td>
                            <td class="py-3 px-6">
                                <span
                                    class="px-3 py-1 rounded-full text-xs font-semibold text-black"
                                    class:bg-green-200={ticket.status === 'paid'}
                                    class:bg-yellow-200={ticket.status === 'unpaid'}
                                    class:bg-gray-300={ticket.status === null}
                                >
                                    {ticket.status || 'N/A'}
                                </span>
                            </td>
                            <td class="py-3 px-6 flex space-x-2">
                                <!-- <a href={`/tickets/${ticket.id}`} class="text-teal-500 hover:underline transition-all duration-300 mr-3 mt-2">View</a> -->
                                
                                <button 
                                    on:click={() => startEdit(ticket)} 
                                    class="bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg py-2 px-4 transition-all duration-300"
                                >
                                    Edit
                                </button>

                                <form method="POST" action="?/deleteTicket" use:enhance class="inline">
                                    <input type="hidden" name="id" value={ticket.id}>
                                    <button 
                                        type="button" 
                                        class="bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-lg py-2 px-4 transition-all duration-300"
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
                                        class="bg-purple-500 text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg py-2 px-4 transition-all duration-300 whitespace-nowrap text-xs"
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
<footer class="bg-emerald-500 text-white py-6 mt-20">
    <div class="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <p class="text-xl">&copy; 2025 TrafficFlow System. All rights reserved.</p>
        <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="/about" class="text-black hover:text-cyan-400 ">About</a>
            <a href="/privacy" class="text-gray-300 hover:text-cyan-400 ">Privacy</a>
            <a href="/terms" class="text-gray-300 hover:text-cyan-400">Terms</a>
            <a href="/contact" class="text-gray-300 hover:text-cyan-400 ">Contact</a>
        </div>
    </div>
    </footer>