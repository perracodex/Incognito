/*
 * Copyright (c) 2023 Perraco Labs. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>
 */

/**
 * Displays a status message with specified color and clears it after a timeout if positive.
 * @param {string} message - The message to be displayed.
 * @param {string} color - The color of the message text ('red' or 'green').
 */
function updateStatus(message, color) {
    const elementStatus = document.getElementById('status');
    elementStatus.textContent = message;
    elementStatus.style.color = color;

    if (color === 'green') {
        setTimeout(() => elementStatus.textContent = '', 1000);  // Clear message after 1 second.
    }
}

/**
 * Saves the URL option entered by the user.
 * The URL is normalized by removing the protocol and leading/trailing spaces.
 * Displays a status message based on the result of the operation.
 */
function saveOptions() {
    const elementUrl = document.getElementById('defaultUrl');
    const elementStatus = document.getElementById('status');
    let url = elementUrl.value.trim().replace(/^https?:\/\//, '');

    if (url) {
        elementUrl.value = url;  // Update the input field with normalized URL.
        url = "https://" + url;  // Prepend 'https://' for URL validation.
        
        try {
            new URL(url);  // Validate the URL format.
        } catch (_) {
            elementStatus.textContent = 'Invalid URL';
            elementStatus.style.color = 'red';
            elementUrl.focus();
            return;
        }
    } else {
        url = null;  // Handle empty input.
    }

    chrome.storage.sync.set({defaultUrl: url}, () => {
        updateStatus('Saved', 'green');
    });
}

/**
 * Restores the URL option from Chrome's storage.
 * Removes 'http://' or 'https://' from the stored URL before displaying it.
 */
function restoreOptions() {
    chrome.storage.sync.get({defaultUrl: ''}, function(storage) {
        let defaultUrl = storage.defaultUrl || '';
        
        if (defaultUrl.toLowerCase().startsWith("https://")) {
            defaultUrl = defaultUrl.substring("https://".length);
        } else if (defaultUrl.toLowerCase().startsWith("http://")) {
            defaultUrl = defaultUrl.substring("http://".length);
        }

        document.getElementById('defaultUrl').value = defaultUrl;
    });
}

// Event listeners for DOM content loaded and save button click.
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
