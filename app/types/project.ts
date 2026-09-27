export type projectgallery={
    url:string
    title:string
    description:string
}
export type projectinformation={
    id:string
    title:string
    body:string
    status:string
    project_type:string
    categories:string
    environment:string
    game_versions:Array<string>
    loaders:string
    versions:Array<String>
    gallery:Array<projectgallery>
    icon_url:string
    description:string
}
export type projectversion={
    name:string
    version_number:string
    game_versions:Array<string>
    version_type:string
    loaders:Array<string>
    id:string
    dependencies:Array<projectdependencies>
    files:Array<projectfiles>
}
export type projectdependencies={
    version_id:string
    project_id:string
    file_name:string
    dependency_type:string
}
export type projectfiles={
    hashes:{
        sha512:String
        sha1:string
    }
    url:String
    filename:String
    size:string
}