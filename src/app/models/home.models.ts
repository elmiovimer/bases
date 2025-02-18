export namespace ModelsHome{
  export interface ArticleI {
    title: string;
    desc: string;
    image: {
      url: string;
      desc: string;
    }
    id?: string;
  }

  export interface article2I{
    title: string;
    body: string;
    userId: number
    id?: number;
    time?: Date;
  }
}
