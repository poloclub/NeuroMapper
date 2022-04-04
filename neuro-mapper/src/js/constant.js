export const embDir = "./data/embedding"
export const layers = [...Array(4).keys()].map(i => `layer${i + 1}`)
export const epochs = [...Array(17).keys()].map(x => 40 + x * 10)

export const mapWidth = 200
export const mapHeight = 200
export const mapBgColor = "#eeeeee"

export const embSize = 1
export const embColors = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"]
/**
 * ScatterGL Color
 */  
export const hues = [...new Array(10)].map((_, i) => Math.floor((255 / 10) * i));
export const lightTransparentColorsByLabel = hues.map(
    (hue) => `hsla(${hue}, 100%, 50%, 0.05)`
);
export const heavyTransparentColorsByLabel = hues.map(
    (hue) => `hsla(${hue}, 100%, 50%, 0.75)`
);
export const opaqueColorsByLabel = hues.map((hue) => `hsla(${hue}, 100%, 50%, 1)`);