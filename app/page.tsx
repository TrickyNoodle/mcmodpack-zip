"use client"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { search } from "./types/search";
import { toast } from "@/components/ui/toast";
import ProjectCardComponent from "@/components/ProjectCardComponent";
export default function Page() {
  const [searchres, setsearchres] = useState<search | null>();
  const [searchfield, setsearchfield] = useState("");
  async function search() {
    try {
      let result: any = await fetch("https://api.modrinth.com/v2/search?query=" + searchfield);
      result = await result.json()
      setsearchres(result)
    }
    catch (error) {
      toast.add({
        title: "Failed to Get Results",
        type: "error"
      })
    }
  }
  return (
    <div className="flex min-h-svh p-6 flex-col gap-2">
      <form action={search}>
        <Input placeholder="Enter Modpack id or Name" onChange={(e) => setsearchfield(e.currentTarget.value)} />
      </form>
      {
        searchres == null ? "Search Something" :
          searchres?.total_hits == 0 ? "No Modpack Found releated to ur search" :
            searchres.hits.flatMap((object) => {
                // if (object.project_type == "modpack")
                return (
              <ProjectCardComponent object={object} key={object.project_id}/>
                )
            })

      }
    </div>
  )
}
