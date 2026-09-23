import React from "react";

export const PULAU_ICON_PATHS: Record<string, string> = {
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8"/>',
  bag: '<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  flame: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 2 1 3 3 3 3s1-3 0-7z"/>',
  coin: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/>',
  o2: '<circle cx="12" cy="13" r="7"/><path d="M9 12a3 3 0 0 1 3-3"/>',
  star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  chest: '<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M3 13h18M12 12v3M5 9a7 5 0 0 1 14 0"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  chart: '<path d="M4 20h16M7 16v-5M12 16V6M17 16v-8"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  chev: '<path d="M9 5l7 7-7 7"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
};

export function PulauIcon({
  name,
  size = 22,
  fill = false,
  className,
}: {
  name: string;
  size?: number;
  fill?: boolean;
  className?: string;
}) {
  const innerHtml = PULAU_ICON_PATHS[name] || PULAU_ICON_PATHS.star;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: innerHtml }}
    />
  );
}

const BL = [
  "....oooooo....",
  "..oopppppppoo.",
  ".oplpppppppppo",
  "oplppwkpppwkpo",
  "oppppwkpppwkpo",
  "oppppppppppppo",
  "opppppnnnppppo",
  "oppppnnnnnpppo",
  ".opppnnnnnppo.",
  "..oopppppppoo.",
  "....oooooo....",
];

const BC: Record<string, string> = {
  o: "#1B1440",
  p: "#F26A99",
  l: "#FFB3D6",
  w: "#ffffff",
  k: "#1B1440",
  n: "#D62A78",
};

export function BlobiPixel({
  scale = 2.4,
  className,
}: {
  scale?: number;
  className?: string;
}) {
  const rects: React.ReactNode[] = [];
  BL.forEach((row, y) => {
    row.split("").forEach((c, x) => {
      if (BC[c]) {
        rects.push(
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="1.02"
            height="1.02"
            fill={BC[c]}
          />
        );
      }
    });
  });

  return (
    <svg
      viewBox="0 0 14 11"
      width={Math.round(14 * scale)}
      height={Math.round(11 * scale)}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Blobi"
      className={className}
    >
      {rects}
    </svg>
  );
}
