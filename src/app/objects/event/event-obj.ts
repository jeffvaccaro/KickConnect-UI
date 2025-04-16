export class EventObj {
    constructor(
        public eventId: number,
        public eventName: string,
        public eventDescription: string,
        public isActive: boolean,
        public createdBy: string,
        public accountId?: number
    ){}
}
