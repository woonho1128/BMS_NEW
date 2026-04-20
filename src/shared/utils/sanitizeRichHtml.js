const ALLOWED_TAGS = new Set([
  'a',
  'b',
  'blockquote',
  'br',
  'code',
  'div',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  'span',
  'strong',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
]);

const ALLOWED_ATTRS = new Set([
  'alt',
  'border',
  'cellpadding',
  'cellspacing',
  'colspan',
  'href',
  'rel',
  'rowspan',
  'src',
  'target',
  'title',
]);

function isSafeUrl(value) {
  if (!value) return false;
  const url = String(value).trim().toLowerCase();
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../') || url.startsWith('#')) {
    return true;
  }
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:')) {
    return true;
  }
  return /^data:image\/(png|jpeg|jpg|gif|webp);base64,[a-z0-9+/=]+$/i.test(url);
}

function walkAndSanitize(root) {
  const nodes = Array.from(root.childNodes);
  for (const node of nodes) {
    if (node.nodeType === Node.COMMENT_NODE) {
      node.remove();
      continue;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();

      if (!ALLOWED_TAGS.has(tag)) {
        const fragment = document.createDocumentFragment();
        while (node.firstChild) fragment.appendChild(node.firstChild);
        node.replaceWith(fragment);
        walkAndSanitize(fragment);
        continue;
      }

      const attrs = Array.from(node.attributes);
      for (const attr of attrs) {
        const name = attr.name.toLowerCase();
        const value = attr.value;

        if (name.startsWith('on') || !ALLOWED_ATTRS.has(name)) {
          node.removeAttribute(attr.name);
          continue;
        }

        if ((name === 'href' || name === 'src') && !isSafeUrl(value)) {
          node.removeAttribute(attr.name);
          continue;
        }
      }

      if (tag === 'a') {
        const target = node.getAttribute('target');
        if (target === '_blank') {
          node.setAttribute('rel', 'noopener noreferrer');
        }
      }

      walkAndSanitize(node);
    }
  }
}

export function sanitizeRichHtml(html) {
  const input = String(html || '');
  if (!input) return '';

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return input.replace(/[<>&'"]/g, (ch) => {
      switch (ch) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case "'":
          return '&#39;';
        default:
          return '&quot;';
      }
    });
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');
  walkAndSanitize(doc.body);
  return doc.body.innerHTML;
}
