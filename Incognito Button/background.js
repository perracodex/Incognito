/*
 * Copyright (c) 2023 Perraco Labs. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>
 */

chrome.action.onClicked.addListener(async () => {
  chrome.storage.sync.get(['defaultUrl'], function(storage){
    let defaultUrl = storage.defaultUrl;
    
    // Validate URL format.
    try {
      if (defaultUrl) new URL(defaultUrl);
    } catch (_) {
      defaultUrl = null;  
    }

    // Create a new incognito window with the default URL if valid.
    chrome.windows.create({focused: true, incognito: true, state: 'maximized', url: defaultUrl});
  });
});


