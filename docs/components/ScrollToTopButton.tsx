// Icon-only scroll-to-top button used in the TOC sidebar next to ShareButton.
// Replaces Nextra's built-in toc.backToTop (which renders "Scroll to top" + chevron)
// so we can sit it inline with ShareButton on the same row.

export default function ScrollToTopButton() {
  return (
    <button
      type="button"
      className="share-button"
      onClick={() =>
        typeof window !== 'undefined' &&
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ChevronUpIcon />
    </button>
  )
}

function ChevronUpIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}
