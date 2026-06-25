# Johnson Lab fresh Next.js website

This is a complete fresh workspace. Use this folder as the working website project, instead of merging these files into an older project.

## What is included

- A simple professional landing homepage
- Separate pages for Team, Tools, Publications, and Contact
- A Tools dropdown with pages for:
  - SAMBA Behavioural Analysis Software
  - Integrative IMD Model Organism Explorer
- PubMed RSS integration through `lib/pubmed.ts`
- Extracted images from the supplied document in `public/images`
- Central content editing in `lib/site-data.ts`

## How to use

1. Unzip this folder.
2. Move the folder to a convenient location, for example your home folder.
3. Open the folder in Visual Studio Code.
4. In Terminal, run:

```bash
cd /path/to/johnson-lab-site-fresh
npm install
npm run dev
```

5. Open:

```text
http://localhost:3000
```

## Where to edit text

Most content is in:

```text
lib/site-data.ts
```

Edit this file to update:

- Research themes
- Team names and bios
- Contact details
- Tool descriptions
- Funding text

## Where to edit pages

```text
app/page.tsx
app/team/page.tsx
app/publications/page.tsx
app/contact/page.tsx
app/tools/page.tsx
app/tools/samba/page.tsx
app/tools/integrative-imd-model-organism-explorer/page.tsx
```

## Where to add images

Put images in:

```text
public/images
```

Then refer to them like:

```tsx
<img src="/images/my-image.jpg" alt="Description" />
```

## Publication feed

The PubMed RSS feed URL is stored in:

```text
lib/site-data.ts
```

The RSS parser is in:

```text
lib/pubmed.ts
```

The summary boxes are currently generated from the RSS text. True AI-generated summaries would require adding an API route and a private API key.
