"use client"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useState } from "react"
import { search as SearchResult } from "./types/search"
import ProjectCardComponent from "@/components/ProjectCardComponent"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 10
const siteUrl = "https://mcmodpack-zip.vercel.app"

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "ellipsis")[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push("ellipsis")
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push("ellipsis")

  pages.push(total)
  return pages
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PackZip",
  applicationCategory: "GameApplication",
  operatingSystem: "Web",
  url: siteUrl,
  description:
    "Search and download Minecraft Modrinth modpacks as ready-to-use ZIP files with mods, configs, and overrides included.",
  inLanguage: "en",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  keywords: [
    "Minecraft modpacks",
    "Modrinth modpacks",
    "modpack downloader",
    "minecraft mods",
    "mrpack to zip",
  ],
}

export default function Page() {
  const [searchres, setsearchres] = useState<SearchResult | null>(null)
  const [issearching, setIssearching] = useState(false)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1) // 1-based

  const totalPages = searchres ? Math.ceil(searchres.total_hits / PAGE_SIZE) : 0

  async function fetchResults(term: string, pageNumber: number) {
    setIssearching(true)
    try {
      const res = await fetch(
        `https://api.modrinth.com/v3/search?query=${encodeURIComponent(term)}` +
          `&limit=${PAGE_SIZE}&offset=${(pageNumber - 1) * PAGE_SIZE}` +
          "&new_filters=project_types+=+`modpack`"
      )
      if (!res.ok) throw new Error("Bad response")
      const json: SearchResult = await res.json()
      setsearchres(json)
      setPage(pageNumber)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      toast.error("Failed to Search, Check ur Connection")
    } finally {
      setIssearching(false)
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const term = String(new FormData(e.currentTarget).get("searchterm") ?? "")
    setQuery(term)
    fetchResults(term, 1)
  }

  function goTo(e: React.MouseEvent, target: number) {
    e.preventDefault()
    if (target < 1 || target > totalPages || target === page || issearching) return
    fetchResults(query, target)
  }

  return (
    <main className="flex min-h-svh flex-col gap-6 bg-background p-6 text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="mx-auto flex w-full max-w-5xl flex-col gap-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Minecraft modpack toolbox
        </p>
        <h1 className="text-4xl font-black tracking-tight md:text-6xl">
          Download Minecraft Modpacks as a ZIP
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
          Search Modrinth for the best Minecraft modpacks and download them as ready-to-use ZIP files with mods,
          configs, and overrides included.
        </p>
      </header>

      <section className="mx-auto w-full max-w-5xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
          <label htmlFor="searchterm" className="sr-only">
            Search Minecraft modpacks
          </label>
          <Input
            id="searchterm"
            placeholder="Enter Modpack Name"
            name="searchterm"
            aria-label="Search Minecraft modpacks"
            className="h-12 flex-1 text-base"
          />
          <Button type="submit" className="h-12 px-6 text-sm font-semibold">
            Search Modpacks
          </Button>
        </form>
      </section>

      <section className="mx-auto w-full max-w-5xl flex flex-col gap-6">
        {issearching ? (
          <div className="flex min-h-60 items-center justify-center">
            <Spinner className="size-12" />
          </div>
        ) : searchres == null ? (
          <div className="rounded border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Start by searching for a Minecraft modpack to build a ZIP package.
          </div>
        ) : searchres.total_hits === 0 ? (
          <div className="rounded border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No Modpack Found related to your search. Try another name or keyword.
          </div>
        ) : (
          <>
            {totalPages > 1 && (
              <Pagination className="pt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      aria-disabled={page === 1}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                      onClick={(e) => goTo(e, page - 1)}
                    />
                  </PaginationItem>

                  {getPageNumbers(page, totalPages).map((p, i) => (
                    <PaginationItem key={p === "ellipsis" ? `e-${i}` : p}>
                      {p === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          onClick={(e) => goTo(e, p)}
                        >
                          {p}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      aria-disabled={page === totalPages}
                      className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                      onClick={(e) => goTo(e, page + 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
            {searchres.hits.map((object) => (
              <ProjectCardComponent object={object} key={object.project_id} />
            ))}
          </>
        )}
      </section>
    </main>
  )
}