import * as React from "react";
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Shimmer,ShimmerElementsGroup, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import styles from '../../myFavourites.module.scss'
import { ColorClassNames } from "@uifabric/styling";
import { IFavouriteItem } from "../../interfaces/IFavouriteItem";
import { sp,ItemAddResult } from "@pnp/sp";
import FavouritesPanel from "../FavouritesPanel/FavouritesPanel";
import FavouritesDialog from "../FavouritesDialog/FavouritesDialog";

export interface IMainMenuBarProps {
    context: ApplicationCustomizerContext;

}
//https://hackernoon.com/how-to-take-advantage-of-local-storage-in-your-react-projects-a895f2b2d3f2
//https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage

export interface IMainMenuBarState {
    showPanel: boolean;
    showDialog: boolean;
    dialogTitle: string;
    status: JSX.Element;
    favourites: IFavouriteItem[];
    itemInContext: IFavouriteItem;
    audiences?: any;
    currentUser?: any;
    currentUserId?: any;
    buttonDisabled?:boolean;
    isLoading?:boolean;
}
const CACHEID: string = "LB_FAVOURITES";
const CACHE_CURRENTUSERID: string = CACHEID + "_currentUserId";
const CACHE_CURRENTUSERFAVOURITES: string = CACHEID + "_currentUserFavourites";
const CACHE_MANDATORYFAVOURITES: string = CACHEID + "_mandatoryFavourites";

const FAVOURITES_LIST_NAME: string = "Favourites";
const MANDATORY_FAVOURITES_LIST_NAME: string = "MandatoryFavourites";
const LOG_SOURCE: string = "LB_Favoritter_ApplicationCustomizer";


export default class MainMenuBar extends React.Component<IMainMenuBarProps,IMainMenuBarState>
{
    
    private _context: ApplicationCustomizerContext = this.props.context;
    constructor(props: IMainMenuBarProps) {
        
        super(props);
        this.state = {
            status: <Spinner size={SpinnerSize.large} label="Henter..." />,
            showPanel: false,
            showDialog: false,
            dialogTitle: "Favoritter",
            favourites: [],
            itemInContext: {
                Id: 0,
                Title: "",
                IsDistributed: false,
                IsMandatory: false,
                IsPersonal: false,
                ItemUrl: window.location.href,
                LBAudience: null
            },
            currentUser: null,
            audiences: null,
            buttonDisabled:true,
            isLoading:true
            
        };
        this._handleFavouriteDialogClick = this._handleFavouriteDialogClick.bind(this);
        this._fetchAllFavourites = this._fetchAllFavourites.bind(this);
    }
    
    // ******************************** Life Cycle Methods ******************************** //
    //                                                                                      //
    // ************************************************************************************ //
    
    /*************************************************************************************
    ComponentWillMount – This method is called before the render method every time the control is loaded or refreshed.
    Use cases: The code related to initial data pull for controls could be placed in this method. 
    This is where the data feeds into required for dependency driven controls for eg. Web service and REST calls. 
    It is advisable to show a loading message during this function run.
    *************************************************************************************/
    public componentWillMount()
    {
        sp.setup({
            sp: {
                headers: {
                    Accept: "application/json;"
                },
                baseUrl: "https://lbforsikring.sharepoint.com/sites/intra"
            },
            
        });

        this._fetchAllFavourites();
        
    }

    // ********************************** Custom Methods ********************************** //
    //                                                                                      //
    // ************************************************************************************ //
    private async _setCurrentUserIDInCache(): Promise<void> {
        var getIdFromCache:boolean=true;
        if(!window.sessionStorage[CACHE_CURRENTUSERID] || window.sessionStorage[CACHE_CURRENTUSERID] == 'undefined'){
            getIdFromCache = false;
        }
        else{
            if(window.sessionStorage[CACHE_CURRENTUSERID].length<1){
                getIdFromCache= false;
            }
        }

        if(!getIdFromCache){
            await sp.web.currentUser.get().then((userObject)=>{
                // return userObject;
                window.sessionStorage.setItem(CACHE_CURRENTUSERID,userObject['Id'])
                }
            );
        }
    }
    private async _fetchAllFavourites():Promise<void>{
        this.setState({isLoading:true});
        var LBFavouriteItems: IFavouriteItem[];
        var myFavouriteItems: IFavouriteItem[];
        // await this._SetCurrentUserIDInCache();
        const res = await this._setCurrentUserIDInCache()
        .then( ()=>{
                    if(window.sessionStorage[CACHE_CURRENTUSERFAVOURITES]=='undefined' || 
                        !window.sessionStorage[CACHE_CURRENTUSERFAVOURITES] ||
                        window.sessionStorage[CACHE_CURRENTUSERFAVOURITES]==null){
                        const r1 =this._setPersonalFavourites(window.sessionStorage.getItem(CACHE_CURRENTUSERID));
                        return r1.then((data)=>{
                            window.sessionStorage.setItem(CACHE_CURRENTUSERFAVOURITES,JSON.stringify(data));
                            myFavouriteItems=data;
                        });
                    }
                    else{
                        myFavouriteItems=JSON.parse(window.sessionStorage.getItem(CACHE_CURRENTUSERFAVOURITES));
                    }
            }
        )
        .then( ()=>{
            if(window.sessionStorage[CACHE_MANDATORYFAVOURITES]=='undefined' 
                || !window.sessionStorage[CACHE_MANDATORYFAVOURITES]
                || window.sessionStorage[CACHE_MANDATORYFAVOURITES]==null){
                const r2 =this._setMandatoryFavourites(window.sessionStorage.getItem(CACHE_CURRENTUSERID));
                    return r2.then((data)=>{
                        window.sessionStorage.setItem(CACHE_MANDATORYFAVOURITES,JSON.stringify(data));
                        LBFavouriteItems=data;
                    });
            }
            else{
                LBFavouriteItems=JSON.parse(window.sessionStorage.getItem(CACHE_MANDATORYFAVOURITES));
            }
                    
            }
        );
                
        const favourites: IFavouriteItem[] = await this._filterFavourites(myFavouriteItems, LBFavouriteItems,CACHE_CURRENTUSERID);
        const buttonDisabled = false;
        this.setState({ ...this.state, favourites,buttonDisabled }, ()=>{this.setState({showPanel:false})});
        this.setState({isLoading:false});
        
    }
    private async _filterFavourites(myFavouritesCollection: IFavouriteItem[], LBFavouritesCollection: IFavouriteItem[],CurrentUserId:string): Promise<IFavouriteItem[]> {
        let returnlist: IFavouriteItem[] = [];

        for (let favouriteIndex = 0; favouriteIndex < LBFavouritesCollection.length; favouriteIndex++) {
            const favourite = LBFavouritesCollection[favouriteIndex];
            if (favourite.LBAudience) {
                const isCurrentUserMemberOfGroup: any = await this._checkIfUserBelongsToGroup(favourite.LBAudience, CurrentUserId)
                if (isCurrentUserMemberOfGroup == true) {
                    returnlist.push(favourite);
                }
            }
            else {
                returnlist.push(favourite);
            }
        }
        for (let myFavouritesIndex = 0; myFavouritesIndex < myFavouritesCollection.length; myFavouritesIndex++) {
            const element = myFavouritesCollection[myFavouritesIndex];
            returnlist.push(element);
        }
        return returnlist;
    }
    public async _checkIfUserBelongsToGroup(groupName: string, userId: string): Promise<boolean> {
        let resBool:any=false;
        try {
            const response = await sp.web.siteGroups.getByName(groupName).users.get().then((res)=>
            res.map(user=>{
                if(user.Id == userId)
                {
                    resBool=  true
                }
            })

            );
            
        } catch (error) {
            return null;
        }
        return resBool;

    }
    private async _setPersonalFavourites(id): Promise<IFavouriteItem[]>{
        var myFavouriteItems: IFavouriteItem[];

        let returnItems: IFavouriteItem[] = [];

        const res =  await sp.web.lists.getByTitle(FAVOURITES_LIST_NAME)
            .items
            .select(
                "Id",
                "Title",
                "ItemUrl",
                "Mandatory"
            )
            .filter("Author eq " + id)
            .get()
            .then((myFavourites: any[]) => {
                myFavourites.map((item) => {
                    let fItem: IFavouriteItem = this.CreateFavoriteItemObject(item, true);
                    returnItems.push(fItem);
                })
                return returnItems;
            })
            .catch((error) => {
                return [];
            });
            return res;
    }
    public async _setMandatoryFavourites(id): Promise<IFavouriteItem[]> {
        let returnItems: IFavouriteItem[] = [];
        
        return await sp.web.lists.getByTitle(MANDATORY_FAVOURITES_LIST_NAME)
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
            .filter("UnFollowers ne " + id)
            .get()
            .then((myFavourites: any[]) => {
                myFavourites.map((favourite) => {
                    let fItem: IFavouriteItem = this.CreateFavoriteItemObject(favourite, false);
                    returnItems.push(fItem);
                })
                
                return returnItems;
            }

            )
    }
    public async _saveFavourite(favouriteItem: IFavouriteItem): Promise<boolean> {
        
        return sp.web.lists.getByTitle(FAVOURITES_LIST_NAME).items.add({
            'Title': favouriteItem.Title,
            // 'Description': favouriteItem.Description,
            'ItemUrl': window.location.href,
            'Mandatory': false
        }).then(async (result: ItemAddResult): Promise<boolean> => {
            let addedItem: IFavouriteItem = result.data;
            // await this._getAllFavourites();
            return true;
        }, (error: any): boolean => {
            return false;
        });

    }
    // Triggers when 'Tilføj button' is clicked and set the showDialog property on the FavouritesDialog component
    private _showDialog(): void {
        let itemInContext: IFavouriteItem = {
            Id: 0,
            Title: "",
            IsDistributed: false,
            IsMandatory: false,
            IsPersonal: false,
            ItemUrl: null,
            LBAudience: null
        };
        let showDialog: boolean = true;
        this.setState({ ...this.state, showDialog, itemInContext });
    }
    // This is a callback function that triggers when the 'Gem' button on the favouriteDialog component is clicked
    public async _handleFavouriteDialogClick(createNewItem: boolean, itemInContext: IFavouriteItem): Promise<void> {

        if (this.state.showDialog == true) {
            var status: JSX.Element = <Spinner size={SpinnerSize.large} label="Opretter favorit..." />;
            this.setState({ status: status });
            let showDialog: boolean = false;
            let showPanel: boolean = false;
            this.setState({ ...this.state, status, showDialog, showPanel });
            
            if (createNewItem) {
                await this._saveFavourite(itemInContext).then((result)=>{
                    if(result){
                        window.sessionStorage.removeItem(CACHE_CURRENTUSERFAVOURITES );
                        this._fetchAllFavourites();
                    }
                });
            }
        }
        else if (this.state.showDialog == false) {
            this.setState({ showDialog: true });
        }
    }

    private async _showPanel(): Promise<void> {
        this.setState({showPanel:true} );
    }


    private CreateFavoriteItemObject(favourite: any, IsPersonalFavourite: boolean): IFavouriteItem {
        return {
            Id: favourite.Id,
            IsDistributed: IsPersonalFavourite==true?false:true,
            IsMandatory: favourite.Mandatory,
            IsPersonal: IsPersonalFavourite,
            ItemUrl: favourite.ItemUrl,
            Title: favourite.Title,
            LBAudience: favourite.Grupper ? favourite.Grupper[0].Title : null
        };
    }

    public render(): React.ReactElement<IMainMenuBarProps> {
        {
            return(
            
                <div className="{styles.spinnerContainer}">
                
                <div>
                 <Shimmer className={this.state.isLoading==true?styles.showControl:styles.hideControl}

                    shimmerElements={[
                        { type: ShimmerElementType.line }
                    ]}
                    shimmerColors={{
                        shimmer: '#bdd4ed',
                        shimmerWave: '#7aafe7'
                      }}
                    />
                </div>
                
                <div className={this.state.isLoading==false?styles.showControl:styles.hideControl}>
                    <PrimaryButton data-id="menuButton"
                    title="Vis mine favoritter"
                    // text={this.state.buttonDisabled==true?"Henter dine favoritter":"Mine favoritter"}
                    text="Mine favoritter"
                    ariaLabel="Vis"
                    // disabled={this.state.buttonDisabled}
                    iconProps={{ iconName: "View" }}
                    onClick={this._showPanel.bind(this)}
                    className={styles.addToFavouritesBtn}
                    />

                    <PrimaryButton data-id="menuButton"
                    title="Tilføj denne side til 'Mine favoritter'"
                    text="Tilføj til 'Mine favoritter'"
                    ariaLabel="Tilføj"
                    // disabled={this.state.buttonDisabled}
                    iconProps={{ iconName: "Add" }}
                    onClick={this._showDialog.bind(this)}
                    
                    />
                </div>
            
                <FavouritesPanel title='Dine favoritter' currentUserId={sessionStorage.getItem(CACHE_CURRENTUSERID)} showPanel={this.state.showPanel} favourites={this.state.favourites} callbackRefreshFavourites={this._fetchAllFavourites} />
                <FavouritesDialog itemInContext={this.state.itemInContext} dialogTitle='Opret favorit' showDialog={this.state.showDialog} callbackHandleDialogClick={this._handleFavouriteDialogClick} />
                </div>
                // <div className="{styles.ccTopBar}">
                // <PrimaryButton data-id="menuButton"
                //     title="Vis mine favoritter"
                //     // text={this.state.buttonDisabled==true?"Henter dine favoritter":"Mine favoritter"}
                //     text="Mine favoritter"
                //     ariaLabel="Vis"
                //     disabled={this.state.buttonDisabled}
                //     iconProps={{ iconName: "View" }}
                //     onClick={this._showPanel.bind(this)}
                //     className={styles.addToFavouritesBtn}
                // />

                // <PrimaryButton data-id="menuButton"
                //     title="Tilføj denne side til 'Mine favoritter'"
                //     // text={this.state.buttonDisabled==true?"Henter dine favoritter":"Tilføj til favoritter"}
                //     text="Tilføj til 'Mine favoritter'"
                //     ariaLabel="Tilføj"
                //     disabled={this.state.buttonDisabled}
                //     iconProps={{ iconName: "Add" }}
                //     onClick={this._showDialog.bind(this)}
                    
                // />
                // <FavouritesPanel title='Dine favoritter' currentUserId={sessionStorage.getItem(CACHE_CURRENTUSERID)} currentUser={this.state.currentUser} showPanel={this.state.showPanel} favourites={this.state.favourites} callbackRefreshFavourites={this.handleBar} />

                // <FavouritesDialog itemInContext={this.state.itemInContext} dialogTitle='Opret favorit' showDialog={this.state.showDialog} callbackHandleDialogClick={this.handleDialogClick} />

            // </div>
            )
        }
        
            
    }

    // ******************************** Life Cycle Methods ********************************//
    

}