<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import Chart from 'chart.js/auto';
  
    export let data;
  
    let ticketTrendChart: Chart;
    let violationTypeChart: Chart;
    let statusDistributionChart: Chart;
  
    // For date range filtering
    let startDate = data.dateRange.startDate;
    let endDate = data.dateRange.endDate;
  
    function updateDateRange() {
      goto(`?startDate=${startDate}&endDate=${endDate}`, { keepFocus: true });
    }
  
    onMount(() => {
      // Initialize charts once DOM is ready
      createTicketTrendChart();
      createViolationTypeChart();
      createStatusDistributionChart();
  
      return () => {
        // Cleanup charts on component unmount
        if (ticketTrendChart) ticketTrendChart.destroy();
        if (violationTypeChart) violationTypeChart.destroy();
        if (statusDistributionChart) statusDistributionChart.destroy();
      };
    });
  
    // Re-create charts when data changes
    $: if (data && typeof window !== 'undefined') {
      if (ticketTrendChart) ticketTrendChart.destroy();
      if (violationTypeChart) violationTypeChart.destroy();
      if (statusDistributionChart) statusDistributionChart.destroy();
      
      setTimeout(() => {
        createTicketTrendChart();
        createViolationTypeChart();
        createStatusDistributionChart();
      }, 0);
    }
  
    function createTicketTrendChart() {
      const ctx = document.getElementById('ticketTrendChart') as HTMLCanvasElement;
      if (!ctx) return;
  
      const labels = data.ticketTrend.map(item => item.month);
      const paidData = data.ticketTrend.map(item => item.paid);
      const unpaidData = data.ticketTrend.map(item => item.unpaid);
      const revenueData = data.ticketTrend.map(item => item.revenue);
  
      ticketTrendChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Paid Tickets',
              data: paidData,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: 'Unpaid Tickets',
              data: unpaidData,
              backgroundColor: 'rgba(255, 159, 64, 0.5)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1
            },
            {
              label: 'Revenue (AED)',
              data: revenueData,
              type: 'line',
              yAxisID: 'y1',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              tension: 0.1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Tickets'
              }
            },
            y1: {
              beginAtZero: true,
              position: 'right',
              title: {
                display: true,
                text: 'Revenue (AED)'
              },
              grid: {
                drawOnChartArea: false
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  
    function createViolationTypeChart() {
      const ctx = document.getElementById('violationTypeChart') as HTMLCanvasElement;
      if (!ctx) return;
  
      const labels = data.mostCommonViolations.map(v => v.violationType);
      const counts = data.mostCommonViolations.map(v => v.count);
      const revenues = data.mostCommonViolations.map(v => v.totalRevenue);
  
      violationTypeChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Number of Tickets',
              data: counts,
              backgroundColor: 'rgba(153, 102, 255, 0.5)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
            },
            {
              label: 'Revenue (AED)',
              data: revenues,
              type: 'line',
              yAxisID: 'y1',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              tension: 0.1
            }
          ]
        },
        options: {
          indexAxis: 'y',
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Tickets'
              }
            },
            y1: {
              position: 'right',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Revenue (AED)'
              },
              grid: {
                drawOnChartArea: false
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  
    function createStatusDistributionChart() {
      const ctx = document.getElementById('statusDistributionChart') as HTMLCanvasElement;
      if (!ctx) return;
  
      statusDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Paid', 'Unpaid'],
          datasets: [
            {
              data: [data.stats.paidTickets, data.stats.unpaidTickets],
              backgroundColor: [
                'rgba(75, 192, 192, 0.5)',
                'rgba(255, 159, 64, 0.5)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  
    function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'AED'
    }).format(amount);
}
  
function formatDate(date: string | Date | null): string {
    if (date === null) {
        return 'N/A'; // Or any other placeholder for null dates
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
    }

    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
  </script>
  
  <nav class="!bg-emerald-500 shadow-lg fixed w-full top-0 z-50">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" class="text-2xl font-semibold tracking-wide text-cyan-400">TrafficFlow</a>
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
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-wrap justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-white">🚦 Traffic Enforcement Dashboard</h1>
        
        <div class="flex flex-wrap gap-4 items-center mt-4 md:mt-0">
          <!-- Date Range Picker -->
          <form class="flex gap-2 items-center" on:submit|preventDefault={updateDateRange}>
            <div>
              <label for="startDate" class="block text-sm text-gray-700">Start Date</label>
              <input 
                type="date" 
                id="startDate" 
                bind:value={startDate} 
                class="border rounded p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              />
            </div>
            <div>
              <label for="endDate" class="block text-sm text-gray-700">End Date</label>
              <input 
                type="date" 
                id="endDate" 
                bind:value={endDate} 
                class="border rounded p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              />
            </div>
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm mt-5 transition">
              Apply
            </button>
          </form>
          
          <!-- Export Button -->
          <form action="?/exportData" method="post">
            <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">
              📥 Export Data
            </button>
          </form>
        </div>
      </div>
  
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {#each [
          { title: "Total Tickets", value: data.stats.totalTickets, color: "text-gray-800" },
          { title: "Paid Tickets", value: data.stats.paidTickets, color: "text-green-600", percentage: Math.round((data.stats.paidTickets / data.stats.totalTickets) * 100) || 0 },
          { title: "Unpaid Tickets", value: data.stats.unpaidTickets, color: "text-yellow-600", percentage: Math.round((data.stats.unpaidTickets / data.stats.totalTickets) * 100) || 0 },
          { title: "Total Collected", value: formatCurrency(data.stats.totalCollected), color: "text-blue-600" },
          { title: "Average Fine", value: formatCurrency(data.stats.averageFine), color: "text-indigo-600" }
        ] as stat}
          <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 class="text-sm font-medium text-gray-500 mb-1">{stat.title}</h3>
            <p class="text-3xl font-bold {stat.color}">{stat.value}</p>
            {#if stat.percentage !== undefined}
              <p class="text-sm text-gray-500 mt-1">{stat.percentage}% of total</p>
            {/if}
          </div>
        {/each}
      </div>
  
      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">📊 Ticket Trend</h3>
          <div class="h-72">
            <canvas id="ticketTrendChart"></canvas>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">🔍 Most Common Violations</h3>
          <div class="h-72">
            <canvas id="violationTypeChart"></canvas>
          </div>
        </div>
      </div>
  
      <!-- Status Chart & Top Offenders -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">💳 Payment Status</h3>
          <div class="h-64">
            <canvas id="statusDistributionChart"></canvas>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 lg:col-span-2">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">🚨 Top Offenders</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {#each ["Name", "Tickets", "Total Fines", "Unpaid"] as header}
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                  {/each}
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each data.topOffenders as offender}
                  <tr class="even:bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{offender.fullName || 'Unknown User'}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{offender.ticketCount}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{formatCurrency(offender.totalFines)}</td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 text-xs font-semibold rounded-full {offender.unpaidCount > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">
                        {offender.unpaidCount} ({formatCurrency(offender.unpaidAmount)})
                      </span>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- Recent Tickets -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-700">📋 Recent Tickets</h3>
          <a href="/tickets" class="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</a>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {#each ["ID", "Date", "License Plate", "Violation", "Fine", "Status", "User"] as header}
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                {/each}
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each data.recentTickets as { ticket, user }}
                <tr class="even:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-500"><a href={`/tickets/${ticket.id}`} class="text-blue-600 hover:underline">#{ticket.id}</a></td>
                  <td class="px-6 py-4 text-sm text-gray-500">{formatDate(ticket.dateIssued)}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{ticket.licensePlate}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{ticket.violationType}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{formatCurrency(ticket.fineAmount)}</td>
                  <td class="px-6 py-4">{ticket.status}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{user?.fullName || 'Unknown'}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
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