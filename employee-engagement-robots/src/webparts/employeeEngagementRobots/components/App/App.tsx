import * as React from 'react';
import styles from '../App/App.module.scss';
import { IAppProps } from './IAppProps';
import * as myLibrary from 'corporate-library';
export default class App extends React.Component<IAppProps,{}> {
  constructor(props: IAppProps) {
    super(props);
    

    this._getSharePointData = this._getSharePointData.bind(this);
   
    this._getSharePointData();
  }

  
  
  private _getSharePointData():void{
    const lib = new myLibrary.CorporateLibraryLibrary;

    const pnpjs:any = lib.importPNPJS();
    
    const w = new pnpjs.Web("https://lbforsikring.sharepoint.com/sites/SFU")
    
    console.log(w)
   
    
  }
  
  public render(): React.ReactElement<IAppProps> {
    
    
    return (

      <div className={ styles.app }>
        Testing..
                        
      </div>
      
    );
  }
}
