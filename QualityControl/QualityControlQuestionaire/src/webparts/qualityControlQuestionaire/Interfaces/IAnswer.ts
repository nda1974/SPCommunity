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
  answer1Remark?: number;
  answer1Description?: string;
  answer2?: boolean;
  answer2Remark?: number;
  answer2Description?: string;
  answer3?: boolean;
  answer3Remark?: number;
  answer3Description?: string;
  answer4?: boolean;
  answer4Remark?: number;
  answer4Description?: string;
  answer5?: boolean;
  answer5Remark?: number;
  answer5Description?: string;
  answer6?: boolean;
  answer6Remark?: number;
  answer6Description?: string;
  ConcludingRemark?: number;
  ConcludingDescription?: string;
}
