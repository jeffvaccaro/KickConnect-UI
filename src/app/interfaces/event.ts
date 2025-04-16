export interface IEvent {
    eventId: number;
    eventName: string;
    eventDescription: string;
    isReservation: boolean;
    reservationCount: number;
    isCostToAttend: boolean;
    costToAttend: number;
    isActive: boolean;
    createdBy: string,
    accountId?: number
}
