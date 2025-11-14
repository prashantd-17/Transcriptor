import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransliterationService {
  // private backendUrl = 'http://localhost:3000/api/translate'; // your Node server
  private backendUrl = 'https://thumbnail-backend-g1bn.onrender.com/api/translate'; // your Node server

   constructor(private http: HttpClient) {}

  transliterate(text: string, lang: string) {
    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=${lang}-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=transkriptr`;
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res[0] === 'SUCCESS') {
          return res[1][0][1]; // list of suggestions
        }
        return [];
      })
    );
  }

  //  // New translation method
  // translate(text: string, source: string, target: string) {
  //   const url = 'https://libretranslate.de/translate';
  //   const body = {
  //     q: text,
  //     source,
  //     target,
  //     format: 'text'
  //   };
  //   return this.http.post(url, body).pipe(map((res: any) => res.translatedText));
  // }

  translate(text: string, source: string, target: string) {
  // const url = 'http://localhost:3000/api/translate';
  const url = 'https://thumbnail-backend-g1bn.onrender.com/api/translate';
  const body = { q: text, source, target, format: 'text' };
  return this.http.post<any>(url, body);
}


   translateText(text: string, source: string, target: string): Observable<any> {
    const body = { q: text, source, target };
    return this.http.post(this.backendUrl, body);
  }

}
