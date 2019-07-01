import { IWebPartContext } from "@microsoft/sp-webpart-base";

export interface IAppProps {
  webPartHeader: string;
  testURL: boolean;
  ctx:IWebPartContext;
}
