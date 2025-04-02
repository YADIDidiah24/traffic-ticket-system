<script lang="ts">
    import "../app.css";
    import { page } from "$app/stores";

    let darkMode = false;
    let mobileMenuOpen = false;

    function toggleDarkMode() {
        darkMode = !darkMode;
        document.documentElement.classList.toggle("dark", darkMode);
    }
    
    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:text-slate-200 flex flex-col">
    <nav class="bg-emerald-500 shadow-lg w-full z-50">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/" class="flex items-center">
                <img src="/logo.png" alt="TrafficFlow Logo" class="h-8 w-8 mr-2" />
                <span class="text-2xl font-semibold tracking-wide text-white">TrafficFlow</span>
            </a>
            <div class="hidden md:flex space-x-6">
                <a href="/" class="text-white hover:text-cyan-300 transition-colors font-medium">Home</a>
                <a href="/tickets" class="text-white hover:text-cyan-300 transition-colors font-medium">Tickets</a>
                <a href="/dashboard" class="text-white hover:text-cyan-300 transition-colors font-medium">Dashboard</a>
                <a href="/users" class="text-white hover:text-cyan-300 transition-colors font-medium">Users</a>
            </div>
            <button class="md:hidden focus:outline-none" on:click={toggleMobileMenu} aria-label="Toggle mobile menu">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
            </button>
        </div>
        
        {#if mobileMenuOpen}
        <div class="md:hidden bg-emerald-600 py-2 px-4">
            <a href="/" class="block py-2 text-white hover:text-cyan-300">Home</a>
            <a href="/tickets" class="block py-2 text-white hover:text-cyan-300">Tickets</a>
            <a href="/dashboard" class="block py-2 text-white hover:text-cyan-300">Dashboard</a>
            <a href="/users" class="block py-2 text-white hover:text-cyan-300">Users</a>
        </div>
        {/if}
    </nav>

    <slot />
    
    <footer class="bg-emerald-500 text-white py-6 mt-auto">
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