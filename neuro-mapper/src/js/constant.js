export const embDir = "./data/embedding"
export const layers = [...Array(4).keys()].map(i => `layer${i + 1}`)
export const epochs = [...Array(17).keys()].map(x => 40 + x * 10)

export const mapWidth = 200
export const mapHeight = 200
export const mapBgColor = "#eeeeee"