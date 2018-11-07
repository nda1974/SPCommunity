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
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { ISearchResultContainerProps } from "./ISearchResultContainerProps";
import { ISearchResultContainerState } from "./ISearchResultContainerState";
import { ISearchResult } from "../../ISearchResults";

import SearchResultGroup from "./SearchResultGroup/SearchResultGroup"

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


      public render(): React.ReactElement<ISearchResultContainerProps> {  
        
      
        var t:any;
        

        var groupedManuals:any=this._groupBy('PoliceManualSubGroup',this.props.results);
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
            
            <div >
            
                {
                    arrGroupKeys.map((groupKey)=>{
                    const group = groupedManuals[groupKey];
                    
                    return  <SearchResultGroup groupName={groupKey} manuals={group}  ></SearchResultGroup>    
                    // <div className="ms-Grid-row">
                                
                    //         </div>
                })}
            
        

            </div>
            
        );
    }
    
    
    
  }


// function InsertMessageBar(item: ISearchResult) {
//     {
//         (() => {
//             switch (item.ContentType) {
//                 case "HundManual":
//                     return <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
//                         {item.HundCategory}
//                     </MessageBar>;
//                 case "BaadManual":
//                     return <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
//                         {item.BaadCategory}
//                     </MessageBar>;
//                 case "BilManual":
//                     return <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
//                         {item.BilCategory}
//                     </MessageBar>;
//                 case "IndboManual":
//                     return <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
//                         {item.IndboCategory}
//                     </MessageBar>;
//                 default:
//                     return <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
//                         Ingen kategori angivet
//                     </MessageBar>;
//             }
//         })();



        
//     }
// }
