import { IQuestions } from "../../Interfaces/IQuestions";
import { IAnswer } from "../../Interfaces/IAnswer";

export interface IAppState {
  questions:IQuestions;
  answers:IAnswer;
}
