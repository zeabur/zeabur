//@ts-check

import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import WorkingInProgress from './components/WorkingInProgress'
import CreateProject from './components/CreateProject'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(components) {
  return {
    ...docsComponents,
    ...components,
    WorkingInProgress,
    CreateProject,
  }
}
