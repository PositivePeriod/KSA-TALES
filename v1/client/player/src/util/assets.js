const ASSET_NAMES = [
    'ocean.png',
    'trap.png',
    'wall1.png',
    'wall2.png',
    'problem.png',
    'door.png',
    'weakblock.png',
    'brokenblock.png'
];

const assets = {};

function downloadAsset(assetName) {
    return new Promise(resolve => {
        console.log(assetName)
        const asset = new Image();
        asset.src = `/assets/${assetName}`;
        asset.onload = () => {
            assets[assetName] = asset;
            resolve();
        };
    });
}

export const downloadAssets = (callback) => {
    Promise.all(ASSET_NAMES.map(downloadAsset)).then(
        () => {
            console.info("All assets downloaded");
            callback();
        }
    );
};

export const getAsset = (assetName) => { return assets[assetName]; };

export const updateHTML = (url) => {
    var problem = document.getElementById('problem');
    problem.setAttribute("data-include-path", url);
    var includePath = problem.dataset.includePath;
    if (includePath) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) { problem.innerHTML = this.responseText; }
        };
        xhttp.open('GET', includePath, true);
        xhttp.send();
    }
};