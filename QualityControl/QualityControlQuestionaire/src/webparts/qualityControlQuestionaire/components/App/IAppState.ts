import { IQuestions } from "../../Interfaces/IQuestions";
import { IAnswer } from "../../Interfaces/IAnswer";
import { ICurrentUser } from "../../../../Interfaces/ICurrentUser.";

export interface IAppState {
  questions:IQuestions;
  answersList:IAnswer[];
  answers:IAnswer;
  currentUser:ICurrentUser;
  showPanel:boolean;
}
