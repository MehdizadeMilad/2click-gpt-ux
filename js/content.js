chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    switch (request.type) {
        case 'replaceSelection':
            replaceSelectedText(request.data);
            break;
        case 'showInPopUp':
            showInPopUp(request.data);
            break;
        case 'alert':
            alert(request.data);
            break;

        default:
            break;
    }
});

function replaceSelectedText(newText) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const el = document.createElement('div');
        el.innerHTML = newText;
        range.deleteContents();
        for (let i = el.childNodes.length - 1; i >= 0; i--) {
            range.insertNode(el.childNodes[i]);
        }
        selection.removeAllRanges();

    }
}

//TODO add a function to create a modal near the selected text
function showInPopUp(selectedText) {

    const SHARE_MESSAGE = "Read this content using SimpliTech chrome extension!"

    // Create a new div element for the popup
    const popup = document.createElement("div");
    popup.style.position = "absolute";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.padding = "1rem";
    popup.style.backgroundColor = "#fff";
    popup.style.borderRadius = "4px";
    popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
    popup.style.opacity = "0";

    // // Set the position of the popup near the selected text
    // const selection = window.getSelection();
    // const range = selection.getRangeAt(0);
    // const rect = range.getBoundingClientRect();
    // console.log(rect.top, rect.left);
    // popup.style.top = rect.top + 10 + "px";
    // popup.style.left = rect.left + 10 + "px";
    // console.log(popup.style.top, popup.style.left);

    // Add the selected text to the popup
    const popupText = document.createTextNode(selectedText);
    popup.appendChild(popupText);


    // Create a table for the social share functionality
    const table = document.createElement("table");
    table.classList.add("share-table");

    // Add the social share buttons to the table
    const row = table.insertRow();
    const facebookCell = row.insertCell();
    facebookCell.innerHTML = `<a href='https://www.facebook.com/sharer.php?u=${encodeURIComponent(window.location.href)}'><i class='fab fa-facebook'></i></a>`;

    const twitterCell = row.insertCell();
    twitterCell.innerHTML = `<a href='https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_MESSAGE)}'><i class='fab fa-twitter'></i></a>`;

    const pinterestCell = row.insertCell();
    pinterestCell.innerHTML = `<a href='https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}'><i class='fab fa-pinterest'></i></a>`;

    const emailCell = row.insertCell();
    emailCell.innerHTML = `<a href='mailto:?subject=${encodeURIComponent(SHARE_MESSAGE)}"&body=${encodeURIComponent(window.location.href)}'><i class='fas fa-envelope'></i></a>`;

    const whatsappCell = row.insertCell();
    whatsappCell.innerHTML = `<a href='whatsapp://send?text=${encodeURIComponent(SHARE_MESSAGE)}'><i class='fab fa-whatsapp'></i></a>`;

    const telegramCell = row.insertCell();
    telegramCell.innerHTML = `<a href='https://telegram.me/share/url?url=${encodeURIComponent(window.location.href)}'><i class='fab fa-telegram'></i></a>`;


    // Add the table to the modal
    popup.appendChild(table);


    // Add the popup to the document
    document.body.appendChild(popup);

    // Fade in the popup
    setTimeout(() => {
        popup.style.transition = "opacity 1s";
        popup.style.opacity = "1";
    }, 500);

    // Close the popup when the user clicks outside of it
    function closePopup(event) {
        if (!popup.contains(event.target)) {
            // Fade out the popup
            popup.style.opacity = "0";
            setTimeout(() => {
                // Remove the popup from the document
                document.body.removeChild(popup);
            }, 1000);
            // Remove the event listener
            document.removeEventListener("click", closePopup);
        }
    }
    document.addEventListener("click", closePopup);

    // Load Font Awesome fonts
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
    head.appendChild(link);

}
