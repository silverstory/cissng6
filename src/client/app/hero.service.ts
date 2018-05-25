import { Injectable } from '@angular/core';
import { Hero } from './hero';
// import { HEROES } from './mock-heroes';

// import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';

import { MessageService } from './message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HeroService {

  // private heroesUrl = '/api';  // URL to web api ( for now, HttpClientInMemoryWebApiModule intercepts HTTP requests to this url )

  private api = '/api';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  // A service class is where you'll usually interact with a RESTful API

  // old getHeroes using RxJs 'of()'
  // getHeroes(): Observable<Hero[]> {
  //   return of(HEROES);
  // }

    /** GET heroes from the server */
  getHeroes (): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.api}/heroes`)
      .pipe(
        tap( ( heroes: Hero[] ) => {
          // no code needed here. just emiting values to subscriber.
          this.log(`fetched heroes`);
        }),
        // tap( heroes => this.log(`fetched heroes`)),
        catchError(this.handleError('getHeroes', []))
      );
  }

  // old getHero using RxJs 'of()'
  // getHero(id: number): Observable<Hero> {
  //   // Todo: send the message _after_ fetching the hero
  //   this.messageService.add(`HeroService: fetched hero id=${id}`);
  //   return of(HEROES.find(hero => hero.id === id));
  // }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: string): Observable<Hero> {
    const url = `${this.api}/hero/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap( ( hero: Hero ) => {
        // no code needed here. just emiting values to subscriber.
        this.log(`fetched hero id=${id}`);
      }),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** PUT: update the hero on the server */
  updateHero (hero: Hero): Observable<any> {
    const id = typeof hero === 'string' ? hero : hero._id;
    const url = `${this.api}/hero/${id}`;

    return this.http.put(url, hero, httpOptions).pipe(
      tap( ( hero: Hero ) => {
        // no code needed here. just emiting values to subscriber.
        this.log(`updated hero id=${hero._id}`);
      }),
      // tap(_ => this.log(`updated hero id=${hero._id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: add a new hero to the server */
  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this.api}/hero`, hero, httpOptions).pipe(
      tap( ( hero: Hero ) => {
        // no code needed here. just emiting values to subscriber.
        this.log(`added hero w/ id=${hero._id}`);
      }),
      // tap((hero: Hero) => this.log(`added hero w/ id=${hero._id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero (hero: Hero | string): Observable<Hero> {
    const id = typeof hero === 'string' ? hero : hero._id;
    const url = `${this.api}/hero/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap( ( hero: Hero ) => {
        // no code needed here. just emiting values to subscriber.
        this.log(`deleted hero id=${id}`);
      }),
      // tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  /* Fulltext search must be used in this API   */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`api/heroes/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  /** Log a HeroService message with the MessageService */
  public log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
