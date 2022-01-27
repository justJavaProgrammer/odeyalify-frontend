import {SearchedSongsResults} from "./dto/SearchedSongsResults";
import {SearchedArtistsResults} from "./dto/SearchedArtistsResults";
import {SearchedPlaylistResults} from "./dto/SearchedPlaylistResults";
import {SearchedAlbumsResults} from "./dto/SearchedAlbumsResults";


export class SearchResult {
  private _searchedSongResults?: SearchedSongsResults[] = [];
  private _searchedArtistsResults?: SearchedArtistsResults[] = [];
  private _searchedPlaylistResults?: SearchedPlaylistResults[] = [];
  private _searchedAlbumsResults?: SearchedAlbumsResults[] = [];

  constructor(searchedSongResults?: SearchedSongsResults[], searchedAlbumResults?: SearchedArtistsResults[], searchedPlaylistResults?: SearchedPlaylistResults[], searchedAlbumsResults?: SearchedAlbumsResults[]) {
    this._searchedSongResults = searchedSongResults;
    this._searchedArtistsResults = searchedAlbumResults;
    this._searchedPlaylistResults = searchedPlaylistResults;
    this._searchedAlbumsResults = searchedAlbumsResults;
  }

  get searchedSongResults(): SearchedSongsResults[] | undefined {
    return this._searchedSongResults;
  }

  set searchedSongResults(value: SearchedSongsResults[] | undefined) {
    this._searchedSongResults = value;
  }

  get searchedArtistsResults(): SearchedArtistsResults[] | undefined {
    return this._searchedArtistsResults;
  }

  set searchedArtistsResults(value: SearchedArtistsResults[] | undefined) {
    this._searchedArtistsResults = value;
  }

  get searchedPlaylistResults(): SearchedPlaylistResults[] | undefined {
    return this._searchedPlaylistResults;
  }

  set searchedPlaylistResults(value: SearchedPlaylistResults[] | undefined) {
    this._searchedPlaylistResults = value;
  }

  get searchedAlbumsResults(): SearchedAlbumsResults[] | undefined {
    return this._searchedAlbumsResults;
  }

  set searchedAlbumsResults(value: SearchedAlbumsResults[] | undefined) {
    this._searchedAlbumsResults = value;
  }
}
