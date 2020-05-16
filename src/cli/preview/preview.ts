import markdown from '../../shared/markdown-interpreter';

window.onload = () => {
    const source = new EventSource('/content');

    const contentHTML = document.getElementById('main-content');

    source.onmessage = (e) => {
        contentHTML.innerHTML = markdown.makeHtml(e.data.replace(/\|n/g, '\n'));
    };

}