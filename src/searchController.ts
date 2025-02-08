import { Request, Response } from "express";
import { SearchService } from "./searchService";

export class SearchController {
  private searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }

  async searchWithApi(req: Request, res: Response): Promise<void> {
    try {
      const { query, apiKey, limit = 10 } = req.query;

      if (!query || typeof query !== "string") {
        res.status(400).json({ error: "Search query is required" });
        return;
      }

      if (!apiKey || typeof apiKey !== "string") {
        res.status(400).json({ error: "2captcha API key is required" });
        return;
      }

      const results = await this.searchService.googleSearchWithApi(
        query,
        apiKey,
        Number(limit)
      );
      res.json({ results });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Failed to perform search" });
    }
  }

  async searchManual(req: Request, res: Response): Promise<void> {
    try {
      const { query, limit = 10 } = req.query;

      if (!query || typeof query !== "string") {
        res.status(400).json({ error: "Search query is required" });
        return;
      }

      const results = await this.searchService.googleSearchManual(
        query,
        Number(limit)
      );
      res.json({ results });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Failed to perform search" });
    }
  }
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { query, limit = 10 } = req.query;

      if (!query || typeof query !== "string") {
        res.status(400).json({ error: "Search query is required" });
        return;
      }

      const results = await this.searchService.googleSearchManual(
        query,
        Number(limit)
      );
      res.json({ results });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Failed to perform search" });
    }
  }
}
