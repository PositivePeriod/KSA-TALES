const ASSET_NAMES = [
    'ocean.png',
    'trap.png',
    'Wall1.png',

];

const assets = {};

function downloadAsset(assetName) {
    return new Promise(resolve => {
        const asset = new Image();
        asset.src = `assets/${assetName}`;
        asset.onload = () => {
            assets[assetName] = asset;
            resolve();
        };
    });
}

export const downloadAssets = () => { Promise.all(ASSET_NAMES.map(downloadAsset)).then(console.info("All essets downloaded")); };

export const getAsset = assetName => assets[assetName];