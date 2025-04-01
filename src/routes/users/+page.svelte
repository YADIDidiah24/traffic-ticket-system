<script lang="ts">
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
</script>

<svelte:head>
    <title>User Management</title>
</svelte:head>


<nav class="!bg-emerald-500 shadow-lg fixed w-full top-0 z-50">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" class="text-2xl font-semibold tracking-wide !text-white">TrafficFlow</a>
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
    <div class="hidden md:hidden bg-[#172554] absolute w-full left-0 top-full py-2" id="mobile-menu">
        <a href="/" class="block px-6 py-3 hover:bg-[#0F172A] transition-colors">Home</a>
        <a href="/tickets" class="block px-6 py-3 hover:bg-[#0F172A] transition-colors">Tickets</a>
        <a href="/dashboard" class="block px-6 py-3 hover:bg-[#0F172A] transition-colors">Dashboard</a>
        <a href="/reports" class="block px-6 py-3 hover:bg-[#0F172A] transition-colors">Reports</a>
    </div>
</nav>





<div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8 text-center text-blue-600">User Management</h1>

    <div class="mb-6 flex justify-end">
        {#if !isCreating && !editingUser}
            <button 
                on:click={startCreateUser}
                class="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg shadow-md transition-colors duration-200"
            >
                Add New User
            </button>
        {:else}
            <button 
                on:click={resetForm}
                class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md mr-2 transition-colors duration-200"
            >
                Cancel
            </button>
        {/if}
    </div>

    {#if isCreating || editingUser}
        <div class="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 class="text-2xl font-semibold mb-6 text-gray-700">
                {isCreating ? 'Create New User' : 'Edit User'}
            </h2>

            <form 
                method="POST" 
                action="?/{isCreating ? 'createUser' : 'updateUser'}" 
                use:enhance={() => {
                    return ({ result }) => {
                        if (result.type === 'success') {
                            handleSuccess();
                        }
                    };
                }}
                class="space-y-5"
            >
                {#if editingUser}
                    <input type="hidden" name="id" value={editingUser} />
                {/if}

                <div>
                    <label for="fullName" class="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                    <input 
                        type="text" 
                        id="fullName" 
                        name="fullName" 
                        bind:value={formData.fullName} 
                        class="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        bind:value={formData.email} 
                        class="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label for="phoneNumber" class="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    <input 
                        type="tel" 
                        id="phoneNumber" 
                        name="phoneNumber" 
                        bind:value={formData.phoneNumber} 
                        class="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label for="address" class="block text-sm font-medium text-gray-600 mb-1">Address</label>
                    <textarea 
                        id="address" 
                        name="address" 
                        bind:value={formData.address} 
                        class="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows="3"
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    class="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
                >
                    {isCreating ? 'Create User' : 'Update User'}
                </button>
            </form>
        </div>
    {/if}

    <div class="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
        <table class="min-w-full bg-gray-50 border-separate border-spacing-0">
            <thead class="bg-gray-100">
                <tr>
                    <th class="py-3 px-6 text-left text-gray-600 font-medium">Full Name</th>
                    <th class="py-3 px-6 text-left text-gray-600 font-medium">Email</th>
                    <th class="py-3 px-6 text-left text-gray-600 font-medium">Phone Number</th>
                    <th class="py-3 px-6 text-left text-gray-600 font-medium">Address</th>
                    <th class="py-3 px-6 text-center text-gray-600 font-medium">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#if users.length === 0}
                    <tr>
                        <td colspan="5" class="py-4 px-6 text-center text-gray-500">
                            No users found. Create a new user to get started.
                        </td>
                    </tr>
                {:else}
                    {#each users as user}
                        <tr class="hover:bg-gray-100 transition-colors duration-200 text-blue-500">
                            <td class="py-3 px-6">{user.fullName}</td>
                            <td class="py-3 px-6">{user.email}</td>
                            <td class="py-3 px-6">{user.phoneNumber || '-'}</td>
                            <td class="py-3 px-6">{user.address || '-'}</td>
                            <td class="py-3 px-6 text-center">
                                <button 
                                    on:click={() => editUser(user)}
                                    class="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow-md text-sm mr-2 transition-colors duration-200"
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
                                    type="submit"
                                    class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-md text-sm transition-colors duration-200"
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
            <a href="/about" class="text-black hover:text-cyan-400 ">About</a>
            <a href="/privacy" class="text-gray-300 hover:text-cyan-400 ">Privacy</a>
            <a href="/terms" class="text-gray-300 hover:text-cyan-400">Terms</a>
            <a href="/contact" class="text-gray-300 hover:text-cyan-400 ">Contact</a>
        </div>
    </div>
    </footer>