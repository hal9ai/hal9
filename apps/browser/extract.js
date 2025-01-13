() => {
  function isFocusable(element) {
    // Elements with tabindex="-1" are not focusable via tab key
    const tabindex = element.getAttribute('tabindex');
    
    if (tabindex !== null && parseInt(tabindex) >= 0) {
      return true;
    }
    
    // Check for naturally focusable elements (without tabindex)
    const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'IFRAME', 'AREA', 'SUMMARY'];
    
    if (focusableTags.includes(element.tagName) && !element.disabled) {
      return true;
    }
    
    // Check for contenteditable elements
    if (element.hasAttribute('contenteditable')) {
      return true;
    }
    
    return false;
  }

  // Function to generate a unique CSS selector for an element
  function generateSelector(element, levels) {
    if (element.id) {
      return `${element.tagName.toLowerCase()}#${element.id}`;
    } else {
      let path = [];
      
      // Consider only the current element and its parent
      let currentElement = element;
      for (let i = 0; i < (levels ?? 2) && currentElement && currentElement.nodeType === Node.ELEMENT_NODE; i++) {
        let selector = currentElement.tagName.toLowerCase();
        
        if (currentElement.className) {
          selector += '.' + currentElement.className.trim().split(/\s+/).map(e => {
            return e.replace(/([:.[\]#,+~*'"()\\\/=])/g, '\\$1');
          }).join('.');
        }
        
        path.unshift(selector);
        currentElement = currentElement.parentNode;  // Move to parent node
      }
      
      return path.join(' > ');
    }
  }

  // Function to retrieve text associated with an element
  function getElementText(el) {
    let text = '';

    // Try innerText
    if (el.innerText && el.innerText.trim()) {
      text = el.innerText.trim();
    }

    // Try value (for input elements)
    if (!text && el.value && el.value.trim()) {
      text = el.value.trim();
    }

    // Try aria-label
    if (!text && el.getAttribute('aria-label')) {
      text = el.getAttribute('aria-label').trim();
    }

    // Try alt attribute (for images and areas)
    if (!text && el.getAttribute('alt')) {
      text = el.getAttribute('alt').trim();
    }

    // Try title attribute
    if (!text && el.getAttribute('title')) {
      text = el.getAttribute('title').trim();
    }

    // Try associated <label> element (for input elements with id)
    if (!text && el.tagName === 'INPUT' && el.id) {
      const label = document.querySelector(`label[for="${el.id}"]`);
      if (label && label.innerText && label.innerText.trim()) {
        text = label.innerText.trim();
      }
    }

    // Try parent <label> element (for inputs wrapped in labels)
    if (!text) {
      let parent = el.parentElement;
      while (parent) {
        if (parent.tagName === 'LABEL') {
          if (parent.innerText && parent.innerText.trim()) {
            text = parent.innerText.trim();
            break;
          }
        }
        parent = parent.parentElement;
      }
    }

    return text;
  }

  // Get all elements in the document
  const allElements = document.querySelectorAll('*');

  // Filter the elements to find those that are focusable
  const tabOrderedElements = Array.from(allElements).filter(isFocusable);

  // Sort elements by their tab index value (defaulting to 0 if no tabindex is specified)
  tabOrderedElements.sort((a, b) => {
    const tabindexA = a.getAttribute('tabindex') !== null ? parseInt(a.getAttribute('tabindex')) : 0;
    const tabindexB = b.getAttribute('tabindex') !== null ? parseInt(b.getAttribute('tabindex')) : 0;
    return tabindexA - tabindexB;
  });

  // Collect the results into an array of dictionaries
  const result = tabOrderedElements.map((el) => {
    const tabindex = el.getAttribute('tabindex') !== null ? el.getAttribute('tabindex') : '0';
    const query = generateSelector(el);
    const text = getElementText(el);

    return {
      query: query,
      text: text
    };
  });

  // Output the result
  return result.filter(e => e.text.trim() !== "");
}