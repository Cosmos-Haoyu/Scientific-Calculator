# Scientific Web Calculator

A portable, static scientific calculator implemented in HTML/CSS/JavaScript. Intended for hosting on GitHub Pages.

Features
- Basic arithmetic (+ − × ÷)
- Scientific functions: sin, cos, tan, asin, acos, atan, ln, log10, exp, sqrt, x^y, factorial
- Degrees toggle (checkbox labelled "Degrees")
- Keyboard support (numbers, ., Enter, Backspace, + - * /)
- Ans memory

How to run locally
1. Open `index.html` in your browser.
2. Or run a simple local server (recommended for proper path handling):

   python3 -m http.server 8000

Then visit http://localhost:8000 in your browser.

Deploy to GitHub Pages
1. Create a new repository on GitHub.
2. Commit and push all files in this folder to the repository root.
3. In the repository Settings -> Pages, set the Source to the main branch root and save.
4. Your site will be available at `https://<your-username>.github.io/<repo-name>/`.

Notes & limitations
- This is a lightweight implementation. Complex expression parsing (implicit multiplication, operator precedence edge-cases) is handled by using JavaScript evaluation with a sanitized transformation. Use carefully.
- Trigonometric functions respect the "Degrees" toggle. When checked, inputs are interpreted as degrees.

License
MIT
