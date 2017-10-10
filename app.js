setTimeout(() => {
    let app = new Application();
    return app.boot();
}, 1000);

class ApplicationMethods {
    getStorageData() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get({
                watched: []
            }, (response) => {
                resolve(response);
            });
        })
    };

    setStorageData(data) {
        chrome.storage.sync.set({
            watched: data
        });
    };

    clearStorageData() {
        chrome.storage.sync.clear();
    };

    getVideoId() {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    };

    isWatched(setData) {
        let currentVideoId = this.getVideoId();
        return !!setData.has(currentVideoId);
    };

    toggleStatus(setData) {

        let videoId = this.getVideoId();

        if(this.isWatched(setData)) {
            console.log('Video watched');
            console.log(this.watchedButton);
            this.watchedButton.text('Unwatch');
            setData.delete(videoId);
        } else {
            console.log('Video not watched');
            console.log(this.watchedButton);
            this.watchedButton.text('Watch');
            setData.add(videoId);
        }
        console.log('addSetData', setData);

        // Convert set to array
        let arrayData = Array.from(setData);
        console.log('arrayData', arrayData);

        // Save the new array to chrome storage
        this.setStorageData(arrayData);
    }
}

class Application extends ApplicationMethods {

    async boot() {
        // clearStorageData()

        // Get storage data array
        let storageData = await this.getStorageData();
        console.log('storageData', storageData);

        // Convert storage data array to set
        let setData = new Set(storageData.watched);
        console.log('setData', setData);

        // Create button
        this.renderView(setData);
    }

    renderView(setData) {
        // Set watched button
        this.watchedButton = $(`
            <button id="youtube-watched-button"></button>
        `);
        $('#top-level-buttons').append(this.watchedButton);

        // init toggle status
        this.toggleStatus(setData);

        // On button click
        this.watchedButton.click(() => {
            this.toggleStatus(setData);
        });
    };
}