//"id": "54ee3c54-bd21-46d5-b22d-73ae2f0153aa"
import * as React from "react";
import * as ReactDom from 'react-dom';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import App from '../App/App'
import {ISearchInputContainerProps} from '../SearchInputContainer/ISearchInputContainerProps'
import {ISearchInputContainerState} from '../SearchInputContainer/ISearchInputContainerState'
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import styles from './SearchInputContainer.module.scss'
export default class SearchInputContainer extends React.Component<ISearchInputContainerProps, ISearchInputContainerState> {
    
    public constructor(props:ISearchInputContainerProps, state:ISearchInputContainerState){  
            super(props);  
            this.state = {  
                            queryText:"",
                            compactMode:false
            };  
    }

    public render(): React.ReactElement<ISearchInputContainerProps> {  
        return(
            <div className="ms-Grid">
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm6 ms-md8 ms-lg10">
                                             
                        {/* <TextField
                        onChanged={ (newValue:string) => {this.setState({queryText: newValue});} }
                        value={this.state.queryText}
                        /> */}

                        <SearchBox
                            placeholder='Søg'
                            onSearch={ (newValue:string) => {this._search(newValue)} }
                        />
                        <label className={styles.SearchInputLabel}>Tryk Enter 2 gange for at udføre søgning. Tryk * for at nulstille søgningen</label>



                         
                    </div>
                    {/* <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg2">
                    <Toggle
                            defaultChecked={ false }
                            label=''
                            onText='Kompakt'
                            offText='Info'
                            onChanged={ (newValue:boolean) => {this._toggleChanged(newValue)} }
                            // onChanged={ (newValue:boolean) => {this.setState({compactMode: newValue});this._toggleChanged()} }
                            />
                    </div> */}
                    
                </div>

                
            </div>
           
        );
        
    }
    
    
    private _searchBtnClicked():void{
        this.props.callbackSetAppContainerQueryString(this.state.queryText); 
    }
    private _search(newValue:string):void{
        console.log('search called') 
        this.setState({queryText: newValue});
        this.props.callbackSetAppContainerQueryString(this.state.queryText); 
    }
    private _toggleChanged(value:boolean):void{
        this.props.callbackDisplayMode(value);
        // this.props.callbackDisplayMode(this.state.compactMode);
        console.log('Searchiputcontainer ' +value)
    }

    
  }
