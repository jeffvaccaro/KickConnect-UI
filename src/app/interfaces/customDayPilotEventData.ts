import { DayPilot } from "@daypilot/daypilot-lite-angular";

export interface ICustomDayPilotEventData extends DayPilot.EventData {
    accountId?: number;
    scheduleMainId?: number;
    scheduleLocationId?: number;
    existingEventId: number;
    existingEventName: string;
    existingEventValue: string;
    existingEventDescription: string;
    isRepeat: boolean;
    scheduleId?: number;
    isActive: boolean;
    selectedDate: Date;
    selectedTime: string;
    startTime: string;
    endTime: string;
    locationValues: number;
    day: number;
    duration: number;
    isReservation: boolean,
    reservationCount: number,
    isCostToAttend: boolean,    
    costToAttend: number,
    profileId: number,
    altProfileId: number    
}
