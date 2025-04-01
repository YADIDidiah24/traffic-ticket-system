<script lang="ts">
    import "../app.css";

    // Define the expected type for 'data'
    interface TicketStats {
        totalTickets: number;
        unpaidTickets: number;
        totalCollected: number;
    }

    interface Ticket {
        id: number;
        licensePlate: string;
        violationType: string;
        status: "paid" | "unpaid" | null;
    }

    interface PageData {
        recentTickets: Ticket[];
        stats: TicketStats;
    }

    export let data: PageData;

        import { onMount } from "svelte";

    let darkMode = false;
    let mobileMenuOpen = false;

    function toggleDarkMode() {
    darkMode = !darkMode;
    document.documentElement.classList.toggle("dark", darkMode);
    }
</script>



<div class="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:text-slate-200">
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
    
    

    <main class="container mx-auto px-6 py-16">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-5xl font-extrabold text-emerald-700 dark:text-emerald-300 mb-12 text-center leading-tight mt-15">Empowering Efficient Traffic Management</h1>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                    <h2 class="text-3xl font-semibold text-slate-800 dark:text-slate-200 mb-6">Ticket Management</h2>
                    <p class="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">Streamline the process of issuing, managing, and resolving traffic tickets with our intuitive system.</p>
                    <a href="/tickets" class="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200" style="color: white;">
                        <span>View Tickets</span>
                        <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </a>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                    <h2 class="text-3xl font-semibold text-slate-800 dark:text-slate-200 mb-6">Performance Dashboard</h2>
                    <p class="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">Gain actionable insights into traffic patterns and enforcement effectiveness with the dashboard.</p>
                    <a href="/dashboard" class="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200" style="color: white;">
                        <span>View Dashboard</span>
                        <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </a>
                </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
                <h2 class="text-3xl font-semibold text-slate-800 dark:text-slate-200 mb-6">Recent Activity</h2>
                
                {#if data && data.recentTickets && data.recentTickets.length > 0}
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white dark:bg-gray-900">
                            <thead class="bg-slate-100 dark:bg-gray-700">
                                <tr>
                                    <th class="py-3 px-4 text-left text-slate-600 dark:text-slate-200 font-medium">ID</th>
                                    <th class="py-3 px-4 text-left text-slate-600 dark:text-slate-200 font-medium">License Plate</th>
                                    <th class="py-3 px-4 text-left text-slate-600 dark:text-slate-200 font-medium">Violation</th>
                                    <th class="py-3 px-4 text-left text-slate-600 dark:text-slate-200 font-medium">Status</th>
                                    <th class="py-3 px-4 text-left text-slate-600 dark:text-slate-200 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each data.recentTickets as ticket}
                                    <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800">
                                        <td class="py-3 px-4">{ticket.id}</td>
                                        <td class="py-3 px-4">{ticket.licensePlate}</td>
                                        <td class="py-3 px-4">{ticket.violationType}</td>
                                        <td class="py-3 px-4">
                                            <span class="px-3 py-1 rounded-full text-xs font-semibold text-black" class:bg-green-200={ticket.status === 'paid'} class:bg-yellow-200={ticket.status === 'unpaid'} class:bg-red-200={ticket.status === null}>
                                                {ticket.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td class="py-3 px-4">
                                            <a href={`/tickets/${ticket.id}`} class="text-teal-500 hover:underline">View</a>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {:else}
                    <p class="text-slate-600 dark:text-slate-400 text-center py-4">No recent tickets found.</p>
                {/if}
            </div>
        </div>
    </main>
    
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

    
    
    
    <script>
        document.getElementById('menu-toggle').addEventListener('click', function() {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });
    </script>
    
</div>