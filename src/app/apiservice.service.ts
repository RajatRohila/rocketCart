import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  constructor(private http: HttpClient, public SpinnerService: NgxSpinnerService, public cookieService: CookieService
    , public router: Router) {
  }

  urlAuthorization() {
    const currentUrl = this.router.url;
  }

  removeItemFromLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('allowPagesUrlMap');
    localStorage.removeItem('allowPagesUrl');
    localStorage.removeItem('allowModuleMap');
    localStorage.removeItem('userName');
    localStorage.removeItem('userID');
    localStorage.removeItem('isLogin');
  }
  /*setCookieAge() {
    const expire = new Date();
    const time = Date.now() + ((3600 * 1000) * 1); // current time + 1 hours ///
    expire.setTime(time);
    return expire;
  }*/

  saveData(url, data) {
    return this.getPostCall(url, data);
  }

  getPostCall(url, data) {
    try {
      let headers:  any;
      headers = {'Content-Type': 'application/json'};
      const response = this.http.post<any>(url, data, {headers});
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  getPutCall (url, data) {
    try {
      const headers = {'Content-Type': 'application/json'};
      const response = this.http.put(url, data, {headers: headers});
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  updateData(url, data) {
    return this.getPutCall(url, data);
  }

  public upload(data, url) {
    // const headers = {'Authorization': this.getAuthorizationToken()};
    return this.http.post<any>(url, data,  {
      reportProgress: true,
      observe: 'events',
      // headers: headers
    }).pipe(map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / event.total);
            return {status: 'progress', message: progress};

          case HttpEventType.Response:
            return event.body;
          default:
            return `Unhandled event: ${event.type}`;
        }
      })
    );
  }

  async getAll(url) {
    try {
      const headers = {'Content-Type': 'application/json'};
      const response = await this.http.get(url, {'headers': headers}).toPromise();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async findByAttributeName(url) {
    try {
      this.urlAuthorization();
      const headers = {'Content-Type': 'application/json'};
      const response = await this.http.get(url, {'headers': headers}).toPromise();
      return response;
    } catch (error) {
      console.log(error);
    }
  }


  public async deleteById(url) {
    try {
      this.urlAuthorization();
      const headers = {'Content-Type': 'application/json'};
      const response = await this.http.delete(url, {'headers': headers}).toPromise();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  public async findById(url) {
    try {
      const headers = {'Content-Type': 'application/json'};
      const response = await this.http.get(url, {'headers': headers}).toPromise();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  public async getCall(url) {
    try {
      const headers = {'Content-Type': 'application/json'};
      const response = await this.http.get(url, {'headers': headers}).toPromise();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  public async postCall(url, data ) {
    try {
      const headers = {'Content-Type': 'application/json'};
      const response = await this.http.post(url, data, {headers: headers}).toPromise();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  public async downloadExcel(url) {
    try {
      const response = await this.http.get(url, {responseType: 'blob'}).toPromise();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  public async fileDownloadByPostMethod(url, data) {
    try {
      const headers = {'Content-Type': 'application/json'};
      const response = await this.http.post(url, data, {headers: headers, responseType: 'blob'}).toPromise();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  public async fetchAllRecords(url) {
    try {
      const response = await this.http.get(url).toPromise();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  serviceableCouriers(url, data) {
    return this.getPostCall(url, data);
  }

  /*async downloadById(url) {
    try {
      this.urlAuthorization();
      const headers = {'Content-Type': 'application/json'};
      const response = await this.http.download(url, {'headers': headers}).toPromise();
      return response;
    } catch (error) {
      console.log(error);
    }
  }*/
  async downloadlDoc(url: string) {
    try {
      const response = await this.http.get(url, {responseType: 'blob'}).toPromise();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
