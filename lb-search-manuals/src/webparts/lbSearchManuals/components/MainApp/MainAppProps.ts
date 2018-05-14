import WebPartContext from '@microsoft/sp-webpart-base/lib/core/WebPartContext';
export interface IMainAppProps {
    manualType: string;
    webPartContext:WebPartContext;
    searchUrl:string;
  }