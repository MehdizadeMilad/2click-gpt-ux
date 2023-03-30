// Saves options to chrome.storage
const saveAPI = async () => {
  const apiKeyInput = document.getElementById('api-key-input')
  const apiKeyValue = apiKeyInput.value.trim()

  document.getElementById('save').innerText = "Please wait ..."

  // Test if the api key is correct
  const _res = await fetch('https://api.openai.com/v1/engines', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKeyValue}`
    }
  })

  if (_res.ok) {
    const encryptedApiKey = btoa(apiKeyValue); //TODO replace with a strong encryption
    chrome.storage.sync.set({ 'apiKey': encryptedApiKey });
    apiKeyInput.style.borderColor = 'rgb(32 255 32 / 40%)'
    apiKeyInput.style.borderWidth = 'thick'
    document.getElementById('status').innerText = "Ok! now select any text and right click to find the SimpliTech functionalities!"
    const _title = document.getElementById('title')
    _title.innerHTML = "Paste your OpenAI <strong>API Key</strong>"
    _title.style.color = "black"

  }
  else {
    apiKeyInput.style.borderColor = 'rgb(249 10 10 / 40%)'
    apiKeyInput.style.borderWidth = 'thick'
    apiKeyInput.innerText = ''
    apiKeyInput.innerHTML = ''
    const _title = document.getElementById('title')
    _title.innerText = "Incorrect API KEY!"
    _title.style.color = 'red'
    document.getElementById('save').innerText = "Save"
  }
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