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

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">User Management</h1>

    <div class="mb-6">
        {#if !isCreating && !editingUser}
            <button 
                on:click={startCreateUser}
                class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
                Add New User
            </button>
        {:else}
            <button 
                on:click={resetForm}
                class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2"
            >
                Cancel
            </button>
        {/if}
    </div>

    {#if isCreating || editingUser}
        <div class="bg-gray-100 p-4 rounded mb-6">
            <h2 class="text-xl font-semibold mb-4">
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
                class="space-y-4"
            >
                {#if editingUser}
                    <input type="hidden" name="id" value={editingUser} />
                {/if}

                <div>
                    <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                        type="text" 
                        id="fullName" 
                        name="fullName" 
                        bind:value={formData.fullName} 
                        class="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        bind:value={formData.email} 
                        class="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                        type="tel" 
                        id="phoneNumber" 
                        name="phoneNumber" 
                        bind:value={formData.phoneNumber} 
                        class="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea 
                        id="address" 
                        name="address" 
                        bind:value={formData.address} 
                        class="w-full p-2 border rounded"
                        rows="3"
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                >
                    {isCreating ? 'Create User' : 'Update User'}
                </button>
            </form>
        </div>
    {/if}

    <div class="overflow-x-auto">
        <table class="min-w-full bg-white border">
            <thead>
                <tr class="bg-gray-100">
                    <th class="py-2 px-4 border text-left">Full Name</th>
                    <th class="py-2 px-4 border text-left">Email</th>
                    <th class="py-2 px-4 border text-left">Phone Number</th>
                    <th class="py-2 px-4 border text-left">Address</th>
                    <th class="py-2 px-4 border text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#if users.length === 0}
                    <tr>
                        <td colspan="5" class="py-4 px-4 border text-center text-gray-500">
                            No users found. Create a new user to get started.
                        </td>
                    </tr>
                {:else}
                    {#each users as user}
                        <tr class="hover:bg-gray-50">
                            <td class="py-2 px-4 border">{user.fullName}</td>
                            <td class="py-2 px-4 border">{user.email}</td>
                            <td class="py-2 px-4 border">{user.phoneNumber || '-'}</td>
                            <td class="py-2 px-4 border">{user.address || '-'}</td>
                            <td class="py-2 px-4 border text-center">
                                <button 
                                    on:click={() => editUser(user)}
                                    class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm mr-2"
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
                                    class="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm"
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