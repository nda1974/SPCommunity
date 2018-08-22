import { ReactPropTypes } from "react";

export interface INewsItemProps {
  documentTitle: string;
  documentDescription: string;
  previewImageUrl:string;
  sender:string;
  priority:number;
  fileRef:string;

}
