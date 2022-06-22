export const embDir = "./data/embedding";
export const layers = [...Array(4).keys()].map((i) => `layer${i + 1}`);
export const epochs = [...Array(39).keys()].map((x) => 5 + x * 5);

export const mapWidth = 200;
export const mapHeight = 200;
export const mapSizePercent = 20;
export const selectedMapSizePercent = 70;
export const mapBgColor = "#eeeeee";

/**
 * ScatterGL Color
 */
export const hues = [...new Array(10)].map((_, i) =>
  Math.floor((255 / 10) * i)
);
export const lightTransparentColorsByLabel = hues.map(
  (hue) => `hsla(${hue}, 100%, 50%, 0.05)`
);
export const heavyTransparentColorsByLabel = hues.map(
  (hue) => `hsla(${hue}, 100%, 50%, 0.75)`
);

/**
 * EpochControlButtons
 */
export const buttonSize = 50;
export const opaqueColorsByLabel = hues.map((hue) => `hsla(${hue}, 100%, 50%, 1)`);
export const embSize = 4
export const embColors = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"]
export const cifar_10_classes = ['plane', 'car', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck']

export const defaultNNeighbors = [20, 20, 20, 20]
export const defaultMinDist = [0.1, 0.1, 0.1, 0.1]
export const defaultSampleSize = [10000, 10000, 10000, 10000]

export const rotationAmount = [0, 0, 0, 0]
export const flipAmount = [1, 1, 1, 1]