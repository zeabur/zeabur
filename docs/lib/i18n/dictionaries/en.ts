const en = {
  // Navigation
  nav: {
    home: 'Home',
    search: 'Search documentation…',
    tocTitle: 'On This Page',
    editLink: 'Edit this page',
    backToTop: 'Scroll to top',
    previous: 'Previous',
    next: 'Next',
  },
  // Feedback
  feedback: {
    question: 'Question? Give us feedback →',
    helpful: 'Was this page helpful?',
    yes: 'Yes',
    no: 'No',
    thankYou: 'Thank you for your feedback!',
  },
  // Translation toggle
  translation: {
    viewOriginal: 'View original (English)',
    viewTranslation: 'View translation',
    machineTranslated: 'This page was automatically translated and may contain errors.',
  },
  // WIP
  wip: {
    message: 'This page is a work in progress.',
  },
}

export type Dictionary = {
  nav: {
    home: string
    search: string
    tocTitle: string
    editLink: string
    backToTop: string
    previous: string
    next: string
  }
  feedback: {
    question: string
    helpful: string
    yes: string
    no: string
    thankYou: string
  }
  translation: {
    viewOriginal: string
    viewTranslation: string
    machineTranslated: string
  }
  wip: {
    message: string
  }
}
export default en
