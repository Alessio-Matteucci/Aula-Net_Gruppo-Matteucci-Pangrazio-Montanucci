/**
 * Planimetria stilizzata sul piano di sicurezza ITT Allievi–Sangallo (Terni):
 * forma a U, corridoio orizzontale centrale, fila di aule a sud, ali e scale a nord.
 * Quattro blocchi scala: Scala em. A, Scala A, Scala B, Scala em. B.
 *
 * Numerazione aule resta quella dell’app (1–119 su tre piani).
 */

/** @typedef {'S_EA'|'S_A'|'S_B'|'S_EB'} StairId */

export const STAIR = {
  EA: /** @type {StairId} */ ('S_EA'),
  A: /** @type {StairId} */ ('S_A'),
  B: /** @type {StairId} */ ('S_B'),
  EB: /** @type {StairId} */ ('S_EB'),
}

export const STAIR_SHORT_LABEL = {
  S_EA: 'Em. A',
  S_A: 'Scala A',
  S_B: 'Scala B',
  S_EB: 'Em. B',
}

/** Etichetta breve su una riga (celle strette). */
export const STAIR_TINY = {
  S_EA: 'Em.A',
  S_A: 'Sc.A',
  S_B: 'Sc.B',
  S_EB: 'Em.B',
}

const COLS = 18

/**
 * @param {number} start primo numero aula del piano (1, 41, 81)
 * @param {number} count 40 o 39
 * @returns {(number|null|StairId)[][]}
 */
function buildAllieviMatrix(start, count) {
  const n = (i) => start + i - 1

  const row0 = /** @type {(number|null|StairId)[]} */ ([
    n(1),
    n(2),
    STAIR.EA,
    n(3),
    n(4),
    STAIR.A,
    n(5),
    n(6),
    STAIR.B,
    n(7),
    n(8),
    STAIR.EB,
    n(9),
    n(10),
    n(11),
    n(12),
    n(13),
    n(14),
  ])

  const row1 = /** @type {(number|null|StairId)[]} */ ([
    n(15),
    n(16),
    null,
    n(17),
    n(18),
    null,
    n(19),
    n(20),
    null,
    n(21),
    n(22),
    null,
    n(23),
    n(24),
    n(25),
    n(26),
    n(27),
    n(28),
  ])

  const row2 = Array(COLS).fill(null)

  const row3 = /** @type {(number|null|StairId)[]} */ (Array(COLS).fill(null))
  const bottomCount = count - 28
  const pad = Math.floor((COLS - bottomCount) / 2)
  for (let i = 0; i < bottomCount; i++) {
    row3[pad + i] = n(29 + i)
  }

  return [row0, row1, row2, row3]
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
    corridorRow: 2,
    buildingNote: 'ITT Allievi – Sangallo (schema planimetrico)',
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
    corridorRow: 2,
    buildingNote: 'ITT Allievi – Sangallo (schema planimetrico)',
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
    corridorRow: 2,
    buildingNote: 'ITT Allievi – Sangallo (schema planimetrico)',
    matrix: buildAllieviMatrix(81, 39),
  },
]

function isStairId(v) {
  return v === STAIR.EA || v === STAIR.A || v === STAIR.B || v === STAIR.EB
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
