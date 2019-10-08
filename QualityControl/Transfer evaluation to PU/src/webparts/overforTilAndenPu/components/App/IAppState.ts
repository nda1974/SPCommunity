import { ICurrentUser } from "../../Interfaces/ICurrentUser";

export interface IAppState {
  description: string;
  evaluationItems:any[];
  priviledgedUsersItems:any[];
  currentUser:ICurrentUser;
  currentUsersDepartment:string;
  selectedEvaluations:number[];
  selectedUserId:number;
}
