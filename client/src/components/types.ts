export type Data = {
  _id: string
  createdAt: string
  errorFields: string[]
  resolved: string[]
  writtenFiles: string[]
  errorsCount: number
  heatmap: Record<number, [number | boolean, number, Record<string, number>]>
  graph: any
  plots: Record<number, any[]>
}
