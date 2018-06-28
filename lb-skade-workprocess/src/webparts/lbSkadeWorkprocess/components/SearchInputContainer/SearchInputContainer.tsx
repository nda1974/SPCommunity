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
                            queryText:""
            };  
    }

    public render(): React.ReactElement<ISearchInputContainerProps> {  
        return(
                    <div className={styles.container}>
                        <SearchBox
                            placeholder='Søg'
                            onSearch={ (newValue:string) => {this._search(newValue)} }
                            
                        />
                        {/* <label className={styles.SearchInputLabel}>Tryk Enter 2 gange for at udføre søgning. Tryk * for at nulstille søgningen</label> */}
                    </div> 
                    
           
        );
        
    }
    
    
    private _searchBtnClicked():void{
        this.props.callbackSetAppContainerQueryString(this.state.queryText); 
    }
    private _search(newValue:string):void{
        console.log('search called: ' + newValue) 
        this.setState({queryText: newValue},function(){
            // this.props.callbackSetAppContainerQueryString(this.state.queryText); 
            this.props.callbackSetAppContainerQueryString(newValue); 
        });
        
    }
    private _toggleChanged(value:boolean):void{
        // this.props.callbackDisplayMode(this.state.compactMode);
        console.log('Searchiputcontainer ' +value) 
    }

    
  }
