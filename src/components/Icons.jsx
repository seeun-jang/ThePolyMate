const glyphs = {
  home: (
    <>
      <path
        d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"
        fill="currentColor"
        fillOpacity=".1"
        stroke="none"
      />
      <path d="m3 10 9-7 9 7M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M9 20v-6h6v6" />
    </>
  ),
  study: (
    <>
      <path
        d="M3 5h5a5 5 0 0 1 4 2 5 5 0 0 1 4-2h5v14h-6a4 4 0 0 0-3 1 4 4 0 0 0-3-1H3Z"
        fill="currentColor"
        fillOpacity=".12"
        stroke="none"
      />
      <path d="M12 7c-2-2-5-2-9-2v14c4 0 7 0 9 2 2-2 5-2 9-2V5c-4 0-7 0-9 2Zm0 0v14M6.5 9.5h2M6.5 13h2M15.5 9.5h2M15.5 13h2" />
    </>
  ),
  schedule: (
    <>
      <rect
        x="4"
        y="6"
        width="16"
        height="15"
        rx="4"
        fill="currentColor"
        fillOpacity=".12"
        stroke="none"
      />
      <rect x="4" y="5" width="16" height="16" rx="4" />
      <path d="M8 3v4M16 3v4M4 10h16M8 14h2M14 14h2M8 17h2" />
      <circle cx="15" cy="17" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  health: (
    <>
      <path
        d="M20 5.5c-2-2.5-6-2-8 1-2-3-6-3.5-8-1C.5 10 5 16 12 21c7-5 11.5-11 8-15.5Z"
        fill="currentColor"
        fillOpacity=".12"
        stroke="none"
      />
      <path d="M20 5.5c-2-2.5-6-2-8 1-2-3-6-3.5-8-1C.5 10 5 16 12 21c7-5 11.5-11 8-15.5Z" />
      <path d="M7.5 12h2l1.5-3 2 6 1.5-3h2" />
    </>
  ),
  ideas: (
    <>
      <path
        d="M8 16c0-2-3-3-3-7a7 7 0 1 1 14 0c0 4-3 5-3 7Z"
        fill="currentColor"
        fillOpacity=".12"
        stroke="none"
      />
      <path d="M8 16c0-2-3-3-3-7a7 7 0 1 1 14 0c0 4-3 5-3 7M8 17h8M9 20h6M11 23h2M12 16v-5m-3-2 3 2 3-2" />
    </>
  ),
  trips: (
    <>
      <path
        d="m3 11 18-8-8 18-2-8Z"
        fill="currentColor"
        fillOpacity=".13"
        stroke="none"
      />
      <path d="m3 11 18-8-8 18-2-8-8-2Zm8 2 5-5" />
      <path d="m4 17-1 1m4 2-1 1" opacity=".6" />
    </>
  ),
  diary: (
    <>
      <rect
        x="5"
        y="3"
        width="15"
        height="18"
        rx="4"
        fill="currentColor"
        fillOpacity=".12"
        stroke="none"
      />
      <rect x="5" y="3" width="15" height="18" rx="4" />
      <path d="M9 3v18M3 7h4M3 12h4M3 17h4M12.5 8H16M12.5 12H16" />
    </>
  ),
  themes: (
    <>
      <path
        d="M12 3a9 9 0 0 0 0 18h1c2 0 2.5-2 1-3.5-1-1-.5-2.5 1-2.5h2a4 4 0 0 0 4-4c0-4.5-4-8-9-8Z"
        fill="currentColor"
        fillOpacity=".12"
        stroke="none"
      />
      <path d="M12 3a9 9 0 0 0 0 18h1c2 0 2.5-2 1-3.5-1-1-.5-2.5 1-2.5h2a4 4 0 0 0 4-4c0-4.5-4-8-9-8Z" />
      <circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="10" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
};

export function CategoryGlyph({ name, size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      className={`category-glyph ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyphs[name] || glyphs.home}
    </svg>
  );
}
