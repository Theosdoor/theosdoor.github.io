const emailButtons = new WeakSet<HTMLButtonElement>();

function setTooltipState(tooltip: Element | null, text: string | null, visible: boolean) {
  if (!tooltip) return;
  if (text) tooltip.textContent = text;
  tooltip.classList.toggle('opacity-0', !visible);
  tooltip.classList.toggle('scale-95', !visible);
  tooltip.classList.toggle('opacity-100', visible);
  tooltip.classList.toggle('scale-100', visible);
}

function setupEmailButton(button: HTMLButtonElement) {
  if (emailButtons.has(button)) return;
  emailButtons.add(button);

  const { emailUser, emailDomain } = button.dataset;
  if (!emailUser || !emailDomain) return;

  const email = `${emailUser}@${emailDomain}`;
  const tooltip = button.querySelector('.js-tooltip');
  let tooltipTimeout: ReturnType<typeof setTimeout> | null = null;

  const clearTooltipTimeout = () => {
    if (!tooltipTimeout) return;
    clearTimeout(tooltipTimeout);
    tooltipTimeout = null;
  };

  const showTooltip = (text = 'Click to copy email') => setTooltipState(tooltip, text, true);
  const hideTooltip = () => setTooltipState(tooltip, null, false);

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      showTooltip('Copied!');
      clearTooltipTimeout();
      tooltipTimeout = setTimeout(() => {
        showTooltip();
        tooltipTimeout = setTimeout(hideTooltip, 1000);
      }, 1500);
    } catch (error) {
      console.error('Failed to copy email:', error);
      window.location.href = `${'mailto'}:${email}`;
    }
  });

  button.addEventListener('mouseenter', () => showTooltip());
  button.addEventListener('mouseleave', () => {
    clearTooltipTimeout();
    hideTooltip();
  });
  button.addEventListener('focus', () => showTooltip());
  button.addEventListener('blur', () => {
    clearTooltipTimeout();
    hideTooltip();
  });
}

function setupEmailCopyButtons() {
  document.querySelectorAll<HTMLButtonElement>('.js-email-btn').forEach(setupEmailButton);
}

setupEmailCopyButtons();
document.addEventListener('astro:page-load', setupEmailCopyButtons);
