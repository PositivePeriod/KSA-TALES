const ASSET_NAMES = [
    'ocean.png',
    'trap.png',
    'flash.png',
    'hammer.png',
    'hint.png',
    'reward.png',
    'wall1.png',
    'wall2.png',
    'problem.png',
    'door.png',
    'weakblock.png',
    'brokenblock.png',
    'final.png',
    'AA/RAA_4.png',
    'AA/RAA_2.png',
    'AA/RAA_1.png',
    'AA/AA3_9.png',
    'AA/AA3_8.png',
    'AA/AA3_6.png',
    'AA/AA3_5.png',
    'AA/AA3_4.png',
    'AA/AA3_2.png',
    'AA/AA3_1.png',
    'AA/AA2_9.png',
    'AA/AA2_8.png',
    'AA/AA2_7.png',
    'AA/AA2_6.png',
    'AA/AA2_4.png',
    'AA/AA2_3.png',
    'AA/AA2_2.png',
    'AA/AA2_1.png',
    'AA/AA1_10.png',
    'AA/AA1_8.png',
    'AA/AA1_9.png',
    'AA/AA1_7.png',
    'AA/AA1_5.png',
    'AA/AA1_4.png',
    'AA/AA1_1.png',
    'AA/default.png'
];

const assets = {};

function downloadAsset(assetName) {
    return new Promise(resolve => {
        const asset = new Image();
        asset.src = `/assets/${assetName}`;
        asset.onload = () => {
            assets[assetName] = asset;
            // console.log(assetName)
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