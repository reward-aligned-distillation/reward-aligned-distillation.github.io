/* Progressive enhancements for the static research page. */
(() => {
  const copyButton = document.getElementById('copy-citation');
  const citation = document.getElementById('bibtex');
  if (copyButton && citation) {
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(citation.textContent.trim());
        copyButton.textContent = 'Copied';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(citation);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        copyButton.textContent = 'Text selected — copy';
      }
      window.setTimeout(() => { copyButton.textContent = 'Copy BibTeX'; }, 2500);
    });
  }
})();
