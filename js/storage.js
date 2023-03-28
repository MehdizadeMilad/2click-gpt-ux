console.log("Options loaded");

// Saves options to chrome.storage
const saveAPI = () => {
  const apiKeyInput = document.getElementById('api-key-input')
  const apiKeyValue = apiKeyInput.value.trim()
  const encryptedApiKey = btoa(apiKeyValue); //TODO replace with a strong encryption
  chrome.storage.sync.set({ 'apiKey': encryptedApiKey });
  apiKeyInput.style.borderColor = '#2cff2c'
  apiKeyInput.style.borderWidth = 'thick'
  document.getElementById('status').innerText = "Done! from now you have an AI assistant by your side on every html pages!"
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreAPI = async () => {
  const { apiKey } = await chrome.storage.sync.get("apiKey")
  const apiKeyDecoded = atob(apiKey)
  document.getElementById('api-key-input').value = apiKeyDecoded;
};

document.addEventListener('DOMContentLoaded', restoreAPI);
document.getElementById('save').addEventListener('click', saveAPI);