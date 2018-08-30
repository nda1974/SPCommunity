import * as React from "react";
import * as ReactDOM from "react-dom";
import pnp ,{setup, Web, ItemAddResult}from "sp-pnp-js";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { List } from "office-ui-fabric-react/lib/List";
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import styles from '../LBFavourites.module.scss'
import { IFavouriteItem } from "../../interfaces/IFavouriteItem";
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { Log } from "@microsoft/sp-core-library";
import FavouritesPanel from "../Panel/FavouritesPanel";
import FavouritesDialog from "../FavouritesDialog/FavouritesDialog";
export interface ITopBarProps{
    context: ApplicationCustomizerContext;
    
} 
export interface ITopBarState{
    showPanel:boolean;
    showDialog:boolean;
    dialogTitle: string;
    status: JSX.Element;
    favourites:IFavouriteItem[];
    itemInContext: IFavouriteItem;
    audiences?:any;
    currentUser?:any;
} 

const FAVOURITES_LIST_NAME: string = "Favourites";
const MANDATORY_FAVOURITES_LIST_NAME: string = "MandatoryFavourites";
const LOG_SOURCE: string = "LB_Favoritter_ApplicationCustomizer";
export default class TopMenu extends React.Component<ITopBarProps,ITopBarState>
{
    private _context: ApplicationCustomizerContext=this.props.context;
    constructor(props: ITopBarProps) {
        super(props);
        this.state = {
            status: <Spinner size={SpinnerSize.large} label="Henter..." />,
            showPanel: false,
            showDialog: false,
            dialogTitle: "Test",
            favourites:[],
            itemInContext: {
                Id: 0,
                Title: "",
                IsDistributed:false,
                IsMandatory:false,
                IsPersonal:false,
                ItemUrl:window.location.href,
                LBAudience:null
            }, 
            currentUser:null,
            audiences:null
            // isEdit: false,
            // status: <Spinner size={SpinnerSize.large} label="Henter..." />,
            // disableButtons: false
        };
        this.handleDialogClick = this.handleDialogClick.bind(this);
        this.handleBar = this.handleBar.bind(this);
        
        // this._getMyFavourites.bind(this);
        setup({
            sp: {
                headers: {
                    Accept: "application/json;"
                },
                baseUrl:"https://lbforsikring.sharepoint.com/sites/intra"
            },
            // spfxContext: this._context,
        });
    }
    private async _showPanel():Promise<void> {
        let status: JSX.Element = <Spinner size={SpinnerSize.large} label='Henter...' />;
        let showPanel:boolean=true;
        // this.setState({ ...this.state, showPanel,status });
        // const audiences= await this._getLBAudience();

        await this._getUserObject().then((currentUser)=>{
            this.setState({...this.state, currentUser}); 
        });
        
        
        const myFavouriteItems: IFavouriteItem[] =await this._getPersonalFavourites(this.state.currentUser.Id);
        const MY_Data:IFavouriteItem[]=await myFavouriteItems;
        const  LBFavouriteItems: IFavouriteItem[] = await this._getMandatoryFavourites();
        const LB_Data:IFavouriteItem[]=await LBFavouriteItems;
        
        const favourites:IFavouriteItem[] = await this.filterFavourites(MY_Data,LB_Data);
        // const favourites = await resList;
        this.setState({...this.state, favourites },this._setShowPanelState);

        // await this.filterFavourites(myFavouriteItems,LBFavouriteItems).then((res)=>{
        //     favourites=res;
        //     this.setState({...this.state, favourites },this._setShowPanelState);
        //  })
        // const favourites = [...LBFavouriteItems,...myFavouriteItems];
        
        // this.setState({...this.state, favourites },this._setShowPanelState);
    }
    
    private async filterFavourites(myFavouritesCollection:IFavouriteItem[],LBFavouritesCollection:IFavouriteItem[]):Promise<IFavouriteItem[]>{
        let returnlist:IFavouriteItem[]=[];
        // const obj= await LBFavouritesCollection.map(async(favourite)=>{
        //     if (favourite.LBAudience) {
        //         const isCurrentUserMemberOfGroupResponse:any= await this.CheckIfUserBelongsToGroup(favourite.LBAudience,this.state.currentUser.Email)
        //         const isCurrentUserMemberOfGroup = await isCurrentUserMemberOfGroupResponse;
        //             if (isCurrentUserMemberOfGroup) {
        //                 if (isCurrentUserMemberOfGroup.length>0) {
        //                     // myFavouritesCollection.push(favourite);
        //                     returnlist.push(favourite);
        //                 }
        //             }
        //         // favourite.LBAudience.map(async(group)=>{
        //         // })
        //     }
        //     else{
        //         // myFavouritesCollection.push(favourite);
        //         returnlist.push(favourite);
        //     }
        // })
        
        for (let favouriteIndex = 0; favouriteIndex < LBFavouritesCollection.length; favouriteIndex++) {
            const favourite = LBFavouritesCollection[favouriteIndex];
            if (favourite.LBAudience) {
                const isCurrentUserMemberOfGroup:any= await this.CheckIfUserBelongsToGroup(favourite.LBAudience,this.state.currentUser.Email)
                // const isCurrentUserMemberOfGroup = await isCurrentUserMemberOfGroupResponse;
                if (isCurrentUserMemberOfGroup) {
                    if (isCurrentUserMemberOfGroup.length>0) {
                        // myFavouritesCollection.push(favourite);
                        returnlist.push(favourite);
                    }
                }
            }
            else{
                // myFavouritesCollection.push(favourite);
                returnlist.push(favourite);
            }
            
        }
        return returnlist;
        // const obj= await LBFavouritesCollection.map(async(favourite)=>{
        //     if (favourite.LBAudience) {
        //         const isCurrentUserMemberOfGroupResponse:any= await this.CheckIfUserBelongsToGroup(favourite.LBAudience,this.state.currentUser.Email)
        //         const isCurrentUserMemberOfGroup = await isCurrentUserMemberOfGroupResponse;
        //             if (isCurrentUserMemberOfGroup) {
        //                 if (isCurrentUserMemberOfGroup.length>0) {
        //                     // myFavouritesCollection.push(favourite);
        //                     returnlist.push(favourite);
        //                 }
        //             }
        //         // favourite.LBAudience.map(async(group)=>{
        //         // })
        //     }
        //     else{
        //         // myFavouritesCollection.push(favourite);
        //         returnlist.push(favourite);
        //     }
        // })
        
        
        
    }
    /// ********************* Dialog functions ********************* ///
    
    // Triggers when 'Tilføj button' is clicked and set the showDialog property on the FavouritesDialog component
    private _showDialog(): void {
        let itemInContext: IFavouriteItem = {
            Id: 0,
            Title: "",
            IsDistributed:false,
            IsMandatory:false,
            IsPersonal:false,
            ItemUrl:null,
            LBAudience:null
        };
        let  showDialog:boolean=true;
        this.setState({...this.state, showDialog, itemInContext });
    }
    public async handleBar(itemInContext:IFavouriteItem):Promise<void>{
        console.log(itemInContext)
        this._getAllFavourites();
    }
    // This is a callback function that triggers when the 'Gem' button on the favouriteDialog component is clicked
    public async handleDialogClick(createNewItem:boolean, itemInContext:IFavouriteItem):Promise<void>{
        
        if(this.state.showDialog == true)
        {
            var status: JSX.Element = <Spinner size={SpinnerSize.large} label="Opretter favorit..." />;
            this.setState({status:status});
            let showDialog:boolean=false;
            let showPanel:boolean=false;
            this.setState({ ...this.state, status,showDialog,showPanel});
            
                if (createNewItem) {
                    let isSuccess:boolean= await this.saveFavourite(itemInContext);
                }
            
        }
        else if(this.state.showDialog == false)
        {
            this.setState({showDialog:true});
        }
           
    }
 
    private _hideDialog(): void {
        this.setState({ showDialog: false });
    }
    /// ********************* Panel functions ********************* ///
    private _setShowPanelState():void{
        this.setState({showPanel:true})
    }

    
    public render(): React.ReactElement<ITopBarProps> {
        return (
            <div className="{styles.ccTopBar}">
                <PrimaryButton data-id="menuButton"
                    title="Vis mine favoritter"
                    text="Mine favoritter"
                    ariaLabel="Vis"
                    iconProps={{ iconName: "View" }}
                    onClick={this._showPanel.bind(this)}
                />

                <PrimaryButton data-id="menuButton"
                    title="Tilføj denne side til 'Mine favoritter'"
                    text="Tilføj"
                    ariaLabel="Tilføj"
                    iconProps={{ iconName: "Add" }}
                    onClick={this._showDialog.bind(this)}
                />

                <FavouritesPanel title='Dine favoritter' showPanel={this.state.showPanel} favourites={this.state.favourites} callbackRefreshFavourites={this.handleBar} />
                
                <FavouritesDialog itemInContext={this.state.itemInContext}  dialogTitle='Opret favorit' showDialog={this.state.showDialog} callbackHandleDialogClick={this.handleDialogClick} />
                
            </div>)
                }
                 public async CheckIfUserBelongsToGroup(groupName: string, userEmail: string):Promise<any> {
                    // public async CheckIfUserBelongsToGroup(groupName: string, userEmail: string):Promise<any>{
                    // const response= await fetch(pnp.sp.web.siteGroups.getByName(groupName).users.get());
                    // return response;
                //    return pnp.sp.web.siteGroups.getByName(groupName).users.get().then(rs => {
                       
                //         console.log("user belongs to group");
                //         return rs;
                
                //     }).catch(error => {
                
                //         console.log("user does not belong");
                //         return null;
                //     })
                
                try {
                    const response= await pnp.sp.web.siteGroups.getByName(groupName).users.get();
                    // const data =await response
                    return response;    
                } catch (error) {
                    return null;
                }
                
                
                }
                public async saveFavourite(favouriteItem: IFavouriteItem): Promise<boolean> {
        
                    return pnp.sp.web.lists.getByTitle(FAVOURITES_LIST_NAME).items.add({
                        'Title': favouriteItem.Title,
                        // 'Description': favouriteItem.Description,
                        'ItemUrl': window.location.href,
                        'Mandatory':false
                    }).then(async (result: ItemAddResult): Promise<boolean> => {
                        let addedItem: IFavouriteItem = result.data;
                        // await this._getAllFavourites();
                        return true;
                    }, (error: any): boolean => {
                        return false;
                    });

                }


                public async _getAllFavourites(): Promise<void> {
                    let status: JSX.Element = <span></span>;
                    this.setState({ ...this.state, status });
            
                    // const myFavouriteItems: IFavouriteItem[] = await this._getPersonalFavourites(this.state.currentUser.Id);
                    // const LBFavouriteItems: IFavouriteItem[] = await this._getMandatoryFavourites();
                    // const favourites = [...LBFavouriteItems,...myFavouriteItems];
                    // const filteredFavouriteItems: IFavouriteItem[]=[];
                    // let isUserMemberInGroup:any={};
                    
                    // for (const favourite in favourites) {
                    //     if (favourite.IsMandatory) {
                    //         const element = object[key];
                            
                    //     }
                    // }

                    // await Promise.all(
                    //     favourites.map(async (favourite)=>{
                    //         if (favourite.IsMandatory) {
                    //             if (favourite.LBAudience) {
                    //                 favourite.LBAudience.forEach(async gruppe => {
                    //                     isUserMemberInGroup = await this.Test(gruppe.Title,this.state.currentUser.Email)
                    //                     console.log(gruppe)
                    //                 });
                    //             }
                    //         }
                    //     })    
                    // )


                    // favourites.map((favourite)=>{
                    //     if (favourite.IsMandatory) {
                    //         if (favourite.LBAudience) {
                    //             favourite.LBAudience.forEach(gruppe => {
                    //                 isUserMemberInGroup = this.CheckIfUserBelongsToGroup(gruppe.Title,this.state.currentUser.Email)
                    //                 if (isUserMemberInGroup) {
                                        
                    //                 }
                    //                 console.log(gruppe)
                    //             });
                    //         }
                    //     }
                    // })
                    // status = <span></span>;
                    // this.setState({...this.state, favourites},this._setShowPanelState );
                    // this.setState({ favourites:spread },this._setShowPanelState);
                    
                    
                }
              
                // public async IsUserGroupMember(groupName:string,email:string):Promise<any>
                // {
                //     return await this.CheckIfUserBelongsToGroup(groupName,email);
                // }
                public async _getMandatoryFavourites(): Promise<IFavouriteItem[]> {
                    let returnItems:IFavouriteItem[]=[]; 
                    
                    return await pnp.sp.web.lists.getByTitle(MANDATORY_FAVOURITES_LIST_NAME)
                    .items
                    .select(
                    "Id",
                    "Title",
                    "ItemUrl",
                    "Description",
                    "Mandatory",
                    "Grupper/Title"
                    )
                    .expand("Grupper")
                    .filter("UnFollowers ne " + this.state.currentUser.Id)
                    .get()
                    .then((myFavourites: any[]) => {
                        myFavourites.map((favourite)=>{
                            let fItem:IFavouriteItem=this.CreateFavoriteItemObject(favourite,false);        
                                        returnItems.push(fItem);
                            })
                            return returnItems;
                        }
                        
                    )
                }
                private CreateFavoriteItemObject(favourite: any,IsPersonalFavourite:boolean): IFavouriteItem {
                    return {
                        Id: favourite.Id,
                        IsDistributed: true,
                        IsMandatory: favourite.Mandatory,
                        IsPersonal: IsPersonalFavourite,
                        ItemUrl: favourite.ItemUrl,
                        Title: favourite.Title,
                        LBAudience:favourite.Grupper?favourite.Grupper[0].Title:null
                    };
                }

                private async _getPersonalFavourites( currentUserId:number): Promise<IFavouriteItem[]> {
                    //const currentUserId: number = await this._getUserId();
                    let returnItems:IFavouriteItem[]=[]; 
                    // const currentUserObject: any = await this._getUserObject();
                    //console.log(currentUserObject);
                    return await pnp.sp.web.lists.getByTitle(FAVOURITES_LIST_NAME)
                        .items
                        .select(
                        "Id",
                        "Title",
                        "ItemUrl",
                        "Mandatory"
                        )
                        .filter("Author eq " + currentUserId)
                        .get()
                        .then((myFavourites: any[]) => {
                            myFavourites.map((item)=>{
                                let fItem:IFavouriteItem=this.CreateFavoriteItemObject(item,true);
                                returnItems.push(fItem);
                            })  
                            return returnItems;
                        })
                        .catch((error) => {
                            Log.error(LOG_SOURCE, error);
                            return [];
                        });

                        
                }
                
                private _getUserObject(): Promise<any> {
                    try {
                        return pnp.sp.web.currentUser.get().then(result => {
                            
                            console.log(result);
                            return result;
                        });
                    } catch (error) {
                        console.log(error)
                    }
                    
                }
}