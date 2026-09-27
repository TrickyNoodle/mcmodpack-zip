import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from './ui/button'
import { projectinformation, projectversion } from '@/app/types/project'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

const ProjectDialogComponent = ({ onclose, projectid }: { onclose: () => void, projectid: string }) => {
    const [projectinfo, setProjectinfo] = useState<projectinformation>()
    const [projectversions, setprojectversions] = useState<Array<projectversion>>();
    useEffect(() => {
        async function run() {
            let data: any = await fetch("https://api.modrinth.com/v2/project/" + projectid)
            data = await data.json()
            setProjectinfo(data);
            data = await fetch("https://api.modrinth.com/v2/project/" + projectid + "/version")
            data = await data.json()
            setprojectversions(data);
        }
        run()
    })
    async function download(version?:string) {
        if(version==undefined){
            const response=await fetch(projectversions?.filter((e)=>{return e.loaders.includes("fabric")})[0].files[0].url as string)
            const blob=await response.blob() 
            const url=await window.URL.createObjectURL(blob)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download',projectversions?.filter((e)=>{return e.loaders.includes("fabric")})[0].files[0].filename as string)
            link.click()
            document.removeChild(link)
        }
    }
    return (
        <Dialog defaultOpen onOpenChangeComplete={(open) => {
            if (!open)
                onclose()
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{projectinfo?.title}</DialogTitle>
                    <DialogDescription>
                        {projectinfo?.description}
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="about">
                    <TabsList variant="default" className="mx-auto w-full">
                        <TabsTrigger value="about">About</TabsTrigger>
                        <TabsTrigger value="versions">Versions</TabsTrigger>
                        <TabsTrigger value="gallery">Gallery</TabsTrigger>
                    </TabsList>
                    <TabsContent value="about" className="no-scrollbar max-h-[50vh] overflow-y-auto">
                        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{projectinfo?.body}</Markdown>
                    </TabsContent>
                    <TabsContent value="versions" className="max-h-[50vh] overflow-y-auto no-scrollbar flex flex-col gap-1">
                        {
                            projectinfo?.game_versions.flatMap((e) => {
                                return (
                                    <div className='border p-2 flex justify-between items-center hover:backdrop-contrast-90'>
                                        <p>{e}</p>
                                        <Button>Download</Button>
                                    </div>
                                )
                            })
                        }
                    </TabsContent>
                    <TabsContent value="gallery" className="max-h-[50vh] overflow-y-auto no-scrollbar flex flex-col gap-2">
                        {projectinfo?.gallery.flatMap((e) => {
                            return <div className='border'>
                                <img src={e.url} />
                                <div className='p-2'>
                                    <p>{e.title}</p>
                                    <p className='text-xs text-gray-400'>{e.description}</p>
                                </div>
                            </div>
                        })}
                    </TabsContent>
                </Tabs>
                <DialogFooter>
                    <Button onClick={()=>download()}>Download Latest Version ({projectinfo?.game_versions[projectinfo.game_versions.length-1]})</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

export default ProjectDialogComponent