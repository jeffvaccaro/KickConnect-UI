// created ISchedule to add customizations that ICustomDayPilotEventData didn't include.
export interface ISchedule {
    accountId: number,
    scheduleMainId: number,
    scheduleLocationId: number,
    eventId: number,
    eventName: string,
    eventDescription: string,
    day: number,
    startTime: string,
    endTime: string,
    locationValues: number,
    reservationCount: number,
    costToAttend: number,
    selectedDate: Date,
    selectedTime: string,
    duration: number,
    isRepeat: boolean,
    isActive: boolean,
    isReservation: boolean,
    isCostToAttend: boolean,
    profileId: number,
    altProfileId: number
}
