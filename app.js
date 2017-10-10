setTimeout(() => {
    return startApplication();
}, 1000);

let button = `
    <button id="youtube-watched-button">Watched</button>
`;

let watchedButton = $('#youtube-watched-button');

let getVideoId = () => {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v');
};

let isWatched = (setData) => {
    let currentVideoId = getVideoId();
    return !!setData.has(currentVideoId);
};

let createButton = (setData) => {
    $('#top-level-buttons').append(button);
    watchedButton.click(() => {
        let videoId = getVideoId();
        setData.add(videoId);
        console.log('addSetData', setData);
        let arrayData = Array.from(setData);
        console.log('arrayData', arrayData);
        setStorageData(arrayData);
    });
};

/**
 * Storage
 */
let getStorageData = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get({
            watched: []
        }, (response) => {
            resolve(response);
        });
    })
};

let setStorageData = (data) => {
    chrome.storage.sync.set({
        watched: data
    });
};

let clearStorageData = () => {
    chrome.storage.sync.clear();
};

/**
 * Application
 */
let startApplication = async () => {
    // clearStorageData()

    // Get storage data array
    let storageData = await getStorageData();
    console.log('storageData', storageData);

    // Convert storage data array to set
    let setData = new Set(storageData.watched);
    console.log('setData', setData);

    // Check if current url has been watched
    if(isWatched(setData)) {
        console.log('Video watched');
        watchedButton.text('Unwatch');
    } else {
        console.log('Video not watched');
        watchedButton.text('Watch');
    }

    // Create button
    createButton(setData);
};