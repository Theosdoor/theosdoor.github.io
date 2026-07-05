import { defineToolbarApp } from 'astro/toolbar';

export default defineToolbarApp({
  init(canvas, app, server) {
    const container = document.createElement('astro-dev-toolbar-window');
    
    const style = document.createElement('style');
    style.textContent = `
      .debug-container {
        padding: 16px;
        font-family: system-ui, -apple-system, sans-serif;
        display: flex;
        flex-direction: column;
        gap: 12px;
        color: #f3f4f6;
        background: #18181b;
        border-radius: 12px;
        border: 1px solid #27272a;
        min-width: 200px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
      }
      .debug-header {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #71717a;
        margin-bottom: 4px;
      }
      .debug-row {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        user-select: none;
      }
      .debug-checkbox {
        cursor: pointer;
        width: 16px;
        height: 16px;
        accent-color: #7d3c52; /* Burgundy theme accent */
      }
      .debug-label {
        font-size: 13px;
        font-weight: 500;
      }
    `;
    canvas.append(style);

    const content = document.createElement('div');
    content.className = 'debug-container';
    content.innerHTML = `
      <div class="debug-header">Skills Developer Options</div>
      <label class="debug-row">
        <input type="checkbox" id="dev-toggle-tags" class="debug-checkbox" />
        <span class="debug-label">Show Tags (Devonly)</span>
      </label>
    `;
    container.append(content);
    canvas.append(container);

    const checkbox = content.querySelector('#dev-toggle-tags') as HTMLInputElement | null;
    if (checkbox) {
      // Sync state with DOM
      const syncCheckboxState = () => {
        const pageContainer = document.getElementById('skills-container');
        if (pageContainer) {
          checkbox.checked = pageContainer.classList.contains('show-tags');
        }
      };

      // Initial sync
      syncCheckboxState();

      // Checkbox change listener
      checkbox.addEventListener('change', () => {
        const pageContainer = document.getElementById('skills-container');
        if (pageContainer) {
          if (checkbox.checked) {
            pageContainer.classList.add('show-tags');
          } else {
            pageContainer.classList.remove('show-tags');
          }
        }
      });

      // Recalculate if document changes or focus returned
      window.addEventListener('focus', syncCheckboxState);
    }
  }
});
