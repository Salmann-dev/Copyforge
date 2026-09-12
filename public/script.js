document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('generator-form');
  const generateBtn = document.getElementById('generate-btn');
  const errorMessage = document.getElementById('error-message');
  const outputEmpty = document.getElementById('output-empty');
  const outputResult = document.getElementById('output-result');
  const outputText = document.getElementById('output-text');
  const copyBtn = document.getElementById('copy-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const platformField = document.getElementById('platform-field');
  const contentTypeRadios = document.querySelectorAll('input[name="contentType"]');

  // Toggle platform selector only for social posts
  contentTypeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      platformField.style.display = radio.value === 'social_post' && radio.checked ? 'block' : 'none';
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const brandVoice = document.getElementById('brand-voice').value.trim();
    const productInfo = document.getElementById('product-info').value.trim();
    const contentType = document.querySelector('input[name="contentType"]:checked').value;
    const platform = document.getElementById('platform').value;

    errorMessage.classList.remove('visible');
    errorMessage.textContent = '';

    if (!brandVoice || !productInfo) {
      errorMessage.textContent = 'Please fill in both the brand voice and product details.';
      errorMessage.classList.add('visible');
      return;
    }

    generateBtn.classList.add('loading');
    generateBtn.disabled = true;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandVoice, contentType, productInfo, platform })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      outputText.textContent = data.result;
      outputEmpty.style.display = 'none';
      outputResult.style.display = 'flex';
    } catch (err) {
      errorMessage.textContent = err.message || 'Failed to generate copy. Please try again.';
      errorMessage.classList.add('visible');
    } finally {
      generateBtn.classList.remove('loading');
      generateBtn.disabled = false;
    }
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(outputText.textContent);
      copyBtnText.textContent = 'Copied!';
      setTimeout(() => {
        copyBtnText.textContent = 'Copy to Clipboard';
      }, 1800);
    } catch (err) {
      copyBtnText.textContent = 'Copy failed';
    }
  });
});
