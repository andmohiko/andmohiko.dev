export type Work = {
  id: string
  body: string
  link: string
  publishAt: string
  tags: string[]
  thumbnail: {
    height: number;
    url: string;
    width: number;
  }
  title: string
}
