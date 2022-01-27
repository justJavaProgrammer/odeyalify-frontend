import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {SearchService} from "./service/SearchService";
import {Subject} from "rxjs";
import {SearchType} from "./SearchType";
import {SearchResult} from "./SearchResult";
import {SearchedSongsResults} from "./dto/SearchedSongsResults";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {TopResult} from "./TopResult";
import {AudioPlayerComponent} from "../audio-player/audio-player.component";
import {AudioPlayerService} from "../audio-player/AudioPlayerService";


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterViewInit {
  searchQuery: string = '';
  result: SearchResult = new SearchResult();
  picture: string = 'test.jpg';
  private value: string = '';
  topResult: TopResult = new TopResult();
  playButtonHover: boolean = false;
  private searchBoxInput: any;

  constructor(private searchService: SearchService, private location: Location, private router: Router,
              private activatedRoute: ActivatedRoute, private player: AudioPlayerService) {
    let urlSegment = activatedRoute.snapshot.url[1];
    if (urlSegment != undefined) {
      this.searchQuery = urlSegment.path;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.searchBoxInput = <HTMLInputElement>document.getElementById("search-box-input")
    this.searchBoxInput.focus();
    this.setInputValue(this.searchQuery);
    if (this.searchQuery.length > 0) {
      this.search();
    }
    if (this.searchQuery.length <= 0) {
      this.topResult = new TopResult();
      console.log(this.topResult)
    }
  }

  search(event?: KeyboardEvent) {
    console.log("Search by: " + this.searchQuery)
    if (event?.key == 'Escape') {
      this.escapeButtonPressEventHandler();
      return;
    }
    this.location.replaceState(`search/${this.searchQuery}`);
    if (this.searchQuery == '') {
      return this.emptySearchResult();
    } else {
      return this.searchService.searchByQuery(this.searchQuery, SearchType.ALL).subscribe(
        value => {
          this.result = this.decode(value);
        })
    }
    return '';
  }

  escapeButtonPressEventHandler() {
    this.searchQuery = '';
  }

  setInputValue(value: string) {
    console.log(value)
    this.searchBoxInput.value = value;
    console.log(this.searchBoxInput.value)
  }

  decode(value: any) {
    this.topResult = value.topResult;
    let searchedSongsResults = value.searchResultDTO.searchedSongsResults;
    let searchedAlbumResults = value.searchResultDTO.searchedAlbumsResults;
    let searchedPlaylistResults = value.searchResultDTO.searchedPlaylistResults;
    let searchedArtistsResults = value.searchResultDTO.searchedArtistsResults;
    return new SearchResult(searchedSongsResults, searchedArtistsResults, searchedPlaylistResults, searchedAlbumResults);
  }

  emptySearchResult() {
    this.topResult = new TopResult();
    this.result = new SearchResult([], [], [], [])
  }

  onHover() {
    this.playButtonHover = true;
  }

  mouseOut() {
    this.playButtonHover = false;
  }

  playAlbum(albumId: string): void {
    this.player.playAlbum(albumId)
  }
}


