//@dev to add a new function:
// 1- create the enum
// 2- create the functionality
// 3- create the context menu

const ENUMS = {
    SIMPLIFY: {
        id: "chatGPTSimplifyContextMenuItem",
        title: "Simplify (ChatGPT)"
    },
    ELABORATE: {
        id: "chatGPTElaborateContextMenuItem",
        title: "Elaborate (ChatGPT)"
    }
}




//TODO call openAI and return the result
async function simplify(text) {

    return "haya"
    if (simplifiedText) {
        const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getAPIKey()}`
            },
            body: JSON.stringify({
                'prompt': `Please simplify the following text: ${selectedText}`,
                'max_tokens': 60,
                'temperature': 0.7,
                'n': 1,
                'stop': '\n'
            })
        };

        fetch(apiUrl, requestOptions)
            .then(response => response.json())
            .then(data => {
                const summary = data.choices[0].text.trim();
                document.execCommand('insertHTML', false, summary);
            })
            .catch(error => console.log(error));
    }
}


//TODO call openAI and return the result
async function elaborate(text) {

    return "haya"
    if (simplifiedText) {
        const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getAPIKey()}`
            },
            body: JSON.stringify({
                'prompt': `Please simplify the following text: ${selectedText}`,
                'max_tokens': 60,
                'temperature': 0.7,
                'n': 1,
                'stop': '\n'
            })
        };

        fetch(apiUrl, requestOptions)
            .then(response => response.json())
            .then(data => {
                const summary = data.choices[0].text.trim();
                document.execCommand('insertHTML', false, summary);
            })
            .catch(error => console.log(error));
    }
}


// Create a context menu item
chrome.contextMenus.create({
    id: ENUMS.SIMPLIFY.id,
    title: ENUMS.SIMPLIFY.title,
    contexts: ["selection"] // when there are some texts selected
});
chrome.contextMenus.create({
    id: ENUMS.ELABORATE.id,
    title: ENUMS.ELABORATE.title,
    contexts: ["selection"] // when there are some texts selected
});

// add click event to it
chrome.contextMenus.onClicked.addListener(async function (info, tab) {
    const _selectedText = info.selectionText
    if (_selectedText.length < 1 || _selectedText.length > 1024) {
        showNotification("Selected text should be less than 1024 characters!")
    }

    // check which context menu item is clicked
    switch (info.menuItemId) {
        case ENUMS.SIMPLIFY.id:
            const _simplifiedText = await simplify(_selectedText)
            showInPopUp(tab.id, _simplifiedText)
            // replaceSelectedTextWithTheMutatedVersion(tab.id, _simplifiedText)
            break;
        case ENUMS.ELABORATE.id:
            const _elaboratedText = await elaborate(_selectedText)
            showInPopUp(tab.id, _elaboratedText)
            // replaceSelectedTextWithTheMutatedVersion(tab.id, _simplifiedText)
            break;


        default:
            break;
    }

})


// ###################### Interact with page content
//function to replace the selected text with the mutated version
async function replaceSelectedTextWithTheMutatedVersion(_activeTabId, _mutatedText) {
    // Send message to content.js to manipulate the DOM
    chrome.tabs.sendMessage(_activeTabId, { type: 'replaceSelection', data: _mutatedText });
}

//function to show  the mutated text in a pop-up near the selected text
async function showInPopUp(_activeTabId, _mutatedText) {
    // Send message to content.js to manipulate the DOM
    chrome.tabs.sendMessage(_activeTabId, { type: 'showInPopUp', data: _mutatedText });
}

// Get the open api key from user storage 
async function getAPIKey() {
    const { apiKey } = await chrome.storage.sync.get("apiKey")
    if (!apiKey) showNotification("Set the API Key! Right click on the extension icon and select <options>");
    return _key ? atob(apiKey) : undefined;
}

function showNotification(message) {
    //TODO make it browser independent
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { type: 'alert', data: message });
    });
}

// Receive message from the content.js
chrome.runtime.onMessage.addListener(data => {
    console.log("Message received in background.js", data);

    if (data.type === 'setAPIKey') {
        saveOnLocalStorage(data.apiKey)
    }
});
