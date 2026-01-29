<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Page with Skip Link</title>
        <style>
            .skip-link {
                position: absolute;
                top: -40px;
                left: 0;
            }
            .skip-link:focus {
                top: 0;
            }
        </style>
    </head>
    <body>
        <script>
            function toggleMenu() {
                const button = document.querySelector('button[aria-expanded]');
                const expanded = button.getAttribute('aria-expanded') === 'true' || false;
                button.setAttribute('aria-expanded', !expanded);
            }
        </script>
        <a href="#main-content" class="skip-link">Skip to main content</a>

        <header>
            <nav>
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/services">Services</a>
                <a href="/portfolio">Portfolio</a>
                <a href="/contact">Contact</a>
            </nav>
        </header>

        <main id="main-content" tabindex="-1">
            <h1>Welcome to Our Site</h1>
            <p>Main content starts here...</p>

        </main>
    </body>
</html>
