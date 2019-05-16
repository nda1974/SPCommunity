import * as React from "react";
import pnp, { setup, Web, ItemAddResult } from "sp-pnp-js";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import styles from '../LBFavourites.module.scss'
import { IFavouriteItem } from "../../interfaces/IFavouriteItem";
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { Log } from "@microsoft/sp-core-library";
import FavouritesPanel from "../Panel/FavouritesPanel";
import FavouritesDialog from "../FavouritesDialog/FavouritesDialog";



export interface ITopBarProps {
    context: ApplicationCustomizerContext;

}
//https://hackernoon.com/how-to-take-advantage-of-local-storage-in-your-react-projects-a895f2b2d3f2
//https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
export interface ITopBarState {
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
}
const CACHEID: string = "LB_FAVOURITES";
const CACHE_CURRENTUSERID: string = CACHEID + "_currentUserId";
const CACHE_CURRENTUSERFAVOURITES: string = CACHEID + "_currentUserFavourites";
const CACHE_MANDATORYFAVOURITES: string = CACHEID + "_mandatoryFavourites";

const FAVOURITES_LIST_NAME: string = "Favourites";
const MANDATORY_FAVOURITES_LIST_NAME: string = "MandatoryFavourites";
const LOG_SOURCE: string = "LB_Favoritter_ApplicationCustomizer";


export default class TopMenu extends React.Component<ITopBarProps, ITopBarState>
{
    
    private _context: ApplicationCustomizerContext = this.props.context;
    constructor(props: ITopBarProps) {
        
        super(props);
        this.state = {
            status: <Spinner size={SpinnerSize.large} label="Henter..." />,
            showPanel: false,
            showDialog: false,
            dialogTitle: "Test",
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
            buttonDisabled:true
            // isEdit: false,
            // status: <Spinner size={SpinnerSize.large} label="Henter..." />,
            // disableButtons: false
        };
        this.handleDialogClick = this.handleDialogClick.bind(this);
        this.handleBar = this.handleBar.bind(this);
        // this._getFisk = this._getFisk.bind(this);
        this._doGetUserFromCache = this._doGetUserFromCache.bind(this);
        
        this._GetAllFavouritesPre= this._GetAllFavouritesPre.bind(this);
        this._getPersonalFavouritesNew=this._getPersonalFavouritesNew.bind(this)
        // this._getMyFavourites.bind(this);
        setup({
            sp: {
                headers: {
                    Accept: "application/json;"
                },
                baseUrl: "https://lbforsikring.sharepoint.com/sites/intra"
            },
            // spfxContext: this._context,
        });
        
        this._GetAllFavouritesPre();
    }
    
    // componentDidMount() {
        
    
    //     // add event listener to save state to sessionStorage
    //     // when user leaves/refreshes the page
    //     window.addEventListener(
    //       "storage",
    //       this.saveStateTosessionStorage.bind(this)
    //     );
    // }
    // private saveStateTosessionStorage(){
    //     console.log('Cache changed');
    // }
    private async _showPanel(): Promise<void> {
        
        // const favourites = await resList;
        this.setState({showPanel:true} );
        
    }

    // Ny Cache funktion
    private async _getCurrentUserId():Promise<void>{
        return await pnp.sp.web.currentUser.get();
        // return  await pnp.sp.web.currentUser.get().then((resultUser)=>{
        //     this.setState({currentUserId:resultUser.Id},()=>{window.sessionStorage.setItem(CACHE_CURRENTUSERID, resultUser.Id);});
        // });
    }
    
            
    public async _getMandatoryFavouritesNew(currentUserId): Promise<IFavouriteItem[]> {
        let returnItems: IFavouriteItem[] = [];
        
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
            .filter("UnFollowers ne " + currentUserId)
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
    private async _getPersonalFavouritesNew(_currrentUserID:string): Promise<IFavouriteItem[]> {
        let returnItems: IFavouriteItem[] = [];

        return await pnp.sp.web.lists.getByTitle(FAVOURITES_LIST_NAME)
            .items
            .select(
                "Id",
                "Title",
                "ItemUrl",
                "Mandatory"
            )
            .filter("Author eq " + _currrentUserID)
            .get()
            .then((myFavourites: any[]) => {
                myFavourites.map((item) => {
                    let fItem: IFavouriteItem = this.CreateFavoriteItemObject(item, true);
                    returnItems.push(fItem);
                })
                return returnItems;
            })
            .catch((error) => {
                Log.error(LOG_SOURCE, error);
                return [];
            });
    }
    
    private _doGetUserFromCache():boolean{
        
        if(window.sessionStorage[CACHE_CURRENTUSERID] == undefined){
            return false;
        }
        else{
            if(window.sessionStorage[CACHE_CURRENTUSERID].length<1){
                return false;
            }
        }
        return true;
    }

    private async _GetAllFavouritesPre(): Promise<void> {
        let showPanel:boolean;
        // *********** GET CURRENT USERID *********** 
        var _currentUserID:string;
        if(!sessionStorage.getItem(CACHE_CURRENTUSERID)) {
            const rest =await this._getCurrentUserId().then((data=>{return data}));
            _currentUserID = rest['Id'];
            window.sessionStorage.setItem(CACHE_CURRENTUSERID,_currentUserID)
        } 
        else {
            _currentUserID= window.sessionStorage.getItem(CACHE_CURRENTUSERID);
        }

        // *********** GET PERSONAL FAVOURITES *********** 
        var myFavouriteItems: IFavouriteItem[];

        if(!window.sessionStorage[CACHE_CURRENTUSERFAVOURITES]){
            myFavouriteItems = await this._getPersonalFavouritesNew(_currentUserID);    
            window.sessionStorage.setItem(CACHE_CURRENTUSERFAVOURITES,JSON.stringify(myFavouriteItems));
        }
        else{
            myFavouriteItems=JSON.parse(window.sessionStorage.getItem(CACHE_CURRENTUSERFAVOURITES));
        }

        // *********** GET MANDATORY FAVOURITES *********** 
        var LBFavouriteItems: IFavouriteItem[];
        if(!window.sessionStorage[CACHE_MANDATORYFAVOURITES]){
            LBFavouriteItems = await this._getMandatoryFavouritesNew(_currentUserID);    
            window.sessionStorage.setItem(CACHE_MANDATORYFAVOURITES,JSON.stringify(LBFavouriteItems));
        }
        else{
            LBFavouriteItems=JSON.parse(window.sessionStorage.getItem(CACHE_MANDATORYFAVOURITES));
        }
        // *************************************************

        const favourites: IFavouriteItem[] = await this.filterFavouritesNew(myFavouriteItems, LBFavouriteItems,_currentUserID);
        const buttonDisabled = false;
        this.setState({ ...this.state, favourites,buttonDisabled }, ()=>{this.setState({showPanel:false})});
        
    }
    // private async _showPanelORG(): Promise<void> {
    //     console.info("My Start date" + new Date())
    
    
    //     let status: JSX.Element = <Spinner size={SpinnerSize.large} label='Henter...' />;
    //     let showPanel: boolean = true;
    //     // this.setState({ ...this.state, showPanel,status });
    //     // const audiences= await this._getLBAudience();

    //     await this._getUserObject().then((currentUser) => {
    //         this.setState({ ...this.state, currentUser });
    //     });


    //     const myFavouriteItems: IFavouriteItem[] = await this._getPersonalFavourites(this.state.currentUser.Id);
    //     const MY_Data: IFavouriteItem[] = await myFavouriteItems;
    //     const LBFavouriteItems: IFavouriteItem[] = await this._getMandatoryFavourites();
    //     const LB_Data: IFavouriteItem[] = await LBFavouriteItems;

    //     const favourites: IFavouriteItem[] = await this.filterFavourites(MY_Data, LB_Data);
    //     // const favourites = await resList;
    //     this.setState({ ...this.state, favourites }, this._setShowPanelState);

    //     // await this.filterFavourites(myFavouriteItems,LBFavouriteItems).then((res)=>{
    //     //     favourites=res;
    //     //     this.setState({...this.state, favourites },this._setShowPanelState);
    //     //  })
    //     // const favourites = [...LBFavouriteItems,...myFavouriteItems];

    //     // this.setState({...this.state, favourites },this._setShowPanelState);
    //     console.info("My End date" + new Date())
    // }
    private async filterFavourites(myFavouritesCollection: IFavouriteItem[], LBFavouritesCollection: IFavouriteItem[]): Promise<IFavouriteItem[]> {
        let returnlist: IFavouriteItem[] = [];

        for (let favouriteIndex = 0; favouriteIndex < LBFavouritesCollection.length; favouriteIndex++) {
            const favourite = LBFavouritesCollection[favouriteIndex];
            if (favourite.LBAudience) {
                const isCurrentUserMemberOfGroup: any = await this.CheckIfUserBelongsToGroup(favourite.LBAudience, this.state.currentUser.Email)
                // const isCurrentUserMemberOfGroup = await isCurrentUserMemberOfGroupResponse;
                
                if (isCurrentUserMemberOfGroup == true) {
                    returnlist.push(favourite);
                }
                // if (isCurrentUserMemberOfGroup) {
                //     if (isCurrentUserMemberOfGroup.length > 0) {
                //         isCurrentUserMemberOfGroup.map(user=>{
                //             if(user.Id == this.state.currentUser.Id)
                //             returnlist.push(favourite);
                //             console.log('hurray')
                //         })
                        
                //         //returnlist.push(favourite);
                //     }
                // }
            }
            else {
                // myFavouritesCollection.push(favourite);
                returnlist.push(favourite);
            }

        }
        for (let myFavouritesIndex = 0; myFavouritesIndex < myFavouritesCollection.length; myFavouritesIndex++) {
            const element = myFavouritesCollection[myFavouritesIndex];
            returnlist.push(element);
            
        }
        return returnlist;
    }
    private async filterFavouritesNew(myFavouritesCollection: IFavouriteItem[], LBFavouritesCollection: IFavouriteItem[],CurrentUserId:string): Promise<IFavouriteItem[]> {
        let returnlist: IFavouriteItem[] = [];

        for (let favouriteIndex = 0; favouriteIndex < LBFavouritesCollection.length; favouriteIndex++) {
            const favourite = LBFavouritesCollection[favouriteIndex];
            if (favourite.LBAudience) {
                const isCurrentUserMemberOfGroup: any = await this.CheckIfUserBelongsToGroup(favourite.LBAudience, CurrentUserId)
                // const isCurrentUserMemberOfGroup = await isCurrentUserMemberOfGroupResponse;
                
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
    /// ********************* Dialog functions ********************* ///

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
    public async handleBar(itemInContext: IFavouriteItem): Promise<void> {
        // Todo Clear sessionStorage
        this._GetAllFavouritesPre();
        // console.log(itemInContext)
        this._showPanel();
    }
    // This is a callback function that triggers when the 'Gem' button on the favouriteDialog component is clicked
    public async handleDialogClick(createNewItem: boolean, itemInContext: IFavouriteItem): Promise<void> {

        if (this.state.showDialog == true) {
            var status: JSX.Element = <Spinner size={SpinnerSize.large} label="Opretter favorit..." />;
            this.setState({ status: status });
            let showDialog: boolean = false;
            let showPanel: boolean = false;
            this.setState({ ...this.state, status, showDialog, showPanel });
            
            if (createNewItem) {
                await this.saveFavourite(itemInContext).then((result)=>{
                    if(result){
                        window.sessionStorage.removeItem(CACHE_CURRENTUSERFAVOURITES );
                        this._GetAllFavouritesPre();
                    }
                });
            }
        }
        else if (this.state.showDialog == false) {
            this.setState({ showDialog: true });
        }

    }

    private _hideDialog(): void {
        this.setState({ showDialog: false });
    }
    /// ********************* Panel functions ********************* ///
    private _setShowPanelState(): void {
        this.setState({ showPanel: true })
    }


    public render(): React.ReactElement<ITopBarProps> {
        {
            return(
            this.state.buttonDisabled==true?
            <div className="{styles.spinnerContainer}">
                <Spinner size={SpinnerSize.medium} label="Henter dine favoritter" /></div>:
                <div className="{styles.ccTopBar}">
                <PrimaryButton data-id="menuButton"
                    title="Vis mine favoritter"
                    // text={this.state.buttonDisabled==true?"Henter dine favoritter":"Mine favoritter"}
                    text="Mine favoritter"
                    ariaLabel="Vis"
                    disabled={this.state.buttonDisabled}
                    iconProps={{ iconName: "View" }}
                    onClick={this._showPanel.bind(this)}
                    className={styles.addToFavouritesBtn}
                />

                <PrimaryButton data-id="menuButton"
                    title="Tilføj denne side til 'Mine favoritter'"
                    // text={this.state.buttonDisabled==true?"Henter dine favoritter":"Tilføj til favoritter"}
                    text="Tilføj til 'Mine favoritter'"
                    ariaLabel="Tilføj"
                    disabled={this.state.buttonDisabled}
                    iconProps={{ iconName: "Add" }}
                    onClick={this._showDialog.bind(this)}
                    
                />
                <FavouritesPanel title='Dine favoritter' currentUserId={sessionStorage.getItem(CACHE_CURRENTUSERID)} currentUser={this.state.currentUser} showPanel={this.state.showPanel} favourites={this.state.favourites} callbackRefreshFavourites={this.handleBar} />

                <FavouritesDialog itemInContext={this.state.itemInContext} dialogTitle='Opret favorit' showDialog={this.state.showDialog} callbackHandleDialogClick={this.handleDialogClick} />

            </div>
            )
        }
        // return (
            
            
        //     <div className="{styles.ccTopBar}">
        //         <PrimaryButton data-id="menuButton"
        //             title="Vis mine favoritter"
        //             // text={this.state.buttonDisabled==true?"Henter dine favoritter":"Mine favoritter"}
        //             text="Mine favoritter"
        //             ariaLabel="Vis"
        //             disabled={this.state.buttonDisabled}
        //             iconProps={{ iconName: "View" }}
        //             onClick={this._showPanel.bind(this)}
        //             className={styles.addToFavouritesBtn}
        //         />

        //         <PrimaryButton data-id="menuButton"
        //             title="Tilføj denne side til 'Mine favoritter'"
        //             // text={this.state.buttonDisabled==true?"Henter dine favoritter":"Tilføj til favoritter"}
        //             text="Tilføj til favoritter"
        //             ariaLabel="Tilføj"
        //             disabled={this.state.buttonDisabled}
        //             iconProps={{ iconName: "Add" }}
        //             onClick={this._showDialog.bind(this)}
                    
        //         />
        //         <FavouritesPanel title='Dine favoritter' currentUser={this.state.currentUser} showPanel={this.state.showPanel} favourites={this.state.favourites} callbackRefreshFavourites={this.handleBar} />

        //         <FavouritesDialog itemInContext={this.state.itemInContext} dialogTitle='Opret favorit' showDialog={this.state.showDialog} callbackHandleDialogClick={this.handleDialogClick} />

        //     </div>
            
        //     )
            
    }
    public async CheckIfUserBelongsToGroup(groupName: string, userId: string): Promise<boolean> {
        let resBool:any=false;
        try {
            const response = await pnp.sp.web.siteGroups.getByName(groupName).users.get().then((res)=>
            res.map(user=>{
                // if(user.Email == this.state.currentUser.Email)
                // {
                //     resBool=  true
                // }
                if(user.Id == userId)
                {
                    resBool=  true
                }
            })

            );
            // response.map(group=>{
            //     if(userEmail == this.state.currentUser.Email)
            //     {
            //         resBool=  true
            //     }
            // })
            // const data =await response
            // return response;
        } catch (error) {
            return null;
        }
        return resBool;

    }
    public async CheckIfUserBelongsToGroupORG(groupName: string, userEmail: string): Promise<any> {
        let resBool:any=false;
        try {
            const response = await pnp.sp.web.siteGroups.getByName(groupName).users.get();
            response.map(group=>{
                if(userEmail == this.state.currentUser.Email)
                {
                    resBool=  true
                }
            })
            // const data =await response
            // return response;
            resBool=false;
        } catch (error) {
            return null;
        }
        return resBool;

    }
    public async saveFavourite(favouriteItem: IFavouriteItem): Promise<boolean> {
        
        return pnp.sp.web.lists.getByTitle(FAVOURITES_LIST_NAME).items.add({
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


    
    public async _getMandatoryFavourites(): Promise<IFavouriteItem[]> {
        let returnItems: IFavouriteItem[] = [];
        
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
                myFavourites.map((favourite) => {
                    let fItem: IFavouriteItem = this.CreateFavoriteItemObject(favourite, false);
                    returnItems.push(fItem);
                })
                
                return returnItems;
            }

            )
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

    // private async _getPersonalFavourites(currentUserId: number): Promise<IFavouriteItem[]> {
    //     //const currentUserId: number = await this._getUserId();
    //     let returnItems: IFavouriteItem[] = [];
    //     // const currentUserObject: any = await this._getUserObject();
    //     //console.log(currentUserObject);
    //     return await pnp.sp.web.lists.getByTitle(FAVOURITES_LIST_NAME)
    //         .items
    //         .select(
    //             "Id",
    //             "Title",
    //             "ItemUrl",
    //             "Mandatory"
    //         )
    //         .filter("Author eq " + currentUserId)
    //         .usingCaching({
    //             expiration: pnp.util.dateAdd(new Date(), "minute", 20),
    //             key: "Personal favourites cache",
    //             storeName: "local"
    //         })
    //         .get()
    //         .then((myFavourites: any[]) => {
    //             myFavourites.map((item) => {
    //                 let fItem: IFavouriteItem = this.CreateFavoriteItemObject(item, true);
    //                 returnItems.push(fItem);
    //             })
    //             return returnItems;
    //         })
    //         .catch((error) => {
    //             Log.error(LOG_SOURCE, error);
    //             return [];
    //         });
    // }

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