/* Progressive enhancements for the static research page. */
(() => {
  const tabs = [...document.querySelectorAll('[data-result-tab]')];
  const panels = [...document.querySelectorAll('[data-result-panel]')];
  const tabList = document.querySelector('.results-tabs');
  if (tabs.length && tabList) {
    tabList.setAttribute('role', 'tablist');
    const activate = (name, focus = false) => {
      tabs.forEach(tab => {
        const selected = tab.dataset.resultTab === name;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (selected && focus) tab.focus();
      });
      panels.forEach(panel => {
        panel.hidden = panel.dataset.resultPanel !== name;
        panel.setAttribute('role', 'tabpanel');
        const tab = tabs.find(item => item.dataset.resultTab === panel.dataset.resultPanel);
        if (tab) {
          tab.id = `tab-${tab.dataset.resultTab}`;
          panel.setAttribute('aria-labelledby', tab.id);
        }
      });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab.dataset.resultTab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) {
          event.preventDefault();
          activate(tabs[next].dataset.resultTab, true);
        }
      });
    });
    activate('math');
  }
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
