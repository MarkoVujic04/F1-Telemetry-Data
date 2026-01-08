export interface Favorite {
  id: string; 
  year: number;
  circuitName: string; 
  session: string;   
  addedAt: number;
}

export type FavoritesList = Favorite[];
