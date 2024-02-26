document.addEventListener('DOMContentLoaded', init);

function init() {
    setInitialTheme();
    attachThemeChangeListener();
    loadXML().catch(console.error);
    setupScrollHandling();
}

function setInitialTheme() {
    const theme = getCurrentTheme();
    document.body.setAttribute('data-theme', theme);
}

function getCurrentTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
}

function attachThemeChangeListener() {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', e => {
        const newTheme = e.matches ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        updateDarkModeButtonText();
    });
}

function toggleDarkMode() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    updateDarkModeButtonText();
}

function updateDarkModeButtonText() {
    const button = document.getElementById('toggleDarkMode');
    if (button) {
        button.textContent = document.body.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark';
    }
}

async function loadXML() {
    const response = await fetch('links.xml');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const xml = await response.text();
    const xmlDoc = new DOMParser().parseFromString(xml, "text/xml");
    displayLinks(xmlDoc);
}

function displayLinks(xml) {
    const container = document.getElementById("linksContainer");
    if (container) {
        const links = xml.getElementsByTagName("link");
        container.innerHTML = Array.from(links).reverse().map(link => createLinkHTML(link)).join('');
    }
}

function createLinkHTML(link) {
    const url = sanitize(link.getElementsByTagName("url")[0].textContent);
    const title = sanitize(link.getElementsByTagName("title")[0].textContent);
    const description = link.getElementsByTagName("description")[0] ? sanitize(link.getElementsByTagName("description")[0].textContent) : '';
    const tagsHTML = createTagsHTML(link.getElementsByTagName("tag"));

    return `
        <div class="link">
            <h2 class="title"><a href="${url}" class="title-link" target="_blank" rel="noopener noreferrer">${title}</a></h2>
            ${description ? `<p class="description">${description}</p>` : ''}
            <div class="tags">${tagsHTML}</div>
        </div>`;
}

function createTagsHTML(tags) {
    return Array.from(tags).map(tag => `<span class="tag">${sanitize(tag.textContent.trim())}</span>`).join(' ');
}

function sanitize(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

function setupScrollHandling() {
    let lastScrollTop = 0;
    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const pageHeader = document.getElementById("pageHeader");
        if (pageHeader) {
            pageHeader.style.top = currentScroll > lastScrollTop ? "-60px" : "0";
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, false);
}
