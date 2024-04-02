import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private httpClient: HttpClient) { }

  get(page: number, size: number, sort:string): Observable<any>{
    return this.httpClient.get("http://localhost:8080/employees?page="+page+"&size="+size+"&sort="+sort+"");
  }

  getById(id: number){
    return this.httpClient.get("http://localhost:8080/employees/"+id+"");
  }

  delete(id: number){
    return this.httpClient.delete("http://localhost:8080/employees/"+id+"");
  }

  post(data: any){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post("http://localhost:8080/employees", data, httpOptions);
  }

  put(id:number, data: any){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.put("http://localhost:8080/employees/"+id+"", data, httpOptions);
  }
}
