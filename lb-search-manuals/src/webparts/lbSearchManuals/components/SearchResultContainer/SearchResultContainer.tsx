import * as React from "react";
import * as ReactDom from 'react-dom';
import {
    DocumentCard,
    DocumentCardActivity,
    DocumentCardPreview,
    DocumentCardTitle,
    IDocumentCardPreviewProps,
    DocumentCardType
  } from 'office-ui-fabric-react/lib/DocumentCard';
  import {
    HoverCard,
    IExpandingCardProps
  } from 'office-ui-fabric-react/lib/HoverCard';
  import { Link } from 'office-ui-fabric-react/lib/Link';
  import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

  import { DetailsList, buildColumns, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
  import { DirectionalHint } from 'office-ui-fabric-react/lib/common/DirectionalHint';
  import { autobind } from 'office-ui-fabric-react/lib/Utilities';


import { ISearchResultContainerProps } from "./ISearchResultContainerProps";
import { ISearchResultContainerState } from "./ISearchResultContainerState";
import { ISearchInputContainerState } from "../SearchInputContainer/ISearchInputContainerState";
import {TeachingBubbleBasicExample} from '../TeachingBubbleBasicExample/TeachingBubbleBasicExample'
import {ITeachingBubbleBasicExampleState}from '../TeachingBubbleBasicExample/TeachingBubbleBasicExample'

import SPSearchService from '../../services/SPSearchService'



import styles from "./SearchResultContainer.module.scss";
import { ISearchResult } from "../../ISearchResults";

import SearchResultGroup from "./SearchResultGroup/SearchResultGroup"
// import {groupArray} from 'group-array'

export default class SearchResultContainer extends React.Component<ISearchResultContainerProps, ISearchResultContainerState> {
    private queryText:string;
    public constructor(props:ISearchResultContainerProps,state:ISearchResultContainerState){  
            super(props);  
            
    }
      
    private _groupBy(prop:string,arr:ISearchResult[]):any{
        
        var groupArray = require('group-array');
        var groupBy = require('lodash.groupby');
        return groupBy(arr,prop);

        // return groupArray(arr,prop);
        
      }


    private _toggleGroup(ctrl:any):void{

    }



      
    
    
      


      public render(): React.ReactElement<ISearchResultContainerProps> {  
        
      
        var t:any;
        var showCompactMode:boolean=false;
        if(this.props.showCompactMode!=undefined){
            showCompactMode=this.props.showCompactMode;
        }

        var groupedManuals:any=this._groupBy('IndboCategory',this.props.results);
        var arrGroupKeys:string[]=[];
        {
            Object.keys(groupedManuals).map((groupKey,i)=>{
                arrGroupKeys.push(groupKey);
        })}

        arrGroupKeys.sort();
        // arrGroupKeys.map((i)=>{
        //     console.log(i)
        // })

        return(
            
            <div className="ms-Grid-row">
            
                {
                    arrGroupKeys.map((groupKey)=>{
                    const group = groupedManuals[groupKey];
                    
                    return  <div className="ms-Grid-row">
                                <SearchResultGroup groupName={groupKey} manuals={group} displayCompactMode={showCompactMode} ></SearchResultGroup>    
                            </div>
                })}
            
        

            </div>
            
        );
    }
    
    
    
  }


  function Test(items: ISearchResult[]):void{
    var s:string="";
    {
        items.map(function (item, key) {
            console.log('Grouped array ');
            console.log(item);
            return "";
        });
    }

  }


        
function _myRender(groupedManuals:any):any {  



    return(
        <div>

             {(() => {
                for (let index = 0; index < Object.keys(groupedManuals).length; index++) {
                    var category =Object.keys(groupedManuals)[index];
                    console.log(category);
                    console.log(index);
                    // groupedManuals[category].sort((a,b)=>a.Title.localeCompare(b.Title));
                    console.log(groupedManuals[category]);
                    return(
                        <div>
                            <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
                                            {category} - juhu
                                            </MessageBar>  
                                            {groupedManuals[category].map((m,i)=>{
                                                return <div>{m.Title} - tahah</div>
                                            })
        
                                            }
                        </div>
                    )
                }
                




                            })()}
        
        
        </div>
    )


    
}
function InsertMessageBar(item: ISearchResult) {
    {
        (() => {
            switch (item.ContentType) {
                case "HundManual":
                    return <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
                        {item.HundCategory}
                    </MessageBar>;
                case "BaadManual":
                    return <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
                        {item.BaadCategory}
                    </MessageBar>;
                case "BilManual":
                    return <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
                        {item.BilCategory}
                    </MessageBar>;
                case "IndboManual":
                    return <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
                        {item.IndboCategory}
                    </MessageBar>;
                default:
                    return <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
                        Ingen kategori angivet
                    </MessageBar>;
            }
        })();



        
    }
}
