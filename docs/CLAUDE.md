# Locale Structure

- Docs exist in 5 locales: `en-US`, `zh-TW`, `zh-CN`, `ja-JP`, `es-ES` (under `pages/<locale>/`)
- All locales share identical MDX structure — component/prop changes must be applied to all locales

## Available MDX Custom Components

### `<WorkingInProgress />`

- **Source**: `components/WorkingInProgress/index.tsx`
- Displays a locale-aware "work in progress" notice
- Supports: en-US, zh-TW, zh-CN, ja-JP

### `<CreateProject />`

- **Source**: `components/CreateProject/index.tsx`
- Renders locale-aware project creation instructions
- Supports: en-US, zh-CN, zh-TW, ja-JP

### `<LastUpdated />`

- **Source**: `components/LastUpdated/index.tsx`
- Displays formatted "Last updated" timestamp (used automatically by Nextra as `gitTimestamp`)

## Nextra Built-in Components (import from `nextra/components`)

### `<Callout>`

```jsx
import { Callout } from 'nextra/components'

<Callout type="info">Info message</Callout>
```

- **Types**: `"default"` | `"info"` | `"warning"` | `"error"` | `"success"`
- **Optional prop**: `emoji="ℹ️"` for custom emoji

### `<Tabs>` / `<Tabs.Tab>`

```jsx
import { Tabs } from 'nextra/components'

<Tabs items={['pnpm', 'npm', 'yarn']}>
  <Tabs.Tab>pnpm content</Tabs.Tab>
  <Tabs.Tab>npm content</Tabs.Tab>
  <Tabs.Tab>yarn content</Tabs.Tab>
</Tabs>
```

- **Tab sync**: Use `storageKey` prop to sync selection across multiple `<Tabs>` on the same page (e.g., `<Tabs storageKey="os" items={['Linux', 'macOS']}>`)

### `<Steps>`

```jsx
import { Steps } from 'nextra/components'

<Steps>
### Step 1
Description
### Step 2
Description
</Steps>
```

## Code Block Enhancements (Nextra syntax)

- **Filename**: ` ```js filename="server.js" ` — shows filename header
- **Copy button**: ` ```bash copy ` — adds copy-to-clipboard button
- **Line highlighting**: ` ```ts {2} ` or ` ```ts {7-8} ` — highlights specific lines
- **Combined**: ` ```json filename="package.json" {3} copy `
