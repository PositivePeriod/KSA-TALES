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
            console.log(assets,'asdflhasdfklfsdajkl');
            resolve();
        };
    });
}

export const downloadAssets = () => { Promise.all(ASSET_NAMES.map(downloadAsset)).then(console.info("All essets downloaded")); };

export const getAsset = (assetName) => {
    console.log(assets,assetName);
    return assets[assetName];
};