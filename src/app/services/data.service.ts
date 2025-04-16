import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DayPilot } from "@daypilot/daypilot-lite-angular";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  events: any[] = [
    {
      id: 1,
      start: "2024-09-30T10:00:00",
      end: "2024-09-30T12:00:00",
      text: "Event 1",
      resource: "R1",
      barColor: "#f1c232"
    },
    {
      id: 2,
      start: "2024-10-01T13:00:00",
      end: "2024-10-01T15:00:00",
      text: "Event 2",
      resource: "R2"
    }
  ];

  resources: any[] = [
    { name: "Resource 1", id: "R1" },
    { name: "Resource 2", id: "R2" },
    { name: "Resource 3", id: "R3" },
    { name: "Resource 4", id: "R4" },
    { name: "Resource 5", id: "R5" },
    { name: "Resource 6", id: "R6" },
    { name: "Resource 7", id: "R7" },
    { name: "Resource 8", id: "R8" }
  ];

  constructor(private http: HttpClient) {}

  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {
    console.log('getEvents called with from:', from, 'to:', to);
    
    // simulating an HTTP request
    return new Observable(observer => {
      console.log('Inside Observable');
      console.log('Returning events:', this.events);
      observer.next(this.events);
      observer.complete();
    });

  }

  getEvents2(from: DayPilot.Date, to: DayPilot.Date){

    console.log('getEvents called with from:', from, 'to:', to);
    return this.events;
  }
}
