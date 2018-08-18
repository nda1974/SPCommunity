import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneChoiceGroup
} from '@microsoft/sp-webpart-base';

import * as strings from 'LbSearchManualsWebPartStrings';

import App, { IAppProps } from './components/App/App';

export interface ILbSearchManualsWebPartProps {
  description: string;
  manualType: string;
  searchUrl:string;
}



export default class LbSearchManualsWebPart extends BaseClientSideWebPart<ILbSearchManualsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAppProps > = React.createElement(
      App,
      {
        manualType: this.properties.manualType,
        webPartContext:this.context,
        searchUrl:this.properties.searchUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
        
          header: {
            
            description: "Vælg typen af håndbøger der skal vises" 
          },
          groups: [
            {
              groupName: 'Håndbog',
              groupFields: [
                PropertyPaneChoiceGroup('manualType',{
                  label:'Vælg type',
                  options:[{ key: 'Baad', text: 'Båd'}, 
                       { key: 'Bil', text: 'Bil' }, 
                       { key: 'Indbo', text: 'Indbo' },
                       { key: 'Rejse', text: 'Rejse' },
                       { key: 'Hund', text: 'Hund' } 
                  ]
                }),
                PropertyPaneTextField('searchUrl',{
                  label:'Indtast site scope'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
