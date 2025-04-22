<script lang="ts">
    import "../../../src/app.css";
    import { enhance } from '$app/forms';

    interface User {
        id: number | string;
        fullName: string;
        email: string;
        phoneNumber?: string;
        address?: string;
    }

    export let data: { users: User[] };
    let { users } = data;

    let editingUser: number | string | null = null;
    let isCreating: boolean = false;
    let formData: { fullName: string; email: string; phoneNumber: string; address: string } = {
        fullName: '',
        email: '',
        phoneNumber: '',
        address: ''
    };

    function resetForm() {
        formData = {
            fullName: '',
            email: '',
            phoneNumber: '',
            address: ''
        };
        editingUser = null;
        isCreating = false;
    }

    function editUser(user: User) {
        editingUser = user.id;
        formData = {
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            address: user.address || ''
        };
        isCreating = false;
    }

    function startCreateUser() {
        resetForm();
        isCreating = true;
    }

    function handleSuccess() {
        resetForm();
    }

    // Sort states
    let sortBy = 'fullName';
    let sortOrder = 'asc';
    
    // Function to toggle sort order
    function toggleSort(field: string) {
        if (sortBy === field) {
            sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            sortBy = field;
            sortOrder = 'asc';
        }
    }
    
    // Helper function to get sort indicator
    function getSortIndicator(field: string) {
        if (sortBy !== field) return '';
        return sortOrder === 'asc' ? '↑' : '↓';
    }

    // Search functionality
    let searchTerm = '';
    $: filteredUsers = users.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phoneNumber && user.phoneNumber.includes(searchTerm)) ||
        (user.address && user.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );
</script>
<br>
<br>
<br>
<svelte:head>
    <title>User Management</title>
</svelte:head>

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
    <h1 class="text-3xl font-bold text-white mb-6 text-center">User Management</h1>

    <!-- Search and Action Buttons -->
    <div class="bg-gradient-to-r from-purple-500 via-blue-600 to-teal-500 p-8 rounded-lg shadow-lg mb-6">
        <div class="flex flex-col md:flex-row justify-between mb-4">
            <div class="w-full md:w-1/2 mb-4 md:mb-0 md:mr-4">
                <label class="block text-white text-sm font-bold mb-2" for="search">
                    Search Users
                </label>
                <input 
                    id="search" 
                    type="text" 
                    class="shadow-lg appearance-none border rounded w-full py-3 px-4 !text-black leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                    placeholder="Search by name, email, phone..."
                    bind:value={searchTerm}
                >
            </div>
            <div class="flex items-end">
                {#if !isCreating && !editingUser}
                    <button 
                        on:click={startCreateUser}
                        class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
                    >
                        Add New User
                    </button>
                {:else}
                    <button 
                        on:click={resetForm}
                        class="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300"
                    >
                        Cancel
                    </button>
                {/if}
            </div>
        </div>
    </div>

    <!-- Create User Form -->
    {#if isCreating}
        <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-lg shadow-lg mb-6">
            <h2 class="text-2xl font-semibold text-white mb-6">Create New User</h2>
            <form 
                method="POST" 
                action="?/createUser" 
                use:enhance={() => {
                    return ({ result }) => {
                        if (result.type === 'success') {
                            handleSuccess();
                        }
                    };
                }}
            >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="mb-6">
                        <label for="fullName" class="block text-white text-sm font-bold mb-2">Full Name</label>
                        <input 
                            type="text" 
                            id="fullName" 
                            name="fullName" 
                            bind:value={formData.fullName} 
                            class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                            required
                        />
                    </div>

                    <div class="mb-6">
                        <label for="email" class="block text-white text-sm font-bold mb-2">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            bind:value={formData.email} 
                            class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                            required
                        />
                    </div>

                    <div class="mb-6">
                        <label for="phoneNumber" class="block text-white text-sm font-bold mb-2">Phone Number</label>
                        <input 
                            type="tel" 
                            id="phoneNumber" 
                            name="phoneNumber" 
                            bind:value={formData.phoneNumber} 
                            class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                        />
                    </div>

                    <div class="mb-6">
                        <label for="address" class="block text-white text-sm font-bold mb-2">Address</label>
                        <textarea 
                            id="address" 
                            name="address" 
                            bind:value={formData.address} 
                            class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                            rows="3"
                        ></textarea>
                    </div>
                </div>

                <div class="flex items-center justify-between mt-6">
                    <button 
                        type="submit" 
                        class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
                    >
                        Create User
                    </button>
                    <button 
                        type="button" 
                        on:click={resetForm}
                        class="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    {/if}

    <!-- Edit User Form -->
    {#if editingUser}
        <div class="bg-gradient-to-r from-red-300 to-blue-500 p-8 rounded-lg shadow-lg mb-6">
            <h2 class="text-2xl font-semibold text-white mb-6">Edit User</h2>
            <form 
                method="POST" 
                action="?/updateUser" 
                use:enhance={() => {
                    return ({ result }) => {
                        if (result.type === 'success') {
                            handleSuccess();
                        }
                    };
                }}
            >
                <input type="hidden" name="id" value={editingUser} />
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="mb-6">
                        <label for="editFullName" class="block text-white text-sm font-bold mb-2">Full Name</label>
                        <input 
                            type="text" 
                            id="editFullName" 
                            name="fullName" 
                            bind:value={formData.fullName} 
                            class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                            required
                        />
                    </div>

                    <div class="mb-6">
                        <label for="editEmail" class="block text-white text-sm font-bold mb-2">Email</label>
                        <input 
                            type="email" 
                            id="editEmail" 
                            name="email" 
                            bind:value={formData.email} 
                            class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                            required
                        />
                    </div>

                    <div class="mb-6">
                        <label for="editPhoneNumber" class="block text-white text-sm font-bold mb-2">Phone Number</label>
                        <input 
                            type="tel" 
                            id="editPhoneNumber" 
                            name="phoneNumber" 
                            bind:value={formData.phoneNumber} 
                            class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                        />
                    </div>

                    <div class="mb-6">
                        <label for="editAddress" class="block text-white text-sm font-bold mb-2">Address</label>
                        <textarea 
                            id="editAddress" 
                            name="address" 
                            bind:value={formData.address} 
                            class="shadow-lg appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-amber-50"
                            rows="3"
                        ></textarea>
                    </div>
                </div>

                <div class="flex items-center justify-between mt-6">
                    <button 
                        type="submit" 
                        class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
                    >
                        Update User
                    </button>
                    <button 
                        type="button" 
                        on:click={resetForm}
                        class="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300"
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
            Showing {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
            {searchTerm ? `matching "${searchTerm}"` : ''}
        </p>
    </div>

    <!-- Users Table -->
    <div class="overflow-x-auto shadow-2xl rounded-lg bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 p-4">
        <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <thead class="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
                <tr>
                    <th class="py-3 px-4 text-left font-semibold text-sm cursor-pointer" on:click={() => toggleSort('fullName')}>
                        Full Name {getSortIndicator('fullName')}
                    </th>
                    <th class="py-3 px-4 text-left font-semibold text-sm cursor-pointer" on:click={() => toggleSort('email')}>
                        Email {getSortIndicator('email')}
                    </th>
                    <th class="py-3 px-4 text-left font-semibold text-sm cursor-pointer" on:click={() => toggleSort('phoneNumber')}>
                        Phone Number {getSortIndicator('phoneNumber')}
                    </th>
                    <th class="py-3 px-4 text-left font-semibold text-sm">Address</th>
                    <th class="py-3 px-4 text-center font-semibold text-sm">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#if filteredUsers.length === 0}
                    <tr>
                        <td colspan="5" class="py-6 px-6 text-center text-gray-500">
                            {searchTerm ? 'No users found matching your search.' : 'No users found. Create a new user to get started.'}
                        </td>
                    </tr>
                {:else}
                    {#each filteredUsers as user}
                        <tr class="border-b border-gray-200 hover:bg-teal-50 transition-all duration-300">
                            <td class="py-3 px-6 text-gray-900">{user.fullName}</td>
                            <td class="py-3 px-6 text-gray-900">{user.email}</td>
                            <td class="py-3 px-6 text-gray-900">{user.phoneNumber || '-'}</td>
                            <td class="py-3 px-6 text-gray-900">{user.address || '-'}</td>
                            <td class="py-3 px-6 flex justify-center space-x-2">
                                <button 
                                    on:click={() => editUser(user)}
                                    class="bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg py-2 px-4 transition-all duration-300"
                                >
                                    Edit
                                </button>

                                <form 
                                    method="POST" 
                                    action="?/deleteUser" 
                                    use:enhance
                                    class="inline"
                                >
                                    <input type="hidden" name="id" value={user.id} />
                                    <button
                                        type="button"
                                        class="bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-lg py-2 px-4 transition-all duration-300"
                                        on:click|preventDefault={(e) => {
                                            if (confirm('Are you sure you want to delete this user?')) {
                                                if (e.target instanceof HTMLElement) {
                                                    const form = e.target.closest('form');
                                                    if (form) {
                                                        form.submit();
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>
</div>

<footer class="bg-emerald-500 text-white py-6 mt-20">
    <div class="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <p class="text-xl">&copy; 2025 TrafficFlow System. All rights reserved.</p>
        <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="/about" class="text-black hover:text-cyan-400">About</a>
            <a href="/privacy" class="text-gray-300 hover:text-cyan-400">Privacy</a>
            <a href="/terms" class="text-gray-300 hover:text-cyan-400">Terms</a>
            <a href="/contact" class="text-gray-300 hover:text-cyan-400">Contact</a>
        </div>
    </div>
</footer>
