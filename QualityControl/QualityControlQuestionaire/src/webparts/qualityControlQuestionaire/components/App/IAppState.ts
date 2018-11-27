import { IQuestions } from "../../Interfaces/IQuestions";
import { IAnswer } from "../../Interfaces/IAnswer";
import { ICurrentUser } from "../../../../Interfaces/ICurrentUser.";
import { IQCUser } from "../../Interfaces/IQCUser";

export interface IAppState {
  questions:IQuestions;
  answersList:IAnswer[];
  answers:IAnswer;
  currentUser:ICurrentUser;
  showPanel:boolean;
  currentAnswerId:number;
  itemInContext:IAnswer;
  employeeInFocus:IQCUser;
}
