const ASSET_NAMES = [
    'ocean.png',
    'trap.png',
    'Wall1.png',
    'Wall2.png',
    'Problem.png',


];

const assets = {};

function downloadAsset(assetName) {
    return new Promise(resolve => {
        const asset = new Image();
        asset.src = `http://localhost:8000/assets/${assetName}`;
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