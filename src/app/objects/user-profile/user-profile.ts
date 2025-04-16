export class UserProfileObject {    
    constructor(    
        public userId: number,
        public accountId: number,
        public profileId: number,
        public name: string,
        public email: string,
        public phone: string,
        public address: string,
        public zip: number,
        public photoURL: string,
        public isActive: number,
        public skills: string
    ){}    
}
