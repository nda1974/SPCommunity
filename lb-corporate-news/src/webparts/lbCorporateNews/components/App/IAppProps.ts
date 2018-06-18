import WebPartContext from '@microsoft/sp-webpart-base/lib/core/WebPartContext';
import {
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';

export interface IAppProps {
  webPartContext:WebPartContext;
  filter:string;
  // selectedFilter:string;
  
}
