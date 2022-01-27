import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SearchType} from "../SearchType";

@Injectable({
    providedIn: "root"
})
export class SearchService {
  private searchUrlQuery: string = environment.baseUrl + "search/any?query="

  constructor(private httpClient: HttpClient) {
  }


  public searchByQuery(query: string, searchType: SearchType | undefined): Observable<any> {
    if (searchType == undefined)
      searchType = SearchType.ALL;
    let url = this.searchUrlQuery + query + "&type=" + searchType;
    console.log(url);
    return this.httpClient.get(url);
  }
}
