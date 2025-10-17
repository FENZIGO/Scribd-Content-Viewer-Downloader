// ==UserScript==
// @name        Scribd Content Viewer/Downloader
// @namespace   Violentmonkey Scripts
// @match       *://www.scribd.com/*
// @grant       none
// @version     1.02
// @author      FENZIGO
// @description View or export scribd docs content for free
// @license MIT
// ==/UserScript==

(function() {
  'use strict';

  const currentUrl = window.location.href;
  if (currentUrl.includes("scribd.com/document") || currentUrl.includes("scribd.com/doc") || currentUrl.includes("scribd.com/presentation")) {
    localStorage.setItem('originalUrl', currentUrl);
  }

  function redirectToEmbed() {
    const currentUrl = window.location.href;
    localStorage.setItem('originalUrl', currentUrl);

    const regex = /https:\/\/www\.scribd\.com\/[^/]+\/([^/]+)\/[^/]+/;
    const match = currentUrl.match(regex);

    if (match) {
      const newUrl = `https://www.scribd.com/embeds/${match[1]}/content`;
      window.location.href = newUrl;
    } else {
      alert("Refresh page.");
    }
  }

  function downloadContent() {
    const contentElements = document.querySelectorAll('.text_layer .a');
    let content = '';

    contentElements.forEach(element => {
      content += element.textContent + '\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scribd_content.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function downloadContentAsPDF() {
    let savedUrl = localStorage.getItem('originalUrl');
    if (!savedUrl) savedUrl = window.location.href;

    const regex = /https:\/\/www\.scribd\.com\/[^/]+\/(\d+)\/([^/?#]+)/;
    const match = savedUrl.match(regex);

     if (match) {
      const [_, id, title] = match;
      const newUrl = `https://compress-pdf.vietdreamhouse.com/?fileurl=https://scribd.downloader.tips/pdownload/${id}/${title}`;
      try {
        window.location.href = newUrl;
      } catch (e) {
        alert('PDF download failed. Third party download site might me down. Try again later or manually on "https://scribd.downloader.tips".');
      }
    } else {
      alert('Invalid URL pattern.');
    }
  }

  function makeButton(label, top, color, onClick) {
    const btn = document.createElement('button');
    btn.textContent = label;
    Object.assign(btn.style, {
      position: 'fixed',
      top: top + 'px',
      right: '10px',
      zIndex: 1000,
      padding: '10px',
      backgroundColor: color,
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    });
    btn.addEventListener('click', onClick);
    document.body.appendChild(btn);
  }

  makeButton('View Full', 10, '#4CAF50', redirectToEmbed);
  makeButton('Download (TXT)', 50, '#007BFF', downloadContent);
  makeButton('Download (PDF)', 90, '#FF5733', downloadContentAsPDF);
})();
