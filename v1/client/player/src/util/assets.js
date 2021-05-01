const ASSET_NAMES = [
    'ocean.png',
    'trap.png',
    'wall1.png',
    'wall2.png',
    'problem.png',
    'door.png'


];

const assets = {};

function downloadAsset(assetName) {
    return new Promise(resolve => {
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
            console.info("All essets downloaded");
            callback();
        }
    );
};

export const getAsset = (assetName) => {
    return assets[assetName];
};