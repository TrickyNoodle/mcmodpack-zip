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

const PAGE_SIZE = 10

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
    <div className="flex min-h-svh p-6 flex-col gap-2">
      <form onSubmit={handleSubmit}>
        <Input placeholder="Enter Modpack Name" name="searchterm" />
      </form>

      {issearching ? (
        <Spinner className="mx-auto my-auto size-1/24" />
      ) : searchres == null ? (
        "Start by Searching A Modpack"
      ) : searchres.total_hits === 0 ? (
        "No Modpack Found releated to ur search"
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
    </div>
  )
}