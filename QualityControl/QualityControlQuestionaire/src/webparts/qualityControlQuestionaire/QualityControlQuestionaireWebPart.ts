import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import * as strings from 'QualityControlQuestionaireWebPartStrings';
import { IAppProps } from './components/App/IAppProps';
import App from './components/App/App';
import { setup } from 'sp-pnp-js/lib/pnp';

export interface IQualityControlQuestionaireWebPartProps {
  webPartHeader:string;
  testUrl:boolean;
  delegeteToPriviligedUser:string;
}

export default class QualityControlQuestionaireWebPart extends BaseClientSideWebPart<IQualityControlQuestionaireWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAppProps > = React.createElement(
      
      App,
      {
        ctx:this.context,
        webPartHeader: this.properties.webPartHeader,
        testURL: this.properties.testUrl,
        delegeteToPriviligedUser:this.properties.delegeteToPriviligedUser
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  protected get disableReactivePropertyChanges(): boolean { 
    return false; 
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Konfigurer webpart'
          },
          groups: [
            {
              groupName: 'Konfiguration af webparten',
              groupFields: [
                PropertyPaneTextField('webPartHeader', {
                  label: "Overskrift"
                }),
                PropertyPaneTextField('delegeteToPriviligedUser', {
                  label: "'Overdrag til anden PU' knap tekst"
                }),
                PropertyPaneToggle('testUrl', {
                  label:'Brug Test konfiguration',
                  onText:'Ja - brug test konfiguration',
                  offText:'Nej - brug produktion konfiguration'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
