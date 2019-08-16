import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneField, IPropertyPaneTextFieldProps } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import App from './components/App/App'

import { IAppProps } from './components/App/IAppProps';
import * as strings from 'LbListViewWebpartWebPartStrings';

import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy,IPropertyFieldListPickerProps, IPropertyFieldListPickerHostProps } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { PropertyFieldToggleWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldToggleWithCallout';
import { PropertyFieldTermPicker, IPickerTerms, IPropertyFieldTermPickerPropsInternal } from '@pnp/spfx-property-controls/lib/PropertyFieldTermPicker';
import { CalloutTriggers } from '@pnp/spfx-property-controls/lib/PropertyFieldHeader';
export interface ILbListViewWebpartWebPartProps {
  description: string;
  targetSiteUrl:string;
  lists: string; // Stores the list ID(s),
  standardSearchEnabled: boolean;
  //*** solution specific properties ***//
  // SR - Medlemsgrupper //
  medlemsGruppe:IPickerTerms;
}

export default class LbListViewWebpartWebPart extends BaseClientSideWebPart<ILbListViewWebpartWebPartProps> {
  protected onInit(): Promise<void> {

    return new Promise<void>((resolve, _reject) => {
  
      if (this.properties.targetSiteUrl === undefined) {
        this.properties.targetSiteUrl = 'https://lbforsikring.sharepoint.com/sites/intra';
      }
      this.properties.standardSearchEnabled=true
      
      resolve(undefined);
    });
  }
  public render(): void {
    const element: React.ReactElement<IAppProps > = React.createElement(
      App,
      {
        description: this.properties.description,
        targetListId:this.properties.lists,
        targetSiteUrl:this.properties.targetSiteUrl,
        standardSearchEnabled:this.properties.standardSearchEnabled,
        medlemsGruppe:this.properties.medlemsGruppe
      }
    );

    ReactDom.render(element, this.domElement);
    
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
            groups: [
            {
              groupName: 'Vælg sitecollection og liste',
              groupFields: [
                PropertyPaneTextField('targetSiteUrl', {
                  label: 'Indtast URL\'en på listens site'
                }),
                PropertyFieldListPicker('lists', {
                  label: 'Select a list',
                  selectedList: this.properties.lists,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId',
                  webAbsoluteUrl:this.properties.targetSiteUrl,
                  multiSelect:false
                }),
                  ...this.customPropertyMedlemsgrupper(this.properties.lists)
              ]
            },
            {
              groupName: 'Vælg søgeindstilling',
              groupFields: [
                PropertyFieldToggleWithCallout('standardSearchEnabled', {
                  calloutTrigger: CalloutTriggers.Hover,
                  key: 'toggleCustomColors',
                  label: 'Brug standard søgning',
                  calloutContent: React.createElement('p', {}, 'Switch this to use custom styling'),
                  onText: 'Standard',
                  offText: 'Tilpasset',
                  checked: this.properties.standardSearchEnabled
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private customPropertyMedlemsgrupper(listID: string): IPropertyPaneField<IPropertyFieldTermPickerPropsInternal>[] {
    if (this.properties.lists == '184b5667-fe5d-4966-8506-44b5b261da91') {
      return [
        PropertyFieldTermPicker('medlemsGruppe', {
          label: 'Select terms',
          panelTitle: 'Select terms',
          initialValues: this.properties.medlemsGruppe,
          allowMultipleSelections: true,
          excludeSystemGroup: false,
          onPropertyChange: this.onPropertyPaneFieldChanged,
          properties: this.properties,
          context: this.context,
          onGetErrorMessage: null,
          deferredValidationTime: 0,
          limitByTermsetNameOrID: '8080a5bf-3fe8-414d-a872-0a1bbe3e7182',
          key: 'termSetsPickerFieldId'
        })

      ]
    } else {
      return [];
    }
  }


  

}
