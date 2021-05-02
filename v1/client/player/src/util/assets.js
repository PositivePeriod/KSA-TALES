const ASSET_NAMES = [
    'ocean.png',
    'trap.png',
    'wall1.png',
    'wall2.png',
    'problem.png',
    'door.png',
    'weakblock.png',
    'brokenblock.png',
    // 'RAA_4.png',
    // 'RAA_2.png',
    // 'RAA_1.png',
    // 'AA3_9.png',
    // 'AA3_8.png',
    // 'AA3_6.png',
    // 'AA3_4.png',
    // 'AA3_2.png',
    // 'AA3_1.png',
    // 'AA2_9.png',
    // 'AA2_8.png',
    // 'AA2_7.png',
    // 'AA2_6.png',
    // 'AA2_4.png',
    // 'AA2_3.png',
    // 'AA2_2.png',
    // 'AA2_1.png',
    // 'AA1_10.png',
    // 'AA1_8.png',
    // 'AA1_9.png',
    // 'AA1_7.png',
    // 'AA1_5.png',
    // 'AA1_4.png',
    // 'AA1_1.png',
    // 'default.png'
];

const assets = {};

function downloadAsset(assetName) {
    return new Promise(resolve => {
        const asset = new Image();
        asset.src = `/assets/${assetName}`;
        asset.onload = () => {
            assets[assetName] = asset;
            console.log(assetName)
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