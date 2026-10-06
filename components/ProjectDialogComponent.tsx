"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from './ui/button'
import { projectdependencies, projectinformation, projectversion } from '@/app/types/project'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Select, SelectContent, SelectItem, SelectValue } from './ui/select'
import { SelectTrigger } from './ui/select'
import { SelectGroup } from './ui/select'
import JSZip from 'jszip'
import { toast } from 'sonner'

const ProjectDialogComponent = ({ onclose, projectid }: { onclose: () => void, projectid: string }) => {
    const [projectinfo, setProjectinfo] = useState<projectinformation>()
    const [projectversions, setprojectversions] = useState<Array<projectversion>>([]);
    const [includedmods, setincludedmods] = useState<Array<projectinformation>>([]);
    const [loader, setloader] = useState<string>();
    const [version, setversion] = useState<string>();
    useEffect(() => {
        async function run() {
            let data: any = await fetch("https://api.modrinth.com/v2/project/" + projectid)
            data = await data.json()
            setProjectinfo(data);
            data = await fetch("https://api.modrinth.com/v2/project/" + projectid + "/version")
            data = await data.json()
            setprojectversions(data);
            const dependenciespromises = data[0].dependencies.filter((e: projectdependencies) => { return e.project_id != null }).map(async (e: projectdependencies) => {
                try {
                    const response: any = await fetch("https://api.modrinth.com/v2/project/" + e.project_id)
                    return await response.json();
                }
                catch (err) {
                    return null;
                }
            })
            const alldependencies = await Promise.all(dependenciespromises)
            setincludedmods((prevmods) => [...prevmods, ...alldependencies])
        }
        run()
    }, [])
    async function download(version?: string) {
        const process = toast.loading("Downloading Mods")
        try {
            const modszip = new JSZip()
            toast.loading("Fetching Version Information", { id: process })
            let response: any = await fetch("https://api.modrinth.com/v2/version/" + version)
            response = await response.json()
            const versioninfo: projectversion = response
            if (projectinfo?.project_type == "modpack") {
                let moddownloads = 0
                const dependencies = await versioninfo.dependencies.filter((e) => { return e.version_id != null }).flatMap(async (e: projectdependencies) => {
                    const result = await fetch("https://api.modrinth.com/v2/version/" + e.version_id)
                    const res: projectversion = await result.json();
                    const primary = res.files.find((e) => { return e.primary == true })
                    const file = await fetch(primary?.url as string)
                    if (res.loaders.includes("minecraft"))
                        modszip.file("resourcepacks/" + primary?.filename, await file.blob())
                    else
                        modszip.file("mods/" + primary?.filename, await file.blob());
                    moddownloads += 1;
                    toast.loading("Downloading Mods " + moddownloads + "/" + versioninfo.dependencies.length, { id: process })
                })
                await Promise.all(dependencies)
                toast.loading("Checking for Config Files and Overrides", { id: process })
                const mrpack = await fetch(versioninfo.files.find((e) => { return e.primary == true })?.url as string)
                const mrpackzip = await JSZip.loadAsync(mrpack.blob())
                const overrides = await mrpackzip.filter((path, file) => {
                    return path.includes("overrides")
                })
                await overrides.map((e) => {
                    if (!e.dir)
                        modszip.file(e.name.replace("overrides/", ""), e.nodeStream())
                })
                toast.loading("Creating Final Zip", { id: process })
                const blob = modszip.generateAsync({
                    type: "blob"
                })
                const downloadlink = document.createElement('a')
                const bloburl = await window.URL.createObjectURL(await blob)
                downloadlink.setAttribute("download", versioninfo.files[0].filename + ".zip")
                downloadlink.href = await bloburl
                downloadlink.click()
                URL.revokeObjectURL(bloburl)
                toast.success("ModPack Zip Created", { id: process })
            }
        }
        catch (error) {
            toast.error("Failed," + error, { id: process })
        }
    }
    return (
        <Dialog defaultOpen onOpenChangeComplete={(open) => {
            if (!open)
                onclose()
        }}>
            <DialogContent className="flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><img src={projectinfo?.icon_url} className='size-12' />{projectinfo?.title}</DialogTitle>
                    <DialogDescription>
                        {projectinfo?.description}
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="about">
                    <TabsList variant="default" className="w-full">
                        <TabsTrigger value="about">About</TabsTrigger>
                        <TabsTrigger value="versions">Versions</TabsTrigger>
                        <TabsTrigger value="gallery">Gallery</TabsTrigger>
                        <TabsTrigger value="includes">Mods Included</TabsTrigger>
                    </TabsList>
                    <TabsContent value="about" className="overflow-auto max-h-[50vh] scrollbar-none">
                        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{projectinfo?.body}</Markdown>
                    </TabsContent>
                    <TabsContent value="versions" className="overflow-auto max-h-[50vh] scrollbar-none flex flex-col gap-2">
                        <div className='flex justify-center items-center gap-2 '>
                            <Select onValueChange={(e) => { setloader(e as string) }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Loader" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {projectinfo?.loaders.map((e) => {
                                            return (
                                                <SelectItem key={e} value={e}>
                                                    {e}
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(e) => {setversion(e as string)}}>
                                <SelectTrigger >
                                    <SelectValue placeholder="All Versions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {projectinfo?.game_versions.toReversed().map((e) => {
                                            return (
                                                <SelectItem key={e} value={e}>
                                                    {e}
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {
                            projectversions?.length == 0 ? <p className='text-center font-bold'>This modpack/mod doesnt have any releases yet</p> : projectversions?.filter((e)=>{return version==undefined?true:e.game_versions.includes(version)}).filter((e) => { { return loader == undefined ? true : e.loaders.includes(loader as string) } }).flatMap((e) => {
                                return (
                                    <div key={e.id} className='border p-2 flex justify-between items-center hover:backdrop-contrast-90'>
                                        <div>
                                            <p className='font-bold'>{e.game_versions.join(", ")}</p>
                                            <p className='text-xs text-gray-300 font-extralight hover:underline'>{e.name}</p>
                                        </div>
                                        <Button onClick={() => download(e.id)}>Download</Button>
                                    </div>
                                )
                            })
                        }
                    </TabsContent>
                    <TabsContent value="gallery" className="overflow-auto max-h-[50vh] scrollbar-none flex flex-col gap-2">
                        {projectinfo?.gallery.length == 0 ? <p className='font-bold text-center'>This modpack/mod doesnt have any Photos</p> : projectinfo?.gallery.flatMap((e) => {
                            return <div className='border' key={e.url}>
                                <img src={e.url} />
                                <div className='p-2 flex-wrap wrap-anywhere'>
                                    <p>{e.title}</p>
                                    <p className='text-xs text-gray-400'>{e.description}</p>
                                </div>
                            </div>
                        })}
                    </TabsContent>
                    <TabsContent value={"includes"} className="overflow-auto max-h-[50vh] scrollbar-none flex flex-col gap-2">
                        {includedmods.length == 0 ? <p className='text-center font-bold'>This modpack/mod doesnt have any dependencies</p> :
                            <>
                                <p className='text-center'>Contains {includedmods.length} mods</p>
                                {
                                    includedmods.flatMap((e: projectinformation) => {
                                        if (e != null)
                                            return (
                                                <div key={e.id} className='border flex hover:backdrop-contrast-75'>
                                                    <img src={e.icon_url} alt="" className='size-1/6'/>
                                                    <p className='flex items-center p-2'>{e.title}</p>
                                                </div>
                                            )
                                    })
                                }
                            </>
                        }
                    </TabsContent>
                </Tabs>
                <DialogFooter>
                    <Button onClick={() => download(projectversions[0].id)}>Download Latest Version ({projectinfo?.game_versions[projectinfo.game_versions.length - 1]})({projectversions[0]?.loaders[0]})</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

export default ProjectDialogComponent