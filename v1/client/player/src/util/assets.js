const ASSET_NAMES = [
    'icon.png',
    'city.svg',
    'crown.svg',
    'mountain.svg',
    'swamp.svg',
]; // TODO

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