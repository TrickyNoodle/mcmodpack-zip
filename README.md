# PackZip

**Find Minecraft modpacks on Modrinth and download them as ready-to-use ZIP files.**

PackZip turns a Modrinth modpack version into a ZIP containing its downloadable dependencies and included overrides, such as configuration files. Search for a pack, choose a version, and build the archive right in your browser.

**Try it:** [trickynoodle.github.io/mcmodpack-zip](https://trickynoodle.github.io/mcmodpack-zip)

## Features

- Search Modrinth's modpack catalog, with paginated results.
- Browse project details, versions, loaders, and included dependencies.
- Download the latest version or choose a specific version.
- Package version dependencies and the modpack's `overrides` into a ZIP.
- Generate the archive in your browser; PackZip does not upload your files to its own server.

## How to use

1. Open [PackZip](https://trickynoodle.github.io/mcmodpack-zip).
2. Search for a modpack by name or keyword.
3. Open a result to view its details and available versions.
4. Choose a version, then select **Download**. Use **Download Latest Version** for the newest version.
5. Once the ZIP is ready, use it with your preferred launcher or extract its contents as needed.

## Run locally

You'll need Node.js 20.9 or newer and npm.

```bash
git clone https://github.com/TrickyNoodle/mcmodpack-zip.git
cd mcmodpack-zip
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Create the static production export in `out/`. |
| `npm run start` | Start the Next.js production server. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Check TypeScript types. |

## Deployment

The project is configured for static export and GitHub Pages deployment. Pushing to `main` runs the workflow in [`.github/workflows/nextjs.yml`](.github/workflows/nextjs.yml), which builds the site and publishes the `out/` directory. You can also run the workflow manually from the repository's **Actions** tab.

## Notes

- Search, project information, version metadata, and mod files are fetched from Modrinth. Using PackZip requires an internet connection and availability of the Modrinth API and file hosts.
- ZIP creation happens in the browser, so very large packs may take time or use significant memory.
- PackZip is an independent community project and is not affiliated with or endorsed by Modrinth or Mojang Studios. Modpack and mod creators retain their respective rights; follow their licenses and distribution terms.

## Contributing

Bug reports, feature ideas, and pull requests are welcome. Please open an issue or submit a pull request in this repository.
