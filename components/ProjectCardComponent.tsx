import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { project_object } from '@/app/types/search';
import ProjectDialogComponent from './ProjectDialogComponent';
const ProjectCardComponent = ({ object }: { object: project_object }) => {
  const [showdialog, setshowdialog] = useState(false)
  return (  
    <div className="flex gap-2 border justify-between hover:backdrop-contrast-90" key={object.project_id} onClick={()=>setshowdialog(true)}>
        {showdialog?<ProjectDialogComponent onclose={()=>setshowdialog(false)} projectid={object.project_id}/>:null}
        <div className="flex size-full gap-2">
          <img src={object.icon_url} alt="" className="size-1/12" />
          <div className="flex flex-col py-2">
            <p className="font-bold">{object.title}</p>
            <p className="text-xs">{object.description}</p>
            <p className={`border w-fit p-1 text-xs`}>Latest Version: {object.versions[object.versions.length - 1]}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button variant="outline" className="cursor-pointer">Download</Button>
          <p className="text-sm mx-1">{new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 2 }).format(object.downloads)}</p>
        </div>
      </div>
  )
}

export default ProjectCardComponent