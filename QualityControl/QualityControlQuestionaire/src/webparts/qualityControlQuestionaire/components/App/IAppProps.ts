import { IWebPartContext } from "@microsoft/sp-webpart-base";

export interface IAppProps {
  webPartHeader: string;
  delegeteToPriviligedUser: string;
  testURL: boolean;
  ctx:IWebPartContext;
}
