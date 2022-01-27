import {ArtistResponseDTO} from "./ArtistResponseDTO";

export interface SongDto {
  songId: string;
  songName: string;
  artistResponseDTO: ArtistResponseDTO;
  streamSongUrl: string;
  albumName: string;
  albumId: string;
  songCoverImage: string;
  auditions: number;
}

export interface RootObject {
  songDto: SongDto;
}
