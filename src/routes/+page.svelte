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
</script>


<div class="container mx-auto p-6">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">Traffic Enforcement System</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <h2 class="text-2xl font-semibold text-gray-700 mb-4">Traffic Tickets</h2>
                <p class="text-gray-600 mb-6">View, manage, and process traffic violations and tickets in the system.</p>
                <a href="/tickets" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    View Tickets
                </a>
            </div>
            
            <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <h2 class="text-2xl font-semibold text-gray-700 mb-4">Dashboard</h2>
                <p class="text-gray-600 mb-6">Access analytics, reports, and statistics on traffic violations and enforcement.</p>
                <a href="/dashboard" class="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    View Dashboard
                </a>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 class="text-2xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
            
            {#if data && data.recentTickets && data.recentTickets.length > 0}
                <div class="overflow-x-auto">
                    <table class="min-w-full bg-white">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="py-2 px-4 text-left text-gray-600">ID</th>
                                <th class="py-2 px-4 text-left text-gray-600">License Plate</th>
                                <th class="py-2 px-4 text-left text-gray-600">Violation</th>
                                <th class="py-2 px-4 text-left text-gray-600">Status</th>
                                <th class="py-2 px-4 text-left text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each data.recentTickets as ticket}
                                <tr class="border-b border-gray-200 hover:bg-gray-50">
                                    <td class="py-2 px-4">{ticket.id}</td>
                                    <td class="py-2 px-4">{ticket.licensePlate}</td>
                                    <td class="py-2 px-4">{ticket.violationType}</td>
                                    <td class="py-2 px-4">
                                        <span
                                            class="px-2 py-1 rounded-full text-xs font-semibold"
                                            class:bg-green-200={ticket.status === 'paid'}
                                            class:bg-yellow-200={ticket.status === 'unpaid'}
                                            class:bg-red-200={ticket.status === null}
                                        >
                                            {ticket.status || 'N/A'}
                                        </span>
                                    </td>
                                    <td class="py-2 px-4">
                                        <a href={`/tickets/${ticket.id}`} class="text-blue-500 hover:underline">View</a>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                <div class="mt-4 text-right">
                    <a href="/tickets" class="text-blue-600 hover:text-blue-800 font-medium">View All Tickets →</a>
                </div>
            {:else}
                <p class="text-gray-600 text-center py-4">No recent tickets found.</p>
            {/if}
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h3 class="text-xl font-semibold text-gray-700 mb-3">Quick Stats</h3>
                <div class="text-3xl font-bold text-blue-600 mb-2">{data?.stats?.totalTickets || '0'}</div>
                <p class="text-gray-600">Total Tickets</p>
            </div>
            
            <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h3 class="text-xl font-semibold text-gray-700 mb-3">Unpaid Tickets</h3>
                <div class="text-3xl font-bold text-yellow-600 mb-2">{data?.stats?.unpaidTickets || '0'}</div>
                <p class="text-gray-600">Pending Payment</p>
            </div>
            
            <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h3 class="text-xl font-semibold text-gray-700 mb-3">Collections</h3>
                <div class="text-3xl font-bold text-green-600 mb-2">${data?.stats?.totalCollected || '0'}</div>
                <p class="text-gray-600">Total Collected</p>
            </div>
        </div>
    </div>
</div>