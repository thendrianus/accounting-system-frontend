import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, } from '@angular/http';
import { Observable, concat, } from 'rxjs';
//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
declare var qz: any;

@Injectable({
  providedIn: 'root'
})
export class QzTrayService {

  private headers;
  public listPrinters: any = [];
  public defaultPrinter: any = ""
  constructor(
    private http: Http
  ) {
    qz.api.setPromiseType(function promise(resolver) { return new Promise(resolver); });  
    this.setCertificatePromise()
    this.setSignaturePromise()

    this.getPrinters().subscribe(e => {
      localStorage.setItem("listPrinters", JSON.stringify(e))
      this.getDefault().subscribe(e => {
        localStorage.setItem("defaultPrinter", e.toString())
      }, err => {
        console.log(err)
      })
    }, err => {
      console.log(err)
    })

  }

  setCertificatePromise() {

    let promise = qz.security.setCertificatePromise((resolve, reject) => {
      this.http.post("http://localhost:50000/api/report/sign", {}).subscribe((e: any) => {
        resolve(e.text());
      }, err => {
        console.log(err)
        reject();
      })
    });
    return promise;
  }

  setSignaturePromise() {
    let promise = qz.security.setSignaturePromise(toSign => {
      return (resolve, reject) => {
        this.http.get("http://localhost:50000/api/report/sign/" + toSign).subscribe((e: any) => {
          resolve(e.text());
        }, err => {
          console.log(err)
          reject();
        })
      }
    });

    return promise;
  }

  errorHandler(error: any): Observable<any> {
    return Observable.throw(error);
  }
  // Get list of printers connected
  getPrinters(): Observable<string[]> {
    return Observable
      .fromPromise(qz.websocket.connect().then(() => qz.printers.find()))
      .map((printers: string[]) => printers)
    // .catch(this.errorHandler);

  }

  getDefault(): Observable<string[]> {
    return Observable
      .fromPromise(qz.printers.getDefault())
      // .map((printers: string[]) => printers)
    // .catch(this.errorHandler);

  }

  // Get the SPECIFIC connected printer
  getPrinter(printerName: string): Observable<string> {
    return Observable
      .fromPromise(qz.websocket.connect().then(() => qz.printers.find(printerName)))
      .map((printer: string) => printer)
    // .catch(this.errorHandler);
  }
  // Print data to chosen printer
  printData(printer: string, data: any): Observable<any> {
    // Create a default config for the found printer
    const config = qz.configs.create(printer);
    return Observable.fromPromise(qz.print(config, data))
      .map((anything: any) => anything)
    // .catch(this.errorHandler);
  }
  // Disconnect QZ Tray from the browser
  removePrinter(): void {
    qz.websocket.disconnect();
  }
  
}