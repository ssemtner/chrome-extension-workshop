function injectTheScript() {
    // Query the active tab, which will be only one tab and inject the script in it.
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ['content_script.js'] })
    })
}

// Connecting our button with our content_script using an event listener
document.getElementById('clickactivity').addEventListener('click', injectTheScript)


// Add a listener to update the html when a message is sent by another part of the
// extension. Generally when we want parts of the extension to communicate with each
// other we use `chrome.runtime.sendMessage()`.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.data) {
        // If data is received, update the hello.html popup with the fetched data
        document.getElementById('dataDisplay').innerText = message.data;
    } else if (message.error) {
        // If an error occurred, display the error message in the hello.html popup
        document.getElementById('dataDisplay').innerText = 'Error: ' + message.error;
    }
});
