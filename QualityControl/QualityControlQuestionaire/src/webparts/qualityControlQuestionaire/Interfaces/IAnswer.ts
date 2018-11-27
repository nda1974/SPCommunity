import { IQCUser } from "./IQCUser";

export interface IAnswer {
  listItemId?:number;
  batchID?: string;
  claimID?: string;
  dataExtractionID?: string;
  controlSubmmitted?:boolean;
  priviligedUser?: IQCUser;
  employeeInFocus?: IQCUser;
  employeeInFocusDisplayName?:string;
  department?: string;
  answer1?: boolean;
  answer1Description?: string;
  answer2?: boolean;
  answer2Description?: string;
  answer3?: boolean;
  answer3Description?: string;
  answer4?: boolean;
  answer4Description?: string;
  answer5?: boolean;
  answer5Description?: string;
  answer6?: number;
}
