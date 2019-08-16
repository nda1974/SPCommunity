import { IPickerTerms } from "@pnp/spfx-property-controls/lib/PropertyFieldTermPicker";

export interface IDefaultProps {
  description: string;
  targetListId:string;
  targetSiteUrl:string;
  listItems:any[];
  

  //*** solution specific properties ***//
  // SR - Medlemsgrupper //
  medlemsGruppe:IPickerTerms;
}
