import axios from 'axios'

type FilesPaths = Record<'catch' | 'product' | 'ext1' | 'ext2', string>

export class PythonClient {
  private static readonly url = 'http://10.10.0.2:8090'

  private static getUrl(path: string) {
    return PythonClient.url + path
  }

  static async getHeatmap(paths: FilesPaths) {
    const result = await axios.post(PythonClient.getUrl('/heatmap'), paths)
    return result
  }

  static async getPlots(paths: FilesPaths) {
    const result = await axios.post(PythonClient.getUrl('/plots'), paths)
    return result
  }
}
