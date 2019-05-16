import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, 
 		PlaceholderContent,
 		PlaceholderName

} from '@microsoft/sp-application-base';
import * as React from "react";
import * as ReactDOM from "react-dom"
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'MyFavouritesApplicationCustomizerStrings';
import styles from './myFavourites.module.scss'
import { escape } from '@microsoft/sp-lodash-subset';
import MainMenuBar,{IMainMenuBarProps} from './components/MainMenuBar/MainMenuBar'
const LOG_SOURCE: string = 'MyFavouritesApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IMyFavouritesApplicationCustomizerProperties {
  // This is an example; replace with your own property
  Top: string;
  Bottom: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class MyFavouritesApplicationCustomizer
  extends BaseApplicationCustomizer<IMyFavouritesApplicationCustomizerProperties> {


  // These have been added
  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;
  
  @override
  public onInit(): Promise<void> {
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    return Promise.resolve<void>();
  }


  private _renderPlaceHolders(): void {
    console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
    console.log(
      "Available placeholders: ",
      this.context.placeholderProvider.placeholderNames
        .map(name => PlaceholderName[name])
        .join(", ")
    );

    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }

      if (this.properties) {
        let topString: string = this.properties.Top;
        if (!topString) {
          topString = "(Top property was not defined.)";
        }

        if (this._topPlaceholder.domElement) {
          // this._topPlaceholder.domElement.innerHTML = `
          // <div class="${styles.app}">
          //   <div class="${styles.top}">
          //     <i class="ms-Icon ms-Icon--Info" aria-hidden="true"></i> ${escape(
          //       topString
          //     )}
          //   </div>
          // </div>`;
          const element: React.ReactElement<IMainMenuBarProps> = React.createElement(
            MainMenuBar,
            {
             context:this.context
            }
          );
      
          // render the react element in the top placeholder.
          ReactDOM.render(element, this._topPlaceholder.domElement);
          
        }
      }
    }

    
  }

  private _onDispose(): void {
    console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }
}
