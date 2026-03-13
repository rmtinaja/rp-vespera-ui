export interface Submodule {
  id: number
  submodule_name: string
  route: string
}

export interface Module {
  id: number
  module_name: string
  submodules: Submodule[]
}