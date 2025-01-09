export interface ActuType {
  version: string,
  notes: string,
  'pub-date': string,
  platforms: {
    window: {
      url: string
    },
    linux: {
      url: string
    }
  }
}