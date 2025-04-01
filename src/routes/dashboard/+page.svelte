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
              label: 'Revenue ($)',
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
                text: 'Revenue ($)'
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
              label: 'Revenue ($)',
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
                text: 'Revenue ($)'
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
  
  <div class="container mx-auto p-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-wrap justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Traffic Enforcement Dashboard</h1>
        
        <div class="flex flex-wrap gap-4 items-center mt-4 md:mt-0">
          <form class="flex gap-2 items-center" on:submit|preventDefault={updateDateRange}>
            <div>
              <label for="startDate" class="block text-sm text-gray-600">Start Date</label>
              <input 
                type="date" 
                id="startDate" 
                bind:value={startDate} 
                class="border rounded p-1 text-sm"
              />
            </div>
            <div>
              <label for="endDate" class="block text-sm text-gray-600">End Date</label>
              <input 
                type="date" 
                id="endDate" 
                bind:value={endDate} 
                class="border rounded p-1 text-sm"
              />
            </div>
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm mt-5">
              Apply
            </button>
          </form>
          
          <form action="?/exportData" method="post">
            <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Export Data
            </button>
          </form>
        </div>
      </div>
      
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 class="text-sm font-medium text-gray-500 mb-1">Total Tickets</h3>
          <p class="text-3xl font-bold text-gray-800">{data.stats.totalTickets}</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 class="text-sm font-medium text-gray-500 mb-1">Paid Tickets</h3>
          <p class="text-3xl font-bold text-green-600">{data.stats.paidTickets}</p>
          <p class="text-sm text-gray-500 mt-1">
            {Math.round((data.stats.paidTickets / data.stats.totalTickets) * 100) || 0}% of total
          </p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 class="text-sm font-medium text-gray-500 mb-1">Unpaid Tickets</h3>
          <p class="text-3xl font-bold text-yellow-600">{data.stats.unpaidTickets}</p>
          <p class="text-sm text-gray-500 mt-1">
            {Math.round((data.stats.unpaidTickets / data.stats.totalTickets) * 100) || 0}% of total
          </p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 class="text-sm font-medium text-gray-500 mb-1">Total Collected</h3>
          <p class="text-3xl font-bold text-blue-600">{formatCurrency(data.stats.totalCollected)}</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 class="text-sm font-medium text-gray-500 mb-1">Average Fine</h3>
          <p class="text-3xl font-bold text-indigo-600">{formatCurrency(data.stats.averageFine)}</p>
        </div>
      </div>
      
      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Ticket Trend Chart -->
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Ticket Trend</h3>
          <div class="h-72">
            <canvas id="ticketTrendChart"></canvas>
          </div>
        </div>
        
        <!-- Violation Type Chart -->
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Most Common Violations</h3>
          <div class="h-72">
            <canvas id="violationTypeChart"></canvas>
          </div>
        </div>
      </div>
      
      <!-- Second Row of Charts and Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- Status Distribution Chart -->
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Payment Status</h3>
          <div class="h-64">
            <canvas id="statusDistributionChart"></canvas>
          </div>
        </div>
        
        <!-- Top Offenders Table -->
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 lg:col-span-2">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Top Offenders</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Fines</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unpaid</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each data.topOffenders as offender}
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {offender.fullName || 'Unknown User'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {offender.ticketCount}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(offender.totalFines)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
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
          <h3 class="text-xl font-semibold text-gray-700">Recent Tickets</h3>
          <a href="/tickets" class="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</a>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Violation</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each data.recentTickets as { ticket, user }}
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a href={`/tickets/${ticket.id}`} class="text-blue-600 hover:underline">
                      #{ticket.id}
                    </a>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(ticket.dateIssued)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.licensePlate}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.violationType}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(ticket.fineAmount)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      {ticket.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                      {ticket.status}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user?.fullName || 'Unknown'}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>