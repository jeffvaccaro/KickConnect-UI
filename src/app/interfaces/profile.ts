import { IUser } from "./user";

export interface IProfile extends IUser {
    profileDescription: string;
    profileSkills: string[];
    profileURL: string;
}
