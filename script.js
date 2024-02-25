document.addEventListener('DOMContentLoaded', init);

function init() {
    setInitialTheme();
    loadXML();
    handleScroll();
}

function setInitialTheme() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    document.body.setAttribute('data-theme', prefersDarkScheme.matches ? 'dark' : 'light');
    prefersDarkScheme.addEventListener('change', (e) => {
        document.body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });
}

function toggleDarkMode() {
    const body = document.body;
    const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    updateDarkModeButtonText();
}

function updateDarkModeButtonText() {
    const button = document.getElementById('toggleDarkMode');
    button.textContent = document.body.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark';
}

async function loadXML() {
    try {
        const response = await fetch('links.xml');
        if (!response.ok) throw new Error('Network response was not ok');
        const xml = await response.text();
        const xmlDoc = new DOMParser().parseFromString(xml, "text/xml");
        displayLinks(xmlDoc);
    } catch (error) {
        console.error('Error fetching XML:', error);
    }
}

function displayLinks(xml) {
    const container = document.getElementById("linksContainer");
    const links = xml.getElementsByTagName("link");
    container.innerHTML = Array.from(links).reverse().map(link => createLinkHTML(link)).join('');
}

function createLinkHTML(link) {
    const url = sanitize(link.getElementsByTagName("url")[0].textContent);
    const title = sanitize(link.getElementsByTagName("title")[0].textContent);
    const description = link.getElementsByTagName("description")[0] ? sanitize(link.getElementsByTagName("description")[0].textContent) : '';
    const tags = link.getElementsByTagName("tag")[0].textContent.split(',').map(tag => `<span class="tag">${sanitize(tag.trim())}</span>`).join(' ');

    return `
        <div class="link">
            <h2 class="title"><a href="${url}" class="title-link" target="_blank" rel="noopener noreferrer">${title}</a></h2>
            ${description ? `<p class="description">${description}</p>` : ''}
            <div class="tags">${tags}</div>
        </div>`;
}

function sanitize(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function handleScroll() {
   let lastScrollTop = 0;
   window.addEventListener("scroll", function() {
       let currentScroll = window.scrollY || document.documentElement.scrollTop;
       if (currentScroll > lastScrollTop) {
           // Downscroll Code
           document.getElementById("pageHeader").style.top = "-60px"; // Adjust based on your header's height
       } else {
           // Upscroll Code
           document.getElementById("pageHeader").style.top = "0";
       }
       lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For mobile or negative scrolling
   }, false);
}
