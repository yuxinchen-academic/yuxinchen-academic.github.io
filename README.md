# Yuxin Chen — Academic Homepage

Personal academic website for Yuxin Chen, a Computer Science PhD student at The Hong Kong University of Science and Technology. Adapted from [PRISM](https://github.com/xyjoey/PRISM), with research-area publication groups and authorship-aware ordering.

**Website:** [yuxinchen-academic.github.io/yuxinchen-academic](https://yuxinchen-academic.github.io/yuxinchen-academic/)

## Develop locally

Use Node.js 22 or later.

```bash
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). The site uses Next.js static export; no database or server is required for hosting.

## Edit content

| Content | File |
| --- | --- |
| Name, affiliation, contact details, links, navigation | `content/config.toml` |
| Biography | `content/bio.md` |
| Homepage sections and research interests | `content/about.toml` |
| Publications | `content/publications.bib` |
| Publication page introduction | `content/publications.toml` |
| Education | `content/education.toml` |
| Awards | `content/awards.toml` |

Keep the displayed email obfuscated with `[dot]` in `content/config.toml`.

### Photograph

Place your photograph in `public/` (for example, `public/portrait.jpg`) and set `author.avatar = "/portrait.jpg"` in `content/config.toml`. Use an empty avatar value to show the initials fallback. The profile image uses CSS cropping, so the original photo file is preserved. Adjust the image's `object-position` in `src/components/home/Profile.tsx` if the crop needs repositioning.

### Publications

Use standard BibTeX metadata for the title, authors, venue, year and paper URL. These additional fields control the website:

| Field | Values / purpose |
| --- | --- |
| `category` | `Embodied AI & Robot Learning`, `Generative Models & Image Editing`, `Visual Perception`, or `Vision-Language Models & Safety` |
| `authorship` | `first`, `co-first`, or `other`, relative to Yuxin Chen |
| `project` | Project website URL |
| `code` | Source repository URL |
| `preview` | Original method/architecture image under `public/papers/methods/`; required for every paper |
| `description` | Short research summary |
| `selected` | `true` for the optional Selected Publications section; the current homepage lists all papers |

Each paper has an original method diagram, centered in a consistent image column. Clicking a diagram opens the full-resolution image. Research-area and year filters remain available.

Within each research area, publications appear in the order **first author → co-first author → other author**, then newest year and month first. The original author order is retained. Append `#` to each equal-contribution author's name and `*` to a corresponding author's name; the renderer adds the displayed markers and removes them from copied BibTeX. Authorship rank is specified explicitly, rather than inferred from these symbols.

Paper metadata was checked against paper PDFs and official project sources, with user-confirmed authorship corrections. Google Scholar blocked automated access with HTTP 403, so completeness against the live Scholar profile could not be verified. See [publication source notes](docs/publications-sources.md) for provenance and remaining uncertainties; the [Scholar profile](https://scholar.google.com/citations?user=fyewGpgAAAAJ&hl=en) remains linked from the website.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` checks TypeScript, builds the static site, and deploys `out/` on pushes to `main`. It can also be run manually from the repository's **Actions** tab. Repository **Settings → Pages → Source** must be set to **GitHub Actions**.

The workflow sets `NEXT_PUBLIC_BASE_PATH=/yuxinchen-academic` for this project URL. To reproduce the production build locally:

```bash
npx tsc --noEmit
NEXT_PUBLIC_BASE_PATH=/yuxinchen-academic npm run build
```

For a custom domain or a repository named `yuxinchen-academic.github.io`, update the workflow's base path and the canonical website URL in the source configuration before rebuilding. Generated `out/`, `.next/` and dependencies are ignored by Git.

## Attribution

Based on [PRISM](https://github.com/xyjoey/PRISM). The original MIT license is retained in [LICENSE](LICENSE).
