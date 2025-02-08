export interface SearchResult {
    title: string;
    link: string;
    description: string;
  }
  
  export interface SearchResponse {
    results: SearchResult[];
    total: number;
    searchTime: number;
  }