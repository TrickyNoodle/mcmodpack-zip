export type project_object={
    project_id:string
    project_type:string
    all_project_type:Array<string>
    title:string
    description:string
    categories:Array<string>
    author:string
    versions:Array<string>
    downloads:number
    icon_url:string
    latest_version:string
    name:string
    summary:string
    game_versions:Array<string>
}
export type search={
    hits:Array<project_object>
    offset:number
    limit:number
    total_hits:number
}