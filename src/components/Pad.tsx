import type { Kind } from '../lib/parse'

export const KIND_LABEL: Record<Kind, string> = {
  particle: 'Particle', concept: 'Concept', quantity: 'Quantity', law: 'Law',
  component: 'Component', method: 'Method', system: 'System',
}

/** Each kind of concept is drawn as a different real PCB pad shape. */
export function PadShape({ kind, r = 15 }: { kind: Kind; r?: number }) {
  switch (kind) {
    case 'particle':
      return <path className="pad" fillRule="evenodd" d={`M${-r} 0a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0M${-r * 0.4} 0a${r * 0.4} ${r * 0.4} 0 1 1 ${r * 0.8} 0a${r * 0.4} ${r * 0.4} 0 1 1 ${-r * 0.8} 0`} />
    case 'quantity':
      return <rect className="pad" x={-r * 0.9} y={-r * 0.9} width={r * 1.8} height={r * 1.8} rx={2.5} />
    case 'law': {
      const a = r, b = r * 0.42
      return <polygon className="pad" points={`${-b},${-a} ${b},${-a} ${a},${-b} ${a},${b} ${b},${a} ${-b},${a} ${-a},${b} ${-a},${-b}`} />
    }
    case 'component':
      return <rect className="pad" x={-r * 1.45} y={-r * 0.72} width={r * 2.9} height={r * 1.44} rx={r * 0.72} />
    case 'method':
      return <polygon className="pad" points={`0,${-r * 1.15} ${r * 1.15},0 0,${r * 1.15} ${-r * 1.15},0`} />
    case 'system':
      return (
        <g className="pad">
          {[-1, 0, 1].flatMap((x) => [-1, 0, 1].map((y) => <circle key={`${x}${y}`} cx={x * r * 0.68} cy={y * r * 0.68} r={r * 0.3} />))}
        </g>
      )
    default:
      return <circle className="pad" r={r} />
  }
}
