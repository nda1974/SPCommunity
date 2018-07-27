using Microsoft.Office.Interop.Word;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using OfficeDevPnP.Core;
using OfficeDevPnP.Core.Pages;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SPOApp
{
    /// <summary>
    /// http://sharepointfieldnotes.blogspot.dk/2013/06/sharepoint-2013-code-tips-setting.html
    /// https://github.com/SharePoint/PnP/blob/dev/Samples/Provisioning.ModernPages/Provisioning.ModernPages/Program.cs
    /// </summary>


    
    public struct SitePageProperies
    {
        public string ManualCategory;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct BilSkadePortalGuideManualProperies
    {
        public string BilSkadePortalGuideCategory;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct AnsvarManualProperies
    {
        public string AnsvarCategory;
        public string AnsvarArea;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct BaadManualProperies
    {
        public string BaadCategory;
        public string BaadArea;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    
    
    public struct BygningManualProperies
    {
        public string BygningCategory;
        public string BygningArea;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct BeredskabManualProperies
    {
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct EnterpriseManualProperies
    {
        public string WikiContent;
        public string FileName;
        public string Title;
    }

    public struct BilManualProperies
    {
        public string BilCategory;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct EjerskifteManualProperies
    {
        public string EjerskifteCategory;
        public string EjerskifteArea;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct ErhvervManualProperies
    {
        public string ErhvervCategory;
        public string ErhvervArea;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct GerningsmandManualProperies
    {
        public string GerningsmandCategory;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct HundManualProperies
    {
        public string HundCategory;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct IndboManualProperies
    {
        public string IndboCategory;
        public string IndboArea;
        public string WikiContent;
        public string FileName;
        public string Title;
        public string LBInfo;
        public string LBTeaser;
        public string LBKendelser;

    }

    public struct GenericManualProperies
    {
        public string Gruppe;
        public string UnderGruppe;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct GenericConfiguration
    {
        public string ContentTypeName;
        public string SourceLibrary;
    }
    

    class Program
    {
   

    private static void CheckForTextField(ClientContext context, string fileName)
        {
            ClientSidePage p = ClientSidePage.Load(context, fileName);
            if (p.Controls.Count == 0)
            {
                p.AddControl(new ClientSideText());
                p.Save();
                p.Publish();
            }
        }
        private static void CopyService()
        {

            copyService.Copy headerCopier = new copyService.Copy();
            headerCopier.Credentials = System.Net.CredentialCache.DefaultCredentials;

            copyService.FieldInformation[] fieldInformation;
            byte[] topicContentBytes;

            uint myGetUint = headerCopier.GetItem(
                                                    @"http://intranet.lb.dk/Skade/hb/indbo/SitePages/Afdragsordninger.aspx",
                                                    out fieldInformation,
                                                    out topicContentBytes);
            //
            // This is an ugly, ugly hack. The Wiki pages have some fantastic c#/asp code on them
            // that is horribly horribly ugly, and I don't want to paste it in anywhere.
            // we retrieve it from the web Home topic, and append it to 
            // each item we add.
            //
            var wikiHeader = topicContentBytes;
            string decodedString = System.Text.ASCIIEncoding.ASCII.GetString(topicContentBytes);


            
            //copyService.FieldInformation wikiField = new copyService.FieldInformation();
            //wikiField.DisplayName = "Wiki Content";
            //wikiField.InternalName = "WikiField";
            //wikiField.Type = copyService.FieldType.Text;
            //wikiField.Value = wikiTopic.topicWikiMarkup;
        }
        public static void CreateWordDocument(string txt)
        {
            var app = new Microsoft.Office.Interop.Word.Application();
            
            object oMissing = System.Reflection.Missing.Value;
            Microsoft.Office.Interop.Word._Document oDoc = app.Documents.Add(ref oMissing, ref oMissing,
            ref oMissing, ref oMissing);
            
            object start = 0;
            object end = 0;

            ////Range r = oDoc.Range();
            Clipboard.SetText(txt,TextDataFormat.Html);
            ////wdFormatOriginalFormatting
            //oDoc.Content.Text = Clipboard.GetText(TextDataFormat.Text);


            oDoc.Activate();
            oDoc.ActiveWindow.Selection.WholeStory();
            oDoc.ActiveWindow.Selection.PasteAndFormat(WdRecoveryType.wdFormatOriginalFormatting);
            


            //r.Text = txt;
            
            app.ActiveDocument.SaveAs2(@"C:\Test\CreateMigrateTest.docx");
            object nullobj = System.Reflection.Missing.Value;
            oDoc.Close(ref nullobj, ref nullobj, ref nullobj);
            app.Quit(ref nullobj, ref nullobj, ref nullobj);

        }
        public static string ReadFromWordDocument(string txt)
        {

            Microsoft.Office.Interop.Word.Application wordApp = new Microsoft.Office.Interop.Word.Application();
            object file = @"C:\Test\MigrateTest.docx";
            object nullobj = System.Reflection.Missing.Value;

            Microsoft.Office.Interop.Word.Document doc = wordApp.Documents.Open(
                ref file, ref nullobj, ref nullobj,
                ref nullobj, ref nullobj, ref nullobj,
                ref nullobj, ref nullobj, ref nullobj,
                ref nullobj, ref nullobj, ref nullobj);


            //Microsoft.Office.Interop.Word.Range rng = doc.Content;
            //doc.Content.Copy();
            //Clipboard.SetDataObject(doc.Content);


            doc.Activate();
            doc.ActiveWindow.Selection.WholeStory();
            doc.ActiveWindow.Selection.Copy();
            //Clipboard.SetText(doc.Content.Text);
            //doc.ActiveWindow.Selection.PasteAndFormat(WdRecoveryType.wdFormatOriginalFormatting)
            System.Windows.Forms.IDataObject data = Clipboard.GetDataObject();
            string getdata = data.GetData(DataFormats.StringFormat).ToString();
            //rng.Select();
            //rng.Copy();
            
            Console.WriteLine(getdata);
            
            //return doc.Content.Text;
            return Clipboard.GetText(TextDataFormat.Html);
            //Console.WriteLine(rng.Text);

            //return rng.Text;
            //string s = Clipboard.GetText(TextDataFormat.Html).ToString();
            //Console.WriteLine("From Clipboard");
            //Console.WriteLine(s);
            

            //doc.ActiveWindow.Selection.WholeStory();
            //doc.ActiveWindow.Selection.Copy();
            //System.Windows.Forms.IDataObject data = Clipboard.GetDataObject();


            //string getdata = data.GetData(DataFormats.Text).ToString();

            //doc.Close(ref nullobj, ref nullobj, ref nullobj);
            //wordApp.Quit(ref nullobj, ref nullobj, ref nullobj);
            //return getdata;
        }
        
        static void Main(string[] args)
        {
            
            //EmptyRecycleBin();
            //CopyService();

            //CreateWordDocument("");
            //return;
            //ReadFromWordDocument("");
            //CheckForTextField(SPOUtility.Authenticate("https://lbforsikring.sharepoint.com/sites/skade", "admnicd@lb.dk", "MandM777"));



            //NewMethod(SPOUtility.Authenticate("https://lbforsikring.sharepoint.com/sites/PoliceTemp", "sadmnicd@lbforsikring.onmicrosoft.com", "MandM777"));
            //NewMethod(SPOUtility.Authenticate("https://lbforsikring.sharepoint.com/sites/PoliceTemp", "admnicd@lb.dk", "MandM777"));
            //return;

            System.Diagnostics.Debugger.Launch();
            Console.WriteLine("Convert pagelayout [X]");
            Console.WriteLine("Create ContentType App [C]");
            Console.WriteLine("Check for links in WikiFields [W]");
            Console.WriteLine("Create Modern Pages [M]");
            Console.WriteLine("Publish All Pages [P]");
            var input = Console.ReadLine();
            if (input.ToLower().Equals("x"))
            {
                string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";
                ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM777");
                var lst = ctx.Web.Lists.GetByTitle("Webstedssider");
                ctx.Load(lst);
                ctx.ExecuteQuery();
                CamlQuery cq = new CamlQuery();
                string s = "<Where><Eq><FieldRef Name=\"ContentType\" /><Value Type=\"Computed\">IndboManual</Value></Eq></Where>";
                
                cq.ViewXml = string.Format("<View Scope=\"RecursiveAll\">{0}</View>", s); 
                ListItemCollection collListItem = lst.GetItems(cq);
                ctx.Load(collListItem);
                ctx.ExecuteQuery();
                foreach (ListItem item in collListItem)
                {
                    ctx.Load(item.ContentType);
                    ctx.ExecuteQuery();
                    Console.WriteLine(item.ContentType.Name);
                    if (item.ContentType.Name.Equals("IndboManual"))
                    {
                        item.DeleteObject();
                        ctx.ExecuteQuery();
                    }
                    
                }

            }
            else if (input.ToLower().Equals("c"))
            {
                StartCreatingContentType();
            }
            else if (input.ToLower().Equals("m"))
            {
                StartCreatingModernPages();
            }
            else if (input.ToLower().Equals("w"))
            {
                Console.WriteLine("Båd [1]");
                Console.WriteLine("Beredskab [2]");
                Console.WriteLine("Byg [3]");
                string choice=Console.ReadLine();
                string ctName = "";
                if (choice == "1")
                {
                    ctName = "BaadManual";
                }
                else if (choice == "2")
                {
                    ctName = "BeredskabManual";
                }
                else if (choice == "3")
                {
                    ctName = "BygningManual";
                }
                string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";
                ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM5555");
                string sitePagesLibrary= "Webstedssider";

                LinksUtility.CheckForLinks(ctx, sitePagesLibrary,ctName);
                
                Console.WriteLine("Done searching for links");
                Console.ReadLine();
            }
            else if (input.ToLower().Equals("p"))
            {
                string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";
                ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl,"","");
                SPOUtility.CheckInAllDocuments(ctx, "Webstedssider");
            }

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

            string sourceLibraryName = "";
            string targetLibraryName = "SitePages";
            targetLibraryName = "Webstedssider";


            string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";
            //targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/sandkasse";




            ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM4444");




            Console.WriteLine("Create Generic Manuals [X]");


            //Console.WriteLine("Create Ansvar Manuals [A]");
            //Console.WriteLine("Create Beredskab Manuals [B]");
            //Console.WriteLine("Create Bil Manuals [C]");
            //Console.WriteLine("Create BilskadePortalGuide Manuals [D]");
            //Console.WriteLine("Create Bygning Manuals [E]");
            //Console.WriteLine("Create Båd Manuals [F]");
            //Console.WriteLine("Create Ejerskifte Manuals [G]");
            //Console.WriteLine("Create Enterprise Manuals [H]");
            //Console.WriteLine("Create Erhverv Manuals [I]");
            //Console.WriteLine("Create Gerningsmand Manuals [J]");
            //Console.WriteLine("Create Hund Manuals [K]");
            //Console.WriteLine("Create Indbo Manuals [L]");
            var input = Console.ReadLine();


            GenericConfiguration g;
            g.ContentTypeName = "";
            g.SourceLibrary = "";

            if (input.ToLower().Equals("x"))
            {
                Console.WriteLine("Vælg branch:");
                Console.WriteLine("Bygning [1]");
                
                string branch = Console.ReadLine();
                if (branch=="1")
                {
                    
                    g.ContentTypeName = "BygningManual";
                    g.SourceLibrary = "Bygwebsider";
                }

                
                List<GenericManualProperies> manuals = GenericManual.GetSourceFiles(ctx, g);
                GenericManual.CreateModernSitePages(ctx, manuals,g);
            }
            //else if (input.ToLower().Equals("a"))
            //{
            //    sourceLibraryName = "Ansvar";

            //    List<AnsvarManualProperies> AnsvarManuals = Ansvar.GetSourceFiles(ctx, sourceLibraryName);
            //    Ansvar.CreateModernSitePages(ctx, AnsvarManuals);
            //}
            //else if (input.ToLower().Equals("b"))
            //{
            //    sourceLibraryName = "Beredskab";

            //    List<BeredskabManualProperies> BeredskabManuals = Beredskab.GetSourceFiles(ctx, sourceLibraryName);
            //    Beredskab.CreateModernSitePages(ctx, BeredskabManuals);
            //}
            //else if (input.ToLower().Equals("c"))
            //{
            //    sourceLibraryName = "Bil";

            //    List<BilManualProperies> BilManuals = Bil.GetSourceFiles(ctx, sourceLibraryName);
            //    Bil.CreateModernSitePages(ctx, BilManuals);
            //}
            //else if (input.ToLower().Equals("d"))
            //{
            //    sourceLibraryName = "Bilskade Portal Guide";

            //    List<BilSkadePortalGuideManualProperies> BilSkadePortalGuideManuals = BilSkadePortalGuide.GetSourceFiles(ctx, sourceLibraryName);
            //    BilSkadePortalGuide.CreateModernSitePages(ctx, BilSkadePortalGuideManuals);
            //}
            //else if (input.ToLower().Equals("e"))
            //{
            //    sourceLibraryName = "Bygwebsider";

            //    List<BygningManualProperies> BygningManuals = Bygning.GetSourceFiles(ctx, sourceLibraryName);
            //    Bygning.CreateModernSitePages(ctx, BygningManuals);
            //}
            //else if (input.ToLower().Equals("f"))
            //{
            //    sourceLibraryName = "Baad";

            //    List<BaadManualProperies> BaadManuals = Baad.GetSourceFiles(ctx, sourceLibraryName);
            //    Baad.CreateModernSitePages(ctx, BaadManuals);
            //}
            //else if (input.ToLower().Equals("g"))
            //{
            //    sourceLibraryName = "Ejerskifte";

            //    List<EjerskifteManualProperies> EjerskifteManuals = Ejerskifte.GetSourceFiles(ctx, sourceLibraryName);
            //    Ejerskifte.CreateModernSitePages(ctx, EjerskifteManuals);
            //}
            //else if (input.ToLower().Equals("h"))
            //{
            //    sourceLibraryName = "Enterprise";

            //    List<EnterpriseManualProperies> EnterpriseManuals = Enterprise.GetSourceFiles(ctx, sourceLibraryName);
            //    Enterprise.CreateModernSitePages(ctx, EnterpriseManuals);
            //}
            //else if (input.ToLower().Equals("i"))
            //{
            //    sourceLibraryName = "Erhverv";

            //    List<ErhvervManualProperies> ErhvervManuals = Erhverv.GetSourceFiles(ctx, sourceLibraryName);
            //    Erhverv.CreateModernSitePages(ctx, ErhvervManuals);
            //}
            //else if (input.ToLower().Equals("j"))
            //{
            //    sourceLibraryName = "Gerningsmand";

            //    List<GerningsmandManualProperies> GerningsmandManuals = Gerningsmand.GetSourceFiles(ctx, sourceLibraryName);
            //    Gerningsmand.CreateModernSitePages(ctx, GerningsmandManuals);
            //}
            //else if (input.ToLower().Equals("k"))
            //{
            //    sourceLibraryName = "Hund";

            //    List<HundManualProperies> HundManuals = Hund.GetSourceFiles(ctx, sourceLibraryName);
            //    Hund.CreateModernSitePages(ctx, HundManuals);
            //}
            //else if (input.ToLower().Equals("l"))
            //{
            //    sourceLibraryName = "Indbo";
            //    sourceLibraryName = "Websider";
            //    sourceLibraryName = "IndboFromLBIntranet";
                

            //    List<IndboManualProperies> IndboManuals = Indbo.GetSourceFiles(ctx, sourceLibraryName);
            //    Indbo.CreateModernSitePages(ctx, IndboManuals);
            //}







            //SitePages.CreateModernSitePages(ctx, sourceLibraryName,targetLibraryName, targetContentTypeName);
            //SitePages.CreateModernSitePages(ctx, sourceLibraryName, targetLibraryName, targetContentTypeName);


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

