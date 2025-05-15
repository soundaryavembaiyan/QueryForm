import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  api: string;
  featureapi: string;

  constructor(private httpClient: HttpClient) {
    this.api = environment.apiUrl;
    this.featureapi = environment.apiUrl;
  }

  sendGetRequest(apiUrl: any) {
    let finalUrl = this.api + apiUrl;
    return this.httpClient.get(finalUrl, this.get_httpoptions());
  }

  sendPostRequest(apiUrl: any, data: any): Observable<Object> {
    let finalUrl = this.api + apiUrl;
    return this.httpClient.post(finalUrl, data, this.get_httpoptions());
  }

  sendPutRequest(apiUrl: any, data: any): Observable<Object> {
    let finalUrl = this.api + apiUrl;
    return this.httpClient.put(finalUrl, data, this.get_httpoptions());
  }

  sendPatchRequest(apiUrl: any, data: any): Observable<Object> {
    let finalUrl = this.api + apiUrl;
    return this.httpClient.patch(finalUrl, data, this.get_httpoptions());
  }

  sendUpdateRequest(apiUrl: any, data: any): Observable<Object> {
    let finalUrl = this.api + apiUrl;
    return this.httpClient.put(finalUrl, data, this.get_httpoptions());
  }

  sendDeleteRequest(apiUrl: any): Observable<Object> {
    let finalUrl = this.featureapi + apiUrl;
    return this.httpClient.delete(finalUrl, this.get_httpoptions());
  }
  
  get_httpoptions(responseType?: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + localStorage.getItem('TOKEN')
      }),
      responseType: responseType || 'json' // Default to 'json' if responseType is not provided
    };
    return httpOptions
  }

    // Get id for support
    getSupport(id: any) {
        return this.httpClient.get(`${environment.apiUrl}/${id}`, {
            headers: new HttpHeaders({
                "Authorization": "Bearer " + localStorage.getItem('TOKEN')
            })
        })
    }

  // Removed redundant constructor
}
