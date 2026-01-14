class MyFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="footer" id="footerMenu">
            <div class="footer-content">
                <p class="footer-text">
                    code: <a href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.html#SEC1"><img class="footer-icon" src="../assets/img/icons/gnuTranspSmall.png" alt="GNU icon">GPL-2 license</a><br>
                    © 2022-2026 Copyright: Open-Meteo.com
                </p>
            </div>
        </footer>
        `;
    }
}

customElements.define('my-custom-footer', MyFooter);