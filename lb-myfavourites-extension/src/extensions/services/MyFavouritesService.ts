import { IMyFavoutitesService } from "./IMyFavouritesService";
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";

import pnp, {Web, List, ItemAddResult, ItemUpdateResult } from "sp-pnp-js";
import { IMyFavouriteItem } from "../interfaces/IMyFavouriteItem";
import { Log } from "@microsoft/sp-core-library";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions, ISPHttpClientConfiguration, ODataVersion } from '@microsoft/sp-http';
import SPHttpClientConfiguration from "@microsoft/sp-http/lib/spHttpClient/SPHttpClientConfiguration";
import HttpClientConfiguration from "@microsoft/sp-http/lib/httpClient/HttpClientConfiguration";
import { IMyFavouritesTopBarProps } from "../../../lib/extensions/components/MyFavouritesTopBar/IMyFavouritesTopBarProps";

const LOG_SOURCE: string = "CC_MyFavourites_ApplicationCustomizer";
const FAVOURITES_LIST_NAME: string = "Favourites";
const MANDATORY_FAVOURITES_LIST_NAME: string = "MandatoryFavourites";

export class MyFavouritesService implements IMyFavoutitesService {
    private _context: ApplicationCustomizerContext;
    private _props: IMyFavouritesTopBarProps;
    private _currentWebUrl: string;
    private _sessionStorageKey: string = "MyFavourites_";

    constructor(_props: IMyFavouritesTopBarProps) {
        this._props = _props;
        this._context = _props.context;
        // this._currentWebUrl = this._context.pageContext.web.absoluteUrl;
        this._currentWebUrl = "https://lbforsikring.sharepoint.com/sites/intra";
        this._sessionStorageKey += this._currentWebUrl;
        pnp.setup({
            sp: {
                // baseUrl: this._currentWebUrl
                baseUrl: "https://lbforsikring.sharepoint.com/sites/intra"
            }
        });
    }

    public async getMyFavourites(tryFromCache: boolean): Promise<IMyFavouriteItem[]> {
        let myFavourites: IMyFavouriteItem[] = [];
        let tmplbFavourites: IMyFavouriteItem[] = [];
        let lbFavourites: IMyFavouriteItem[] = [];
        // if(tryFromCache) {
        //     myFavourites = this._fetchFromSessionStorge();
        //     if(myFavourites.length) {
        //         return myFavourites;
        //     }
        // }
        var userID  = await this._getUserId();
        
        myFavourites = await this._getPersonalFavourites();
        tmplbFavourites = await this._getMandatoryFavourites();

        
        //console.log("This is mandatory");
        //console.log(lbFavourites);
        for (var i = 0; i < myFavourites.length; i++) {
            // Sætter PersonalFavourite==true for at kunne identificere denne favorit til at være en personling favorit
            myFavourites[i].PersonalFavourite==true;
        }
        for (var i = 0; i < tmplbFavourites.length; i++) {
            
            if (tmplbFavourites[i].LBAudience.Title != "Alle" ) {
                console.log("LBAudience:: " + tmplbFavourites[i].LBAudience.Title)    
                // Returnere de bruger der er i LBAudience gruppen
                var any = await this._getLBAudience(tmplbFavourites[i].LBAudience.Title)
                
                any.map((user=>{
                    if (user.Id == userID) {
                        
                        lbFavourites.push(tmplbFavourites[i]);
                    }
                }))
            }
            else
            {
                console.log("LBAudience:: " + tmplbFavourites[i].LBAudience.Title)    
                lbFavourites.push(tmplbFavourites[i]);
            }
            // Sætter PersonalFavourite==true for at kunne identificere denne favorit til at være en LB favorit
            tmplbFavourites[i].PersonalFavourite==false;
        }
        // const spread = [...tmplbFavourites,...myFavourites];
        const spread = [...lbFavourites,...myFavourites];
        // let arr= spread.sort(function(a,b){return Number(a.PersonalFavourite) -Number(b.PersonalFavourite) });
        
        // var spread = lbFavourites;
        
        // let favInCache: string = JSON.stringify(myFavourites);
        // let favInCache: string = JSON.stringify(spread);
        // window.sessionStorage.setItem(this._sessionStorageKey, favInCache);
        return spread;
        
    }

    public async saveFavourite(favouriteItem: IMyFavouriteItem): Promise<boolean> {
        
        return pnp.sp.web.lists.getByTitle(FAVOURITES_LIST_NAME).items.add({
            'Title': favouriteItem.Title,
            'Description': favouriteItem.Description,
            'ItemUrl': window.location.href,
            'Mandatory':false
        }).then(async (result: ItemAddResult): Promise<boolean> => {
            let addedItem: IMyFavouriteItem = result.data;
            // console.log(addedItem);
            await this.getMyFavourites(false);
            return true;
        }, (error: any): boolean => {
            return false;
        });
    }

    public async deleteFavourite(favouriteItemId: number): Promise<boolean> {
        return pnp.sp.web.lists.getByTitle(FAVOURITES_LIST_NAME).items.getById(favouriteItemId).delete()
        .then(async (): Promise<boolean> => {
            await this.getMyFavourites(false);
            return true;
        }, (error: any): boolean => {
            return false;
        });
    }

    public async updateFavourite(favouriteItem: IMyFavouriteItem): Promise<boolean> {
        return pnp.sp.web.lists.getByTitle(FAVOURITES_LIST_NAME).items.getById(favouriteItem.Id).update({
            'Title': favouriteItem.Title,
            'Description': favouriteItem.Description
        }).then(async (result: ItemUpdateResult): Promise<boolean> => { 
            // console.log(result);
            await this.getMyFavourites(false);
            return true;
        }, (error: any): boolean => {
            return false;
        });
    }

    private _fetchFromSessionStorge(): IMyFavouriteItem[] {

        let result: IMyFavouriteItem[] = [];
        let stringResult: string = window.sessionStorage.getItem(this._sessionStorageKey);
        if (stringResult) {
            try {
                Log.info(LOG_SOURCE, "Fetched favourites from cache");
                result = JSON.parse(stringResult);
            } catch (error) {
                Log.error(LOG_SOURCE, error);
            }
        }
        return result;
    }

    private async _getPersonalFavourites(): Promise<IMyFavouriteItem[]> {
        const currentUserId: number = await this._getUserId();
        const currentUserObject: any = await this._getUserObject();
        console.log(currentUserObject);
        return pnp.sp.web.lists.getByTitle(FAVOURITES_LIST_NAME)
            .items
            .select(
            "Id",
            "Title",
            "ItemUrl",
            "Description",
            "Mandatory"
            )
            .filter("Author eq " + currentUserId)
            .get()
            .then((myFavourites: IMyFavouriteItem[]) => {
                Log.info(LOG_SOURCE, "Fetched favourites from list");
                return myFavourites;
            })
            .catch((error) => {
                Log.error(LOG_SOURCE, error);
                return [];
            });
    }
    private async _getMandatoryFavourites(): Promise<IMyFavouriteItem[]> {
        const w = new Web("https://lbforsikring.sharepoint.com/sites/intra");

        const currentUserId: number = await this._getUserId();


        return w.lists.getByTitle(MANDATORY_FAVOURITES_LIST_NAME)
        .items
        .select(
        "Id",
        "Title",
        "ItemUrl",
        "Description",
        "Mandatory",
        "LBAudience/Title"
        )
        .expand("LBAudience")
        .get()
        .then((myFavourites: IMyFavouriteItem[]) => {
            
            console.log(myFavourites)
            Log.info(LOG_SOURCE, "Fetched favourites from list");
            return myFavourites;
        })
        .catch((error) => {
            Log.error(LOG_SOURCE, error);
            return [];
        });

        
    }
    private async _getLBAudience(lbAudience?:string): Promise<any[]> {
        const w = new Web("https://lbforsikring.sharepoint.com/sites/intra");

        //const currentUserId: number = await this._getUserId();


        return w.lists.getByTitle("LBAudience")
        .items
        .select(
        "Title",
        "Bruger/Title",
        "Bruger/Id"
        ).filter("Title eq '"+lbAudience + "'")
        .expand("Bruger")
        .get()
        .then((users: any[]) => {
            console.log("users from _getLBAudience")
            console.log(users)
            // console.log(users[0].Bruger.Title)
            // console.log(users[0].Bruger.Id)
            // console.log(users[0].Bruger.EMail)
            
            return users[0].Bruger;
        })
        .catch((error) => {
            Log.error(LOG_SOURCE, error);
            return [];
        });

    }

    private _getUserId(): Promise<number> {
        return pnp.sp.site.rootWeb.ensureUser(this._context.pageContext.user.email).then(result => {
            
            return result.data.Id;
        });
    }
    private _getUserObject(): Promise<any> {
        return pnp.sp.site.rootWeb.ensureUser(this._context.pageContext.user.email).then(result => {
            
            return result.data;
        });
    }
}

