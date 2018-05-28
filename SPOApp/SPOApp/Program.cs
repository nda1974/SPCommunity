using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using OfficeDevPnP.Core;
using OfficeDevPnP.Core.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace SPOApp
{
    /// <summary>
    /// http://sharepointfieldnotes.blogspot.dk/2013/06/sharepoint-2013-code-tips-setting.html
    /// https://github.com/SharePoint/PnP/blob/dev/Samples/Provisioning.ModernPages/Provisioning.ModernPages/Program.cs
    /// </summary>
    
    
    
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Create ContentType App [C]");
            Console.WriteLine("Create Modern Pages [M]");
            Console.WriteLine("Publish All Pages [P]");
            var input = Console.ReadLine();
            if (input.ToLower().Equals("c"))
            {
                
                StartCreatingContentType();
            }
            else if (input.ToLower().Equals("m"))
            {
                StartCreatingModernPages();
            }
            else if (input.ToLower().Equals("p"))
            {
                string targetSiteUrl = "https://lboffice365.sharepoint.com/sites/Indbohaandbog/";
                ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl,"","");
                SPOUtility.CheckInAllDocuments(ctx, "Site Pages");
            }

            
            // Update the below variables to use your tenant and account information




            //string userName = "nicd@lboffice365.onmicrosoft.com";
            //SecureString password = GetSecureString("Password");

            //AuthenticationManager am = new AuthenticationManager();

            //using (var cc = am.GetSharePointOnlineAuthenticatedContextTenant(contentTypeHubSiteUrl, userName, password))
            //{
            //    CreateTaxColumn(cc);

            //    CreateLBContentType(cc);

            //    List<pageSettings> pages= GetPages(sourceSiteUrl, cc);
            //    using (var ccc = am.GetSharePointOnlineAuthenticatedContextTenant(targetSiteUrl, userName, password))
            //    {
            //        foreach (var p in pages)
            //        {
            //            CreateModernSitePage(ccc, p);
            //        }
            //    }
                

            //    Web web = cc.Web;
            //    Microsoft.SharePoint.Client.ContentType newContentType = GetContentTypeByName(cc, web, "LBManual");



            //    pageSettings s = GetWikiPages();
            //    var page = cc.Web.AddClientSidePage("PnPRocks11.aspx", true);

            //    ClientSideText txt1 = new ClientSideText() { Text = s.Content };

            //    page.AddControl(txt1, -1);
            //    page.Save();

            //    ListItem item = page.PageListItem;
            //    item.Properties["ContentType"] = "LBManual";
            //    item["ContentTypeId"] = newContentType.StringId;

            //    item.Update();
            //    cc.ExecuteQuery();


            //    SetMetadataField(cc, item, s.ManualSetting);

            //    item.Update();

            //    cc.ExecuteQuery();



            //}
        }
        private static void StartCreatingContentType()
        {

            string sourceSiteUrl = "https://lboffice365.sharepoint.com/sites/MigrateOne";
            string targetSiteUrl = "https://lboffice365.sharepoint.com/sites/Skade/";
            string siteUrl = "https://lboffice365.sharepoint.com/sites/LbCommunicationSite/";


            string contentTypeHubSiteUrl = "https://lboffice365.sharepoint.com/sites/contentTypeHub";

            string contentTypeName = "IndboManual";
            string categoryFieldName = "IndboManualCategory";
            string internalFieldName = "IndboManualCategory";
            string termSetName = "Indbo";
            ClientContext ctxContentTypeHubSiteUrl = SPOUtility.Authenticate(contentTypeHubSiteUrl,"","");

            ContentType.CreateSiteColumn(ctxContentTypeHubSiteUrl, "Indbo kategori", internalFieldName, termSetName);
            ContentType.CreateContentType(ctxContentTypeHubSiteUrl, contentTypeName, categoryFieldName);
        }

        private static void StartCreatingModernPages()
        {

            
            string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skademanuals";
            ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl,"admnicd@lb.dk","MandM777");
            string sourceLibraryName = "Ansvar";
            string targetLibraryName = "SitePages";
            string targetContentTypeName = "SkadeManual";
            SitePages.CreateModernSitePages(ctx, sourceLibraryName,targetLibraryName, targetContentTypeName);


        }
        
        #region Helper methods

        //private static string GetTermIdForTerm(string term, Guid termSetId, ClientContext clientContext)
        //{
        //    string termId = string.Empty;

        //    TaxonomySession tSession = TaxonomySession.GetTaxonomySession(clientContext);
        //    TermStore ts = tSession.GetDefaultSiteCollectionTermStore();
        //    TermSet tset = ts.GetTermSet(termSetId);

        //    LabelMatchInformation lmi = new LabelMatchInformation(clientContext);

        //    lmi.Lcid = 1033;
        //    lmi.TrimUnavailable = true;
        //    lmi.TermLabel = term;

        //    TermCollection termMatches = tset.GetTerms(lmi);
        //    clientContext.Load(tSession);
        //    clientContext.Load(ts);
        //    clientContext.Load(tset);
        //    clientContext.Load(termMatches);

        //    clientContext.ExecuteQuery();

        //    if (termMatches != null && termMatches.Count() > 0)
        //        termId = termMatches.First().Id.ToString();

        //    return termId;

        //}
        //private static ContentType GetContentTypeByName(ClientContext cc, Web web, string name)
        //{
        //    ContentTypeCollection contentTypes = web.ContentTypes;
        //    cc.Load(contentTypes);
        //    cc.ExecuteQuery();
        //    return contentTypes.FirstOrDefault(o => o.Name == name);
        //}

        //private static SecureString GetSecureString(string label)

        //{
        //    var data = "MandM1974";
        //    SecureString secure = new SecureString();
        //    foreach (var character in data.ToCharArray())
        //        secure.AppendChar(character);
        //    SecureString sStrPwd = new SecureString();
        //    sStrPwd = secure;
        //    return sStrPwd;

        //    //try

        //    //{

        //    //    Console.Write(String.Format("{0}: ", label));



        //    //    for (ConsoleKeyInfo keyInfo = Console.ReadKey(true); keyInfo.Key != ConsoleKey.Enter; keyInfo = Console.ReadKey(true))

        //    //    {

        //    //        if (keyInfo.Key == ConsoleKey.Backspace)

        //    //        {

        //    //            if (sStrPwd.Length > 0)

        //    //            {

        //    //                sStrPwd.RemoveAt(sStrPwd.Length - 1);

        //    //                Console.SetCursorPosition(Console.CursorLeft - 1, Console.CursorTop);

        //    //                Console.Write(" ");

        //    //                Console.SetCursorPosition(Console.CursorLeft - 1, Console.CursorTop);

        //    //            }

        //    //        }

        //    //        else if (keyInfo.Key != ConsoleKey.Enter)

        //    //        {

        //    //            Console.Write("*");

        //    //            sStrPwd.AppendChar(keyInfo.KeyChar);

        //    //        }



        //    //    }

        //    //    Console.WriteLine("");

        //    //}

        //    //catch (Exception e)

        //    //{

        //    //    sStrPwd = null;

        //    //    Console.WriteLine(e.Message);

        //    //}



        //    //return sStrPwd;

        //}


        #endregion

        //private static pageSettings GetWikiPages()
        //{
        //    pageSettings p;
        //    p.Content = "";
        //    p.ManualSetting = "";
        //    p.Title = "";
        //    p.FileName = "";

        //    // Starting with ClientContext, the constructor requires a URL to the 
        //    // server running SharePoint. 
        //    //ClientContext context = new ClientContext("https://lboffice365.sharepoint.com/sites/LbCommunicationSite");
        //    ClientContext context = new ClientContext("https://lboffice365.sharepoint.com/sites/MigrateOne");
        //    SecureString password = GetSecureString("Password");
        //    context.Credentials = new SharePointOnlineCredentials("nicd@lboffice365.onmicrosoft.com", password);


        //    //List sourceSitePagesLibrary = context.Web.Lists.GetByTitle("Site Pages");
        //    List sourceSitePagesLibrary = context.Web.Lists.GetByTitle("Pages");

        //    CamlQuery query = CamlQuery.CreateAllItemsQuery();
        //    ListItemCollection items = sourceSitePagesLibrary.GetItems(query);
        //    context.Load(items);
        //    context.ExecuteQuery();

        //    foreach (ListItem listItem in items)
        //    {
        //        //if (listItem["ContentType"].ToString()=="")
        //        //{

        //        //}


        //        if (listItem["Title"].Equals("NICD"))
        //        {
        //            File f = listItem.File;

        //            var value = listItem["ManualCategory"];
        //            var taxonomyFieldValue = value as TaxonomyFieldValueCollection;
        //            p.Content = listItem["WikiField"].ToString();

        //            if (taxonomyFieldValue.Count == 0)
        //            {
        //                p.ManualSetting = taxonomyFieldValue[0].Label;
        //                return p;
        //            }
        //        }
        //    }
        //    return p;
        //}

        //private static void SetMetadataField(ClientContext ctx, ListItem item, string term)
        //{
        //    List sitePagesList = ctx.Web.Lists.GetByTitle("Site Pages");
        //    Field field = sitePagesList.Fields.GetFieldByInternalName("ManualCategory");

        //    ctx.Load(field);
        //    ctx.ExecuteQuery();

        //    TaxonomyField txField = ctx.CastTo<TaxonomyField>(field);
        //    string termId = GetTermIdForTerm(term, txField.TermSetId, ctx);

        //    TaxonomyFieldValue termValue = new TaxonomyFieldValue();
        //    termValue.Label = term;
        //    termValue.TermGuid = termId;
        //    termValue.WssId = -1;
        //    txField.SetFieldValueByValue(item, termValue);
        //}
        //private static List<pageSettings> GetPages(string sourceUrl, ClientContext context)
        //{
        //    List<pageSettings> returnLst = new List<pageSettings>();

            
            
        //    List sourceSitePagesLibrary = context.Web.Lists.GetByTitle("Pages");

        //    CamlQuery query = CamlQuery.CreateAllItemsQuery();
        //    ListItemCollection items = sourceSitePagesLibrary.GetItems(query);
        //    context.Load(items);
        //    context.ExecuteQuery();
            
        //    foreach (ListItem listItem in items)
        //    {
        //        if (listItem.FileSystemObjectType == FileSystemObjectType.File && listItem["PublishingPageContent"]!=null)
        //        {
        //            pageSettings p;
        //            p.Content = "";
        //            p.ManualSetting = "";
        //            p.Title = listItem["FileLeafRef"].ToString().Split('.')[0];
        //            p.FileName = listItem["FileLeafRef"].ToString();
        //            p.Content = listItem["PublishingPageContent"].ToString();

        //            returnLst.Add(p);
        //        }
        //    }
        //    return returnLst;
        //}
        //private static void CreateModernSitePage(ClientContext ctx, pageSettings p)
        //{
        //    var page = ctx.Web.AddClientSidePage(p.FileName, true);
        //    ClientSideText txt1 = new ClientSideText() { Text = p.Content};

        //    page.AddControl(txt1, -1);
        //    page.Save();

        //    ListItem item = page.PageListItem;
        //    item.Properties["Title"] = p.Title;
            

        //    item.Update();
        //    ctx.ExecuteQuery();

        //}
        private static void GetManualPages()
        {

        }
        private static void CreateLBContentType(ClientContext ctx)
        {
            
            //ContentTypeCollection contentTypes = ctx.Web.ContentTypes;
            //ctx.Load(contentTypes);
            //ctx.ExecuteQuery();

            
            //// Create a Content Type Information object.
            //ContentTypeCreationInformation newCt = new ContentTypeCreationInformation();
            
            //// Set the name for the content type.
            //newCt.Name = "Indbo håndbog";


            ////Site Page - 0x0101009D1CB255DA76424F860D91F20E6C4118
            //newCt.ParentContentType = ctx.Web.ContentTypes.GetById("0x0101009D1CB255DA76424F860D91F20E6C4118"); 
            
            //// Set content type to be available from specific group.
            //newCt.Group = "LB Content Types";


            //// Create the content type.
            //Microsoft.SharePoint.Client.ContentType myContentType = contentTypes.Add(newCt);
            //myContentType.FieldLinks.Add(new FieldLinkCreationInformation {
            //    Field= ctx.Site.RootWeb.Fields.GetFieldByInternalName("LBManualCategory")
            //});

            //ctx.ExecuteQuery();

            ////Using AddFieldAsXml you can add fields to the FieldCollection of a site collection:
            //FieldCollection fields = ctx.Web.Fields;
            //ctx.Load(fields);
            //ctx.ExecuteQuery();


            //foreach (var f in fields)
            //{
            //    if (f.InternalName.Equals("LBManualCategory"))
            //    {
                    
            //    }
                
            //}
            ////string FieldAsXML = @"<Field ID='{4F34B2ED-9CFF-4900-B091-4C0033F89944}' Name='ContosoString' DisplayName='Contoso String' Type='Text' Hidden='False' Group='Contoso Site Columns' Description='Contoso Text Field' />";
            ////Field fld = fields.AddFieldAsXml(FieldAsXML, true, AddFieldOptions.DefaultValue);
            ////ctx.Load(fields);
            ////ctx.Load(fld);
            ////ctx.ExecuteQuery();
        }
        


    }
}

