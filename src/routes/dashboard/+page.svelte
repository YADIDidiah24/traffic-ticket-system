<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Chart from 'chart.js/auto';

  document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportToPDF);
    } else {
      console.warn('Export button not found in the DOM');
    }
  });

  export let data;

  let ticketTrendChart: Chart | null = null;
  let violationTypeChart: Chart | null = null;
  let statusDistributionChart: Chart | null = null;
  
  // Elements references
  let ticketTrendCanvas: HTMLCanvasElement;
  let violationTypeCanvas: HTMLCanvasElement;
  let statusDistributionCanvas: HTMLCanvasElement;

  // For date range filtering
  let startDate = data.dateRange.startDate;
  let endDate = data.dateRange.endDate;

  function updateDateRange() {
    goto(`?startDate=${startDate}&endDate=${endDate}`, { keepFocus: true });
  }

  // Safely destroy chart if it exists
  function safeDestroyChart(chart: Chart | null) {
    if (chart) {
      chart.destroy();
      return null;
    }
    return null;
  }



// Apply the updated options to each chart
function createTicketTrendChart() {
    if (!ticketTrendCanvas) return;
    
    ticketTrendChart = safeDestroyChart(ticketTrendChart);
    if (!data.ticketTrend || !data.ticketTrend.length) return;

    const labels = data.ticketTrend.map(item => item.month);
    const paidData = data.ticketTrend.map(item => item.paid);
    const unpaidData = data.ticketTrend.map(item => item.unpaid);
    const revenueData = data.ticketTrend.map(item => item.revenue);

    ticketTrendChart = new Chart(ticketTrendCanvas, {
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
              plugins: {
                  legend: {
                    labels: {
                        color: "#000"
                    },
                      position: 'bottom'
                  }
              },
              responsive: true,
              maintainAspectRatio: false,
          } // Apply black text options
    });
}

function createViolationTypeChart() {
    if (!violationTypeCanvas) return;

    violationTypeChart = safeDestroyChart(violationTypeChart);
    if (!data.mostCommonViolations || !data.mostCommonViolations.length) return;

    const labels = data.mostCommonViolations.map(v => v.violationType);
    const counts = data.mostCommonViolations.map(v => v.count);
    const revenues = data.mostCommonViolations.map(v => v.totalRevenue);

    violationTypeChart = new Chart(violationTypeCanvas, {
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
              plugins: {
                  legend: {
                    labels: {
                        color: "#000"
                    },
                      position: 'bottom'
                  }
              },
              responsive: true,
              maintainAspectRatio: false,
          } // Apply black text options
    });
}

function createStatusDistributionChart() {
    if (!statusDistributionCanvas) return;

    statusDistributionChart = safeDestroyChart(statusDistributionChart);
    if (!data.stats) return;

    statusDistributionChart = new Chart(statusDistributionCanvas, {
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
              plugins: {
                  legend: {
                    labels: {
                        color: "#000"
                    },
                      position: 'bottom'
                  }
              },
              responsive: true,
              maintainAspectRatio: false,
          }
    });
}


  // Initialize all charts when component is mounted
  onMount(() => {
    // Delay chart creation to ensure DOM is fully rendered
    setTimeout(() => {
      createTicketTrendChart();
      createViolationTypeChart();
      createStatusDistributionChart();
    }, 100);
    
    // Clean up on component destruction
    return () => {
      safeDestroyChart(ticketTrendChart);
      safeDestroyChart(violationTypeChart);
      safeDestroyChart(statusDistributionChart);
    };
  });
  
  // Update charts when data changes
  $: if (data) {
    // Use setTimeout to ensure the update happens after any DOM updates
    setTimeout(() => {
      createTicketTrendChart();
      createViolationTypeChart();
      createStatusDistributionChart();
    }, 100);
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'AED'
    }).format(amount);
  }
  
  function formatDate(date: string | Date | null): string {
    if (date === null) {
        return 'N/A';
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


  import { browser } from '$app/environment';
  
  // Declare the PDF libraries - we'll import them dynamically to avoid SSR issues
  let jsPDF: any;
  let html2canvas: any;
  
  // Load PDF libraries only in the browser
  onMount(async () => {
    if (browser) {
      const jsPDFModule = await import('jspdf');
      const html2canvasModule = await import('html2canvas');
      jsPDF = jsPDFModule.default;
      html2canvas = html2canvasModule.default;
    }
  });
  
  // PDF export function
  

  // PDF export function - improved version
// Alternative PDF export function - data-focused approach
async function exportToPDF() {
  if (!jsPDF) {
    console.error("jsPDF library not loaded yet");
    alert("PDF generation library is still loading. Please try again in a few seconds.");
    return;
  }
  
  try {
    // Show loading indication
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.textContent = "Generating PDF...";
      exportBtn.setAttribute('disabled', 'true');
    }
    
    // Create PDF document
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let y = margin;
    
    // Add title and date
    pdf.setFontSize(18);
    pdf.setTextColor(0, 102, 102); // teal color
    pdf.text('Traffic Enforcement Dashboard Report', pageWidth / 2, y, { align: 'center' });
    y += 10;
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100); // gray
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    pdf.text(`Generated on ${dateStr}`, pageWidth / 2, y, { align: 'center' });
    y += 15;
    
    // Add date range
    pdf.setFontSize(11);
    pdf.setTextColor(60, 60, 60);
    pdf.text(`Report Period: ${formatDate(data.dateRange.startDate)} to ${formatDate(data.dateRange.endDate)}`, pageWidth / 2, y, { align: 'center' });
    y += 15;
    
    // Add summary statistics
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Summary Statistics', margin, y);
    y += 8;
    
    // Draw summary stats table
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    const stats = [
      ['Total Tickets', data.stats.totalTickets.toString()],
      ['Paid Tickets', `${data.stats.paidTickets} (${Math.round((data.stats.paidTickets / data.stats.totalTickets) * 100) || 0}%)`],
      ['Unpaid Tickets', `${data.stats.unpaidTickets} (${Math.round((data.stats.unpaidTickets / data.stats.totalTickets) * 100) || 0}%)`],
      ['Total Collected', formatCurrency(data.stats.totalCollected)],
      ['Average Fine', formatCurrency(data.stats.averageFine)]
    ];
    
    // Draw the stats table
    const cellPadding = 5;
    const colWidth = (pageWidth - margin * 2) / 2;
    
    pdf.setDrawColor(220, 220, 220); // light gray
    pdf.setFillColor(240, 240, 240); // lighter gray for header
    
    // Header row - light fill
    pdf.setFillColor(230, 230, 230);
    pdf.rect(margin, y, pageWidth - margin * 2, 8, 'F');
    
    // Table header
    pdf.setFont('helvetica', 'bold');
    pdf.text('Metric', margin + cellPadding, y + 5.5);
    pdf.text('Value', margin + colWidth + cellPadding, y + 5.5);
    y += 8;
    
    // Table data
    pdf.setFont('helvetica', 'normal');
    stats.forEach((row, i) => {
      // Alternate row background for readability
      if (i % 2 === 0) {
        pdf.setFillColor(248, 248, 248);
        pdf.rect(margin, y, pageWidth - margin * 2, 7, 'F');
      }
      
      pdf.text(row[0], margin + cellPadding, y + 5);
      pdf.text(row[1], margin + colWidth + cellPadding, y + 5);
      y += 7;
    });
    
    // Draw outer border
    pdf.rect(margin, y - (stats.length * 7 + 8), pageWidth - margin * 2, stats.length * 7 + 8, 'S');
    
    y += 15;
    
    // Most Common Violations
    if (data.mostCommonViolations && data.mostCommonViolations.length > 0) {
      pdf.setFontSize(14);
      pdf.text('Most Common Violations', margin, y);
      y += 8;
      
      // Table headers
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      
      // Header background
      pdf.setFillColor(230, 230, 230);
      pdf.rect(margin, y, pageWidth - margin * 2, 8, 'F');
      
      const violationColWidths = [(pageWidth - margin * 2) * 0.5, (pageWidth - margin * 2) * 0.25, (pageWidth - margin * 2) * 0.25];
      pdf.text('Violation Type', margin + cellPadding, y + 5.5);
      pdf.text('Count', margin + violationColWidths[0] + cellPadding, y + 5.5);
      pdf.text('Revenue', margin + violationColWidths[0] + violationColWidths[1] + cellPadding, y + 5.5);
      y += 8;
      
      // Table data
      pdf.setFont('helvetica', 'normal');
      data.mostCommonViolations.forEach((violation, i) => {
        if (i % 2 === 0) {
          pdf.setFillColor(248, 248, 248);
          pdf.rect(margin, y, pageWidth - margin * 2, 7, 'F');
        }
        
        pdf.text(violation.violationType, margin + cellPadding, y + 5);
        pdf.text(violation.count.toString(), margin + violationColWidths[0] + cellPadding, y + 5);
        pdf.text(formatCurrency(violation.totalRevenue), margin + violationColWidths[0] + violationColWidths[1] + cellPadding, y + 5);
        y += 7;
      });
      
      // Draw outer border
      pdf.rect(margin, y - (data.mostCommonViolations.length * 7 + 8), pageWidth - margin * 2, data.mostCommonViolations.length * 7 + 8, 'S');
      
      y += 15;
    }
    
    // Top Offenders - if we still have space on the page
    if (y + 50 > pdf.internal.pageSize.getHeight()) {
      pdf.addPage();
      y = margin;
    }
    
    if (data.topOffenders && data.topOffenders.length > 0) {
      pdf.setFontSize(14);
      pdf.text('Top Offenders', margin, y);
      y += 8;
      
      // Create a simplified table for top offenders
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      
      // Header background
      pdf.setFillColor(230, 230, 230);
      pdf.rect(margin, y, pageWidth - margin * 2, 8, 'F');
      
      // We'll only show a subset of columns to fit on the page
      const offenderColWidths = [(pageWidth - margin * 2) * 0.4, (pageWidth - margin * 2) * 0.2, (pageWidth - margin * 2) * 0.2, (pageWidth - margin * 2) * 0.2];
      pdf.text('Name', margin + cellPadding, y + 5.5);
      pdf.text('Tickets', margin + offenderColWidths[0] + cellPadding, y + 5.5);
      pdf.text('Total Fines', margin + offenderColWidths[0] + offenderColWidths[1] + cellPadding, y + 5.5);
      pdf.text('Unpaid', margin + offenderColWidths[0] + offenderColWidths[1] + offenderColWidths[2] + cellPadding, y + 5.5);
      y += 8;
      
      // Table data - limit to first 5 offenders to save space
      pdf.setFont('helvetica', 'normal');
      const topOffendersToShow = data.topOffenders.slice(0, 5);
      topOffendersToShow.forEach((offender, i) => {
        if (i % 2 === 0) {
          pdf.setFillColor(248, 248, 248);
          pdf.rect(margin, y, pageWidth - margin * 2, 7, 'F');
        }
        
        pdf.text(offender.fullName || 'Unknown User', margin + cellPadding, y + 5);
        pdf.text(offender.ticketCount.toString(), margin + offenderColWidths[0] + cellPadding, y + 5);
        pdf.text(formatCurrency(offender.totalFines), margin + offenderColWidths[0] + offenderColWidths[1] + cellPadding, y + 5);
        pdf.text(`${offender.unpaidCount} (${formatCurrency(offender.unpaidAmount)})`, 
          margin + offenderColWidths[0] + offenderColWidths[1] + offenderColWidths[2] + cellPadding, y + 5);
        y += 7;
      });
      
      // Draw outer border
      pdf.rect(margin, y - (topOffendersToShow.length * 7 + 8), pageWidth - margin * 2, topOffendersToShow.length * 7 + 8, 'S');
      
      y += 15;
    }
    
    // Add footer
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text('Generated by Traffic Enforcement System', pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });
    
    // If there are multiple pages, add page numbers to all pages
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pdf.internal.pageSize.getHeight() - 10);
    }
    
    // Save the PDF
    pdf.save('traffic_dashboard_report.pdf');
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("There was an error generating the PDF: " + error);
  } finally {
    // Reset button regardless of success or failure
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.textContent = "📥 Export Data";
      exportBtn.removeAttribute('disabled');
    }
  }
}



</script>

<!-- HTML part remains mostly the same, just updating the canvas references -->
<nav class="!bg-emerald-500 shadow-lg fixed w-full top-0 z-50">
<!-- Navigation HTML remains unchanged -->
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
<p class="mt-20"></p>

<div class="container mx-auto p-6 mt-5">
<div class="max-w-7xl mx-auto">
  <!-- Header -->
  <div class="flex flex-wrap justify-between items-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-lg shadow-lg">    <h1 class="text-3xl font-bold text-white">🚦 Traffic Enforcement Dashboard</h1>
    
    <div class="flex flex-wrap gap-4 items-center mt-4 md:mt-0">
      <!-- Date Range Picker -->
      <form class="flex gap-2 items-center" on:submit|preventDefault={updateDateRange}>
        <div>
          <label for="startDate" class="block text-sm text-white">Start Date</label>
          <input 
            type="date" 
            id="startDate" 
            bind:value={startDate} 
            class="border rounded p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 bg-white text-black"
          />
        </div>
        <div>
          <label for="endDate" class="block text-sm text-white">End Date</label>
          <input 
            type="date" 
            id="endDate" 
            bind:value={endDate} 
            class="border rounded p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 bg-white text-black"
          />
        </div>
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm mt-5 transition">
          Apply
        </button>
      </form>
      
      <!-- Export Button -->
      <button 
      id="exportBtn"
      on:click={exportToPDF}
      class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition mt-6 disabled:opacity-70 disabled:cursor-not-allowed">
      📥 Export Data
    </button>
    </div>
  </div>

  <!-- Stat Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
    {#each [
      { title: "Total Tickets", value: data.stats.totalTickets, bg: "bg-gray-900 text-white" },
      { title: "Paid Tickets", value: data.stats.paidTickets, bg: "bg-green-600 text-white", percentage: Math.round((data.stats.paidTickets / data.stats.totalTickets) * 100) || 0 },
      { title: "Unpaid Tickets", value: data.stats.unpaidTickets, bg: "bg-yellow-500 text-black", percentage: Math.round((data.stats.unpaidTickets / data.stats.totalTickets) * 100) || 0 },
      { title: "Total Collected", value: formatCurrency(data.stats.totalCollected), bg: "bg-blue-600 text-white" },
      { title: "Average Fine", value: formatCurrency(data.stats.averageFine), bg: "bg-indigo-600 text-white" }
    ] as stat}
      <div class="{stat.bg} rounded-lg shadow-md p-6 border border-gray-300">
        <h3 class="text-sm font-medium opacity-80">{stat.title}</h3>
        <p class="text-3xl font-bold">{stat.value}</p>
        {#if stat.percentage !== undefined}
          <p class="text-sm opacity-80 mt-1">{stat.percentage}% of total</p>
        {/if}
      </div>
    {/each}
</div>
  
  <!-- Charts Section - Updated with bind:this to get references -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
    <div class="bg-gradient-to-r from-blue-200 to-indigo-600 text-white rounded-lg shadow-lg p-6 border border-blue-500">
      <h3 class="text-xl font-semibold mb-4">📊 Ticket Trend</h3>
      <div class="h-72 !text-black">
        <canvas bind:this={ticketTrendCanvas}></canvas>
      </div>
    </div>
    <div class="bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg shadow-lg p-6 border border-green-500">
      <h3 class="text-xl font-semibold mb-4">🔍 Most Common Violations</h3>
      <div class="h-72">
        <canvas bind:this={violationTypeCanvas}></canvas>
      </div>
    </div>
</div>

<!-- Status Chart & Top Offenders -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
    <div class="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-lg p-6 border border-purple-500">
      <h3 class="text-xl font-semibold mb-4">💳 Payment Status</h3>
      <div class="h-64">
        <canvas bind:this={statusDistributionCanvas}></canvas>
      </div>
    </div>
    
    <div class="bg-gray-900 text-white rounded-lg shadow-lg p-6 border border-gray-700 lg:col-span-2">
      <h3 class="text-xl font-semibold mb-4">🚨 Top Offenders</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {#each ["Name", "Tickets", "Total Fines", "Unpaid"] as header}
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{header}</th>
              {/each}
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            {#each data.topOffenders as offender}
              <tr class="even:bg-gray-800">
                <td class="px-6 py-4 text-sm font-medium">{offender.fullName || 'Unknown User'}</td>
                <td class="px-6 py-4 text-sm">{offender.ticketCount}</td>
                <td class="px-6 py-4 text-sm">{formatCurrency(offender.totalFines)}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full {offender.unpaidCount > 0 ? 'bg-yellow-300 text-yellow-900' : 'bg-green-300 text-green-900'}">
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
  <div class="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-lg p-6 border border-gray-300">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-semibold text-gray-800 flex items-center gap-2">📋 Recent Tickets</h3>
      <a href="/tickets" class="text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition-colors">View All</a>
    </div>
  
    <div class="overflow-x-auto rounded-lg shadow-sm">
      <table class="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200">
          <tr>
            {#each ["ID", "Date", "License Plate", "Violation", "Fine", "Status", "User"] as header}
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">{header}</th>
            {/each}
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-300">
          {#each data.recentTickets as { ticket, user }}
            <tr class="even:bg-gray-100 hover:bg-gray-200 transition">
              <td class="px-6 py-4 text-sm font-medium text-indigo-600">
                <a href={`/tickets/${ticket.id}`} class="hover:underline">#{ticket.id}</a>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">{formatDate(ticket.dateIssued)}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{ticket.licensePlate}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{ticket.violationType}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{formatCurrency(ticket.fineAmount)}</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 text-2xs font-semibold rounded-full text-yellow-600">
                {ticket.status}
            </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">{user?.fullName || 'Unknown'}</td>
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