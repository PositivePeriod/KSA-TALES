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
        console.log(assetName)
        console.log('Client Start 2-1')
        const asset = new Image();
        asset.src = `/assets/${assetName}`;
        console.log('Client Start 2-2')
        asset.onload = () => {
            console.log('Client Start 2-3')
            assets[assetName] = asset;
            console.log('Client Start 2-4')
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