import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import pnp, {  setup } from "sp-pnp-js";
import * as strings from 'LbCorporateNewsWebPartStrings';
import App from './components/App/App';
import { IAppProps } from './components/App/IAppProps';

export interface ILbCorporateNewsWebPartProps {
  description: string;
  itemName:string;
}

export default class LbCorporateNewsWebPart extends BaseClientSideWebPart<ILbCorporateNewsWebPartProps> {
  private selectedFilter:IPropertyPaneDropdownOption[]=[];
  private lists: IPropertyPaneDropdownOption[];
  private listsDropdownDisabled: boolean = true;

  public render(): void {
    const element: React.ReactElement<IAppProps > = React.createElement(
      App,
      {
        webPartContext:this.context,
        filter:this.properties.itemName
      }
    );

    ReactDom.render(element, this.domElement);

  }
  // protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
  //   this.selectedFilter.push({key:newValue,text:newValue});
  //   this.context.propertyPane.refresh();
  //   this.context.statusRenderer.clearLoadingIndicator(this.domElement);
  //   this.render();

  //   //super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  // //   // let listOptions: IPropertyPaneDropdownOption[]=[];
  // //   // listOptions.push({key:newValue,text:newValue})
  // //   // this.lists=listOptions;




  // //   // this.selectedFilter=newValue;
  // //   // this.context.propertyPane.refresh();
  // //   // this.context.statusRenderer.clearLoadingIndicator(this.domElement);
  // //   // this.render();



  // //   super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  // //     this.selectedFilter=newValue;
  // //     // get previously selected item
  // //     const previousItem: string = this.properties.itemName;
  // //     // reset selected item
  // //     this.properties.itemName = undefined;
  // //     // push new item value
  // //     this.onPropertyPaneFieldChanged('itemName', previousItem, this.properties.itemName);
  // //     // refresh the item selector control by repainting the property pane
  // //     this.context.propertyPane.refresh();
  // //     // communicate loading items
  // //     this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'items');
 
  // //     this.render();





  // //   // if (propertyPath === 'listName' &&
  // //   //     newValue) {
  // //   //   // push new list value
  // //   //   super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  // //   //   // get previously selected item
  // //   //   const previousItem: string = this.properties.itemName;
  // //   //   // reset selected item
  // //   //   this.properties.itemName = undefined;
  // //   //   // push new item value
  // //   //   this.onPropertyPaneFieldChanged('itemName', previousItem, this.properties.itemName);
  // //   //   // disable item selector until new items are loaded
  // //   //   this.itemsDropdownDisabled = true;
  // //   //   // refresh the item selector control by repainting the property pane
  // //   //   this.context.propertyPane.refresh();
  // //   //   // communicate loading items
  // //   //   this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'items');
 
  // //   //   this.loadItems()
  // //   //     .then((itemOptions: IPropertyPaneDropdownOption[]): void => {
  // //   //       // store items
  // //   //       this.items = itemOptions;
  // //   //       // enable item selector
  // //   //       this.itemsDropdownDisabled = false;
  // //   //       // clear status indicator
  // //   //       this.context.statusRenderer.clearLoadingIndicator(this.domElement);
  // //   //       // re-render the web part as clearing the loading indicator removes the web part body
  // //   //       this.render();
  // //   //       // refresh the item selector control by repainting the property pane
  // //   //       this.context.propertyPane.refresh();
  // //   //     });
  // //   // }
  // //   // else {
  // //   //   super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  // //   // }
  // // }
  
  // protected get disableReactivePropertyChanges(): boolean { 
  //   return true; 
  // }
  // protected onAfterPropertyPaneChangesApplied()
  // {
  //   let a:string="";
    
  // }
  protected onPropertyPaneConfigurationStart(): void {
    this.listsDropdownDisabled = !this.lists;
 
    if (this.lists) {
      return;
    }
 
    this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'Vent venligst..');
 
    let listOptions: IPropertyPaneDropdownOption[]=[];
    listOptions.push({key:"",text:""})
    pnp.sp.web.lists.getByTitle("NyhedsAfsendere")
    .items
    .select()
    .get()
    .then((items: any[]) => {
      items.map((i)=>{
        listOptions.push({key:i.Title,text:i.Title})
      })
          this.lists = listOptions;
          this.listsDropdownDisabled = false;
          this.context.propertyPane.refresh();
          this.context.statusRenderer.clearLoadingIndicator(this.domElement);
          this.render();
    });
  }


  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Her vælger du hvilken Sektion der er afsender af nyheden, så vises den både på forsiden af Intranette og på Sektionens egen forside"
          },
          groups: [
            {
              groupName: "",
              groupFields: [
                PropertyPaneDropdown('itemName', {
                  label:"Angiv afsender sektion",
                  options: this.lists,
                  disabled: this.listsDropdownDisabled
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
