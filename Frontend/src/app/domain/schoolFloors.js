/**
 * Planimetrie 3 piani: griglia con celle vuote (atrio / vuoti) e stessa numerazione 1–119.
 * Colonna centrale `null` = spazio aperto tra le due ali.
 */

const ATRIO_COL = 5

function planColToX(col, roomSpacing, atrioExtra) {
  let x = col * roomSpacing
  if (col > ATRIO_COL) x += atrioExtra
  return x
}

/** @typedef {{ id: number, label: string, shortLabel: string, roomStart: number, roomEnd: number, plateColor: string, plateEmissive: string, matrix: (number|null)[][], atrioExtra?: number }} SchoolFloorPlan */

/** @type {SchoolFloorPlan[]} */
export const SCHOOL_FLOORS = [
  {
    id: 0,
    label: 'Piano terra',
    shortLabel: 'Terra',
    roomStart: 1,
    roomEnd: 40,
    plateColor: '#143d36',
    plateEmissive: '#062822',
    atrioExtra: 0.42,
    matrix: [
      [1, 2, 3, 4, 5, null, 6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15, null, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, null, 26, 27, 28, 29, 30],
      [31, 32, 33, 34, 35, null, 36, 37, 38, 39, 40],
    ],
  },
  {
    id: 1,
    label: '1° piano',
    shortLabel: '1°',
    roomStart: 41,
    roomEnd: 80,
    plateColor: '#1e2450',
    plateEmissive: '#0a0e28',
    atrioExtra: 0.42,
    matrix: [
      [41, 42, 43, 44, 45, null, 46, 47, 48, 49, 50],
      [51, 52, 53, 54, 55, null, 56, 57, 58, 59, 60],
      [61, 62, 63, 64, 65, null, 66, 67, 68, 69, 70],
      [71, 72, 73, 74, 75, null, 76, 77, 78, 79, 80],
    ],
  },
  {
    id: 2,
    label: '2° piano',
    shortLabel: '2°',
    roomStart: 81,
    roomEnd: 119,
    plateColor: '#4a3018',
    plateEmissive: '#1a0f08',
    atrioExtra: 0.42,
    matrix: [
      [81, 82, 83, 84, 85, null, 86, 87, 88, 89, 90],
      [91, 92, 93, 94, 95, null, 96, 97, 98, 99, 100],
      [101, 102, 103, 104, 105, null, 106, 107, 108, 109, 110],
      [111, 112, 113, 114, 115, null, 116, 117, 118, 119, null],
    ],
  },
]

/**
 * Griglia per rendering 2D/3D: celle stanza + vuoti.
 * @returns {{ items: { number: number, col: number, row: number }[], cells: { col: number, row: number, kind: 'room'|'void', number?: number }[], cols: number, rows: number, usedCols: number, count: number, config: SchoolFloorPlan | null, atrioCol: number }}
 */
export function getSchoolFloorGrid(floorIndex) {
  const config = SCHOOL_FLOORS[floorIndex]
  if (!config?.matrix) {
    return {
      items: [],
      cells: [],
      cols: 0,
      rows: 0,
      usedCols: 0,
      count: 0,
      config: null,
      atrioCol: ATRIO_COL,
    }
  }
  const matrix = config.matrix
  const rows = matrix.length
  const cols = matrix[0]?.length ?? 0
  const items = []
  const cells = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const v = matrix[row][col]
      if (v == null) {
        cells.push({ col, row, kind: 'void' })
      } else {
        items.push({ number: v, col, row })
        cells.push({ col, row, kind: 'room', number: v })
      }
    }
  }
  return {
    items,
    cells,
    cols,
    rows,
    usedCols: cols,
    count: items.length,
    config,
    atrioCol: ATRIO_COL,
  }
}

/** Layout Three.js: stessa geometria della planimetria (atrio allarga distanza tra ali). */
export function getSchoolFloorLayout3d(floorIndex, roomSpacing = 1.12) {
  const { items, cols, rows, config } = getSchoolFloorGrid(floorIndex)
  const atrioExtra = config?.atrioExtra ?? 0.4
  const items3d = items.map(({ number, col, row }) => ({
    number,
    position: [planColToX(col, roomSpacing, atrioExtra), 0, row * roomSpacing],
  }))
  const maxX = planColToX(cols - 1, roomSpacing, atrioExtra)
  const centerX = maxX / 2
  const centerZ = ((rows - 1) * roomSpacing) / 2
  const width = maxX + roomSpacing + 2.2
  const depth = rows * roomSpacing + 2.2
  return { items: items3d, centerX, centerZ, rows, width, depth, config }
}
