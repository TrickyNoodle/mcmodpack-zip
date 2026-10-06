import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { project_object } from '@/app/types/search';
import ProjectDialogComponent from './ProjectDialogComponent';
const ProjectCardComponent = ({ object }: { object: project_object }) => {
  const [showdialog, setshowdialog] = useState(false)
  return (
    <div className="flex gap-2 border justify-between hover:backdrop-contrast-90" key={object.project_id} onClick={() => { setshowdialog(true) }}>
      {showdialog ? <ProjectDialogComponent onclose={() => setshowdialog(false)} projectid={object.project_id} /> : null}
      <div className="flex gap-2 w-full items-center">
        <img src={object.icon_url} alt="" className="size-24" />
        <div className="flex flex-col py-2">
          <p className="font-bold">{object.name}</p>
          <p className="text-xs">{object.summary}</p>
          <div className='flex gap-2'>
            <p className={`border w-fit p-1 text-xs bg-foreground text-background`}>Latest Version: {object.game_versions[object.game_versions.length - 1]}</p>
            <div className='flex'>
              {object.categories.map((e) => {
                return (
                  <p className='border p-1 text-xs bg-accent size-fit'>{e}</p>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center border-l">
        <p className="text-sm mx-1 text-center">Downloads {new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 2 }).format(object.downloads)}</p>
      </div>
    </div>
  )
}

export default ProjectCardComponent