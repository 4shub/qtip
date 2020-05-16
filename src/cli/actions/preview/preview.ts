import markdown from '../../../shared/markdown-interpreter';

const BASE_URL = 'http://localhost:5002';

const listenToPreviewChanges = () => {
    const source = new EventSource(`${BASE_URL}/content`);

    const contentHTML = document.getElementById('main-content');

    source.onmessage = (e) => {
        contentHTML.innerHTML = markdown.makeHtml(e.data.replace(/\|n/g, '\n'));
    };
};

const getPublishButtonHTML = () => document.getElementById('publish');

const publishChanges = async () => {
    const bannerHTML = document.getElementById('publish-alert-banner');

    const resetBanner = () => {
        bannerHTML.className = 'publish-alert-banner';
    }

    getPublishButtonHTML().innerHTML = 'Publishing...';

    resetBanner();

    const { ok }  = await fetch(`${BASE_URL}/publish`, { method: 'POST' }).catch(() =>
        Promise.resolve({ status: false })
    );

    getPublishButtonHTML().innerHTML = 'Publish';

    if (!ok) {
        bannerHTML.classList.add('publish-alert-banner__fail');

        bannerHTML.innerHTML =
            'There was an error in publishing, check your commandline tool for more details!';
        return;
    }

    bannerHTML.classList.add('publish-alert-banner__success');
    bannerHTML.innerHTML = `Successfully published on ${new Date().toLocaleString()}`;

    setTimeout(() => {
        resetBanner();
    }, 2000);
};

const initPublishChanges = () => {
    getPublishButtonHTML()
        .addEventListener('click', publishChanges);
};

window.onload = () => {
    listenToPreviewChanges();
    initPublishChanges();
};
