/**
 * Planimetria 2D semplificata:
 * - lato alto: aule - scala A - aule - scala B - aule
 * - corridoio centrale continuo
 * - lato basso: tutte le aule su una fila unica
 *
 * Numerazione aule invariata (1-119 su tre piani).
 */

/** @typedef {'S_A'|'S_B'} StairId */

export const STAIR = {
  A: /** @type {StairId} */ ('S_A'),
  B: /** @type {StairId} */ ('S_B'),
}

export const STAIR_SHORT_LABEL = {
  S_A: 'Scala A',
  S_B: 'Scala B',
}

/** Etichetta breve su una riga (celle strette). */
export const STAIR_TINY = {
  S_A: 'Sc.A',
  S_B: 'Sc.B',
}

/**
 * @param {number} start primo numero aula del piano (1, 41, 81)
 * @param {number} count 40 o 39
 * @returns {(number|null|StairId)[][]}
 */
function buildAllieviMatrix(start, count) {
  const n = (i) => start + i - 1
  const topCount = Math.floor(count / 2)
  const bottomCount = count - topCount

  const firstGroup = Math.ceil(topCount / 3)
  const secondGroup = Math.floor((topCount - firstGroup) / 2)
  const thirdGroup = topCount - firstGroup - secondGroup

  const topSequence = /** @type {(number|StairId)[]} */ ([])
  let roomCursor = 1
  for (let i = 0; i < firstGroup; i++) topSequence.push(n(roomCursor++))
  topSequence.push(STAIR.A)
  for (let i = 0; i < secondGroup; i++) topSequence.push(n(roomCursor++))
  topSequence.push(STAIR.B)
  for (let i = 0; i < thirdGroup; i++) topSequence.push(n(roomCursor++))

  const cols = Math.max(topSequence.length, bottomCount)
  const rowTop = /** @type {(number|null|StairId)[]} */ (Array(cols).fill(null))
  const rowMiddle = /** @type {(number|null|StairId)[]} */ (Array(cols).fill(null))
  const rowBottom = /** @type {(number|null|StairId)[]} */ (Array(cols).fill(null))

  const topPad = Math.floor((cols - topSequence.length) / 2)
  for (let i = 0; i < topSequence.length; i++) rowTop[topPad + i] = topSequence[i]

  const bottomPad = Math.floor((cols - bottomCount) / 2)
  for (let i = 0; i < bottomCount; i++) rowBottom[bottomPad + i] = n(topCount + i + 1)

  return [rowTop, rowMiddle, rowBottom]
}

/** @typedef {{ id: number, label: string, shortLabel: string, roomStart: number, roomEnd: number, plateColor: string, plateEmissive: string, matrix: (number|null|StairId)[][], corridorRow: number, buildingNote?: string }} SchoolFloorPlan */

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
    corridorRow: 1,
    buildingNote: 'Schema semplificato con due scale',
    matrix: buildAllieviMatrix(1, 40),
  },
  {
    id: 1,
    label: '1° piano',
    shortLabel: '1°',
    roomStart: 41,
    roomEnd: 80,
    plateColor: '#1e2450',
    plateEmissive: '#0a0e28',
    corridorRow: 1,
    buildingNote: 'Schema semplificato con due scale',
    matrix: buildAllieviMatrix(41, 40),
  },
  {
    id: 2,
    label: '2° piano',
    shortLabel: '2°',
    roomStart: 81,
    roomEnd: 119,
    plateColor: '#4a3018',
    plateEmissive: '#1a0f08',
    corridorRow: 1,
    buildingNote: 'Schema semplificato con due scale',
    matrix: buildAllieviMatrix(81, 39),
  },
]

function isStairId(v) {
  return v === STAIR.A || v === STAIR.B
}

/**
 * @returns {{ items: { number: number, col: number, row: number }[], cells: { col: number, row: number, kind: 'room'|'void'|'stair', number?: number, stairId?: StairId }[], cols: number, rows: number, usedCols: number, count: number, config: SchoolFloorPlan | null, corridorRow: number | null }}
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
      corridorRow: null,
    }
  }
  const matrix = config.matrix
  const rows = matrix.length
  const cols = matrix[0]?.length ?? 0
  const corridorRow = config.corridorRow ?? null
  const items = []
  const cells = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const v = matrix[row][col]
      if (v == null) {
        if (row === corridorRow) continue
        cells.push({ col, row, kind: 'void' })
      } else if (typeof v === 'number') {
        items.push({ number: v, col, row })
        cells.push({ col, row, kind: 'room', number: v })
      } else if (isStairId(v)) {
        cells.push({ col, row, kind: 'stair', stairId: v })
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
    corridorRow,
  }
}

/** Layout Three.js: griglia uniforme (stessa forma della planimetria 2D). */
export function getSchoolFloorLayout3d(floorIndex, roomSpacing = 1.05) {
  const { items, cols, rows, config } = getSchoolFloorGrid(floorIndex)
  const items3d = items.map(({ number, col, row }) => ({
    number,
    position: [col * roomSpacing, 0, row * roomSpacing],
  }))
  const maxX = (cols - 1) * roomSpacing
  const centerX = maxX / 2
  const centerZ = ((rows - 1) * roomSpacing) / 2
  const width = maxX + roomSpacing + 2.4
  const depth = rows * roomSpacing + 2.4
  return { items: items3d, centerX, centerZ, rows, width, depth, config }
}
