// ponytail: minimal bootstrap index; regenerate via plugin install when using TS plugin overrides.
export const CustomOgImagesEmitterName = "CustomOgImages"

export type ContentDetails = {
  slug: string
  title: string
  filePath: string
  links: string[]
  tags: string[]
  content: string
}

export const plugins: Record<string, Record<string, (...args: unknown[]) => void>> = {}
