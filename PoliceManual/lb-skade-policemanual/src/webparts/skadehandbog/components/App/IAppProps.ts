import { IPickerTerms } from "@pnp/spfx-property-controls/lib/PropertyFieldTermPicker";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IAppProps {
  description: string;
  terms: IPickerTerms;
  webPartContext:WebPartContext;
}
