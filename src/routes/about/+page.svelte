<script lang="ts">
    import "../../app.css";
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
<div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:text-slate-200">
    <main class="container mx-auto px-6 pt-16 pb-12 flex-grow">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-4xl font-bold text-emerald-700 dark:text-emerald-300 mb-8">About TrafficFlow</h1>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <p class="mb-4">TrafficFlow is a comprehensive traffic management system designed to streamline ticket processing and enforcement.</p>
                
                <p class="mb-4">Our platform helps municipalities manage violations efficiently while providing citizens with easy ways to resolve tickets.</p>
                
                <p>Built with modern technology, TrafficFlow improves traffic management for communities of all sizes.</p>
            </div>
        </div>
    </main>
    
    <footer class="bg-emerald-500 text-white py-6">
        <div class="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p>&copy; 2025 TrafficFlow System</p>
            <div class="flex space-x-6 mt-4 md:mt-0">
                <a href="/about" class="text-white hover:text-cyan-300">About</a>
                <a href="/privacy" class="text-white hover:text-cyan-300">Privacy</a>
                <a href="/terms" class="text-white hover:text-cyan-300">Terms</a>
                <a href="/contact" class="text-white hover:text-cyan-300">Contact</a>
            </div>
        </div>
    </footer>
</div>