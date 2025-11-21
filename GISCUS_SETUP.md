# Giscus Comments Setup Guide

This project has been integrated with [giscus](https://giscus.app/) to enable comments powered by GitHub Discussions.

## Prerequisites

Before the giscus comments system will work, the following setup steps must be completed:

### 1. Enable GitHub Discussions

1. Go to the repository settings: https://github.com/casbin/casbin-editor/settings
2. Scroll down to the "Features" section
3. Check the box to enable "Discussions"

### 2. Install the giscus App

1. Visit https://github.com/apps/giscus
2. Click "Install"
3. Select the `casbin/casbin-editor` repository
4. Authorize the app

### 3. Configure giscus

1. Visit https://giscus.app/
2. In the "Repository" section, enter: `casbin/casbin-editor`
3. The site will verify that:
   - The repository is public
   - The giscus app is installed
   - Discussions are enabled
4. Choose your Discussion Category (recommended: "General" or create a new one like "Comments")
5. Copy the generated configuration values, specifically:
   - `data-repo-id` (repoId)
   - `data-category-id` (categoryId)
6. Update these values in `/app/components/GiscusComments.tsx`

## Current Configuration

The giscus component is located at `/app/components/GiscusComments.tsx` and is currently configured with placeholder values:

```tsx
<Giscus
  repo="casbin/casbin-editor"
  repoId="R_kgDODbjKlA"  // Update this value
  category="General"
  categoryId="DIC_kwDODbjKlM4Clhuw"  // Update this value
  // ... other settings
/>
```

## Features

Once properly configured, the comments section will:

- Appear at the bottom of the main editor page
- Support dark/light theme based on user preference
- Allow visitors to comment using their GitHub accounts
- Store all comments in GitHub Discussions
- Support reactions, replies, and markdown formatting

## Troubleshooting

If comments don't appear after setup:

1. Verify all prerequisites are completed
2. Check browser console for errors
3. Ensure the repository is public
4. Verify the repoId and categoryId values are correct
5. Try the configuration tool at https://giscus.app/ again

For more information, visit the official giscus documentation: https://github.com/giscus/giscus
