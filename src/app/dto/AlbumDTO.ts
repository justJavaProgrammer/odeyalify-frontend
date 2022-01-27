import {SongDto} from "./SongDTO";
import {ArtistResponseDTO} from "./ArtistResponseDTO";

export interface AlbumDTO {
  albumId: string;
  albumName: string;
  coverImageUrl: string;
  yearIssue: number;
  artistResponseDTO: ArtistResponseDTO;
  songs: SongDto[];
  songCount: number;
}
