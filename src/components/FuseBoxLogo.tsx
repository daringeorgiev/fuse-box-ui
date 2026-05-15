import type { SVGProps } from 'react';

type Tone = 'default' | 'inverted' | 'monochrome';

export interface FuseBoxLogoProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number | string;
  tone?: Tone;
  /** Renders an amber rounded-rect plate behind the mark. Overrides tone colors. */
  plate?: boolean;
  inkColor?: string;
  accentColor?: string;
  filamentColor?: string;
  /** Override the plate background color. Only used when plate={true}. */
  plateColor?: string;
  title?: string;
}

const TONE_DEFAULTS: Record<Tone, { ink: string; accent: string; filament: string }> = {
  default:    { ink: '#1F2328', accent: 'var(--accent, #E78640)', filament: '#FFFFFF' },
  inverted:   { ink: '#FAFBFC', accent: 'var(--accent, #E78640)', filament: '#FFFFFF' },
  monochrome: { ink: 'currentColor', accent: 'currentColor', filament: 'currentColor' },
};

const PLATE_DEFAULTS = {
  plate: 'var(--accent, #E78640)',
  ink: '#1F2328',
  accent: '#FFFFFF',
  filament: 'var(--accent, #E78640)',
};

export function FuseBoxLogo({
  size = 32,
  tone = 'default',
  plate = false,
  inkColor,
  accentColor,
  filamentColor,
  plateColor,
  title = 'Fuse Box',
  ...rest
}: FuseBoxLogoProps) {
  const base = plate ? PLATE_DEFAULTS : TONE_DEFAULTS[tone];
  const ink = inkColor ?? base.ink;
  const accent = accentColor ?? base.accent;
  const filament = filamentColor ?? base.filament;
  const bgColor = plateColor ?? PLATE_DEFAULTS.plate;

  const showFilament = tone !== 'monochrome';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-16 -16 160 160"
      width={size}
      height={size}
      role={title ? 'img' : 'presentation'}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title ? <title>{title}</title> : null}

      {plate && <rect x="-16" y="-16" width="160" height="160" rx="32" fill={bgColor} />}

      {/* Stem */}
      <rect x="19" y="22" width="22" height="84" fill={ink} />
      <rect x="15" y="10" width="30" height="16" rx="2" fill={ink} />
      <rect x="15" y="102" width="30" height="16" rx="2" fill={ink} />

      {/* Top arm */}
      <rect x="41" y="16" width="56" height="22" fill={accent} />
      {showFilament && (
        <path
          d="M 45 27 L 51 27 L 56 21 L 63 33 L 70 21 L 77 33 L 84 21 L 89 27 L 94 27"
          fill="none"
          stroke={filament}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <rect x="95" y="10" width="18" height="34" rx="2" fill={ink} />

      {/* Mid arm */}
      <rect x="41" y="58" width="34" height="22" fill={accent} />
      {showFilament && (
        <path
          d="M 45 69 L 50 69 L 55 63 L 61 75 L 67 63 L 72 69"
          fill="none"
          stroke={filament}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <rect x="73" y="52" width="18" height="34" rx="2" fill={ink} />
    </svg>
  );
}

export default FuseBoxLogo;
