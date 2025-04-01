<script>
    import "./app.css";
</script>

<div class="min-h-screen bg-gray-50">
    <nav class="bg-gray-800 text-white shadow-md">
        <div class="container mx-auto px-6 py-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <a href="/" class="text-xl font-bold">Traffic Enforcement</a>
                </div>
                <div class="hidden md:flex space-x-6">
                    <a href="/" class="hover:text-blue-300 transition-colors">Home</a>
                    <a href="/tickets" class="hover:text-blue-300 transition-colors">Tickets</a>
                    <a href="/dashboard" class="hover:text-blue-300 transition-colors">Dashboard</a>
                    <a href="/reports" class="hover:text-blue-300 transition-colors">Reports</a>
                </div>
                <div>
                    <button class="md:hidden focus:outline-none">
                        <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
                            <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <!-- Mobile menu, toggle classes based on menu state -->
            <div class="md:hidden hidden">
                <div class="px-2 pt-2 pb-3 space-y-1">
                    <a href="/" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Home</a>
                    <a href="/tickets" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Tickets</a>
                    <a href="/dashboard" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Dashboard</a>
                    <a href="/reports" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Reports</a>
                </div>
            </div>
        </div>
    </nav>
    
    <main>
        <slot />
    </main>
    
    <footer class="bg-gray-800 text-white py-6 mt-12">
        <div class="container mx-auto px-6">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="mb-4 md:mb-0">
                    <p>&copy; 2025 Traffic Enforcement System. All rights reserved.</p>
                </div>
                <div class="flex space-x-4">
                    <a href="/about" class="hover:text-blue-300 transition-colors">About</a>
                    <a href="/privacy" class="hover:text-blue-300 transition-colors">Privacy</a>
                    <a href="/terms" class="hover:text-blue-300 transition-colors">Terms</a>
                    <a href="/contact" class="hover:text-blue-300 transition-colors">Contact</a>
                </div>
            </div>
        </div>
    </footer>
</div>