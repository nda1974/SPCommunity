using Microsoft.Office.Interop.Word;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using Microsoft.VisualBasic.FileIO;
using OfficeDevPnP.Core;
using OfficeDevPnP.Core.Pages;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices.ComTypes;
using System.Security;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SPOApp
{
    /// <summary>
    /// http://sharepointfieldnotes.blogspot.dk/2013/06/sharepoint-2013-code-tips-setting.html
    /// https://github.com/SharePoint/PnP/blob/dev/Samples/Provisioning.ModernPages/Provisioning.ModernPages/Program.cs
    /// </summary>
    #region STRUCTS

    public struct SitePageProperies
    {
        public string ManualCategory;
        public string WikiContent;
        public string FileName;
        public string Title;
    }



    public struct GenericManualProperies
    {
        public string Gruppe;
        public string UnderGruppe;
        public string WikiContent;
        public string FileName;
        public string Title;
    }
    public struct GenericManualStruct
    {
        public string Gruppe;
        public string UnderGruppe;
        public string WikiContent;
        public string FileName;
        public string Title;
        public string Branche;
    }
    public struct GenericConfiguration
    {
        public string ContentTypeName;
        public string SourceLibrary;
    }
    public struct FileWithLinks
    {
        public string FileName;
        public string OriginalLink;
        public string NewLink;
        public string CoincidenceFilePrefix;
    }

    #endregion


    public static class MigrationEngine
    {
        public static List<GenericManualStruct> GetSourceFilesFromCSV(string sourceFilesFilePath)
        {
            List<GenericManualStruct> pages = new List<GenericManualStruct>();
            using (TextFieldParser parser = new TextFieldParser(sourceFilesFilePath))
            {
                parser.TextFieldType = Microsoft.VisualBasic.FileIO.FieldType.Delimited;
                parser.SetDelimiters(";");
                string[] fields = parser.ReadFields();
                while (!parser.EndOfData)
                {
                    GenericManualStruct page;
                    //Process row
                    //string[] fields = parser.ReadFields();

                    string line = parser.ReadLine();
                    page.FileName = line.Split(';')[0];
                    page.Gruppe = line.Split(';')[1];
                    page.UnderGruppe = line.Split(';')[2];
                    page.Branche = line.Split(';')[3];
                    page.WikiContent = "[TODO]";
                    //line.Substring(0, line.LastIndexOf('.'))
                    //page.Title = line.Split(';')[0].Split('.')[0];
                    string title = line.Split(';')[0];
                    page.Title = title.Substring(0, title.LastIndexOf('.'));
                    pages.Add(page);
                }
            }
            return pages;
        }
        public static bool IsPageCoincidence(GenericManualStruct CurrentManual, List<List<GenericManualStruct>> ManualCollection)
        {
            foreach (List<GenericManualStruct> lstManual in ManualCollection)
            {
                foreach (GenericManualStruct manual in lstManual)
                {
                    if (manual.FileName.Equals(CurrentManual.FileName) && !manual.Branche.Equals(CurrentManual.Branche))
                    {
                        Console.WriteLine(manual.Branche + ":" + manual.FileName);
                        Console.WriteLine(CurrentManual.Branche + ":" + CurrentManual.FileName);
                        return true;
                    }

                }

            }
            return false;

        }

        private static string GetImageUrl(GenericManualStruct g)
        {
            switch (g.Branche)
            {
                case "Retshjælp":
                    return @"https://lbforsikring.sharepoint.com/sites/Skade/SiteAssets/ikoner/Retshjælp.png";
                case "Gerningsmand":
                    return @"https://lbforsikring.sharepoint.com/sites/Skade/SiteAssets/ikoner/Gerningsmand.png";
                case "Hund":
                    return @"https://lbforsikring.sharepoint.com/sites/Skade/SiteAssets/ikoner/Hund.png";
                case "Sanering":
                    return @"https://lbforsikring.sharepoint.com/sites/Skade/SiteAssets/ikoner/Sanering.png";
                case "BPG":
                    return @"https://lbforsikring.sharepoint.com/sites/Skade/SiteAssets/ikoner/BilskadePortal.png";
                case "Skadeservice":
                    return @"https://lbforsikring.sharepoint.com/sites/Skade/SiteAssets/ikoner/Skadeservice.png";
                case "ScalePoint":
                    return @"https://lbforsikring.sharepoint.com/sites/Skade/SiteAssets/ikoner/ScalePoint.png";
                case "Ansvar":
                    return @"https://lbforsikring.sharepoint.com/sites/Skade/SiteAssets/ikoner/Ansvar.png";
                case "Bil":
                    return @"https://lbforsikring.sharepoint.com/sites/Skade/SiteAssets/ikoner/Bil.png";
                case "Bygning":
                    return @"https://lbforsikring.sharepoint.com/sites/Skade/SiteAssets/ikoner/hus.png";
                case "Indbo":
                    return @"https://lbforsikring.sharepoint.com/sites/Skade/SiteAssets/ikoner/indbo.png";
                case "Personskade":
                    return @"https://lbforsikring.sharepoint.com/sites/Skade/SiteAssets/ikoner/personskade.png";
                case "Rejse":
                    return @"https://lbforsikring.sharepoint.com/sites/Skade/SiteAssets/ikoner/rejse.png";
                case "Regres":
                    return @"https://lbforsikring.sharepoint.com/sites/Skade/SiteAssets/ikoner/regres.png";
                case "Storskade":
                    return @"https://lbforsikring.sharepoint.com/sites/Skade/SiteAssets/ikoner/Storskade.png";
                default:
                    return string.Empty;
            }
        }
        public static void CreateNewModernPage(ClientContext ctx, GenericManualStruct p, string fileNameMatchedAgainstCoicidence)
        {
            try
            {
                ClientSidePage page = ctx.Web.AddClientSidePage(fileNameMatchedAgainstCoicidence, true);
                Microsoft.SharePoint.Client.ContentType newContentType = ctx.Web.GetContentTypeByName("Skadehåndbog");
                ctx.Load(newContentType);
                ctx.ExecuteQuery();

                ListItem item = page.PageListItem;
                ctx.Load(item);
                ctx.ExecuteQuery();
                item.Properties["ContentTypeId"] = newContentType.Id.StringValue;
                item["ContentTypeId"] = newContentType.Id;
                item["PageLayoutType"] = "Article";
                //item["BannerImageUrl"] = GetImageUrl(p);
                item.Update();

                if (!string.IsNullOrEmpty(p.Gruppe))
                {
                    SPOUtility.SetMetadataField(ctx, item, p.Gruppe, "Gruppe", p.Branche);
                    item.Update();
                }
                if (!string.IsNullOrEmpty(p.UnderGruppe))
                {
                    SPOUtility.SetMetadataField(ctx, item, p.UnderGruppe, "Undergruppe", p.Branche);
                    item.Update();
                }

                SPOUtility.SetMetadataField(ctx, item, p.Branche, "H_x00e5_ndbog");
                item.Update();
                ctx.Load(item);
                ctx.ExecuteQuery();

                page.PageTitle = p.FileName.Substring(0, p.FileName.Length - 5);
                page.AddSection(CanvasSectionTemplate.TwoColumnLeft, 1);

                CanvasSection section = page.Sections[0];
                ClientSideText t = new ClientSideText() { Text = "[TODO]" };
                page.AddControl(t, section.Columns[0], 0);


                ClientSideWebPart imageWebPart = page.InstantiateDefaultWebPart(DefaultClientSideWebParts.Image);
                imageWebPart.Properties["imageSourceType"] = 2;
                imageWebPart.Properties["imageSource"] = GetImageUrl(p);

                page.AddControl(imageWebPart, section.Columns[1], 0);
                page.Save();
                page.Publish();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static void ChangePageLayoutType(ClientContext ctx, List<List<GenericManualStruct>> L)
        {
            foreach (List<GenericManualStruct> lstManual in L)
            {
                foreach (GenericManualStruct manual in lstManual)
                {
                    try
                    {
                        ClientSidePage clientPage = ClientSidePage.Load(ctx, manual.FileName);
                        //Microsoft.SharePoint.Client.ContentType newContentType = ctx.Web.GetContentTypeByName("Skadehåndbog");
                        //ctx.Load(newContentType);
                        //ctx.ExecuteQuery();

                        ListItem item = clientPage.PageListItem;
                        ctx.Load(item);
                        ctx.ExecuteQuery();
                        item["PageLayoutType"] = "Article";
                        item["BannerImageUrl"] = GetImageUrl(manual);

                        item.Update();
                        ctx.Load(item);
                        ctx.ExecuteQuery();
                        clientPage.Save();
                        clientPage.Publish();
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
            }
        }


    }
    class Program
    {
        private const string COINCIDENCE_IN_FILES_FILEPATH = @"C:\Git\LBIntranet\Powershell\MigratePages\CoincidenceFeature\CoincidenceOfFilenamesFiltered.csv";
        private const string LINKS_IN_PAGES_FILEPATH = @"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\importfiles\LinkMigration\Indbo_LinksRepair.csv";

        private const string LINKS_IN_CONTENT_LOG_FILEPATH = @"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\OutputLinksLOG\";
        private const string VALIDATE_CONTENT_LOG_FILEPATH = @"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\ValidateContentResultLOG\";

        private const string SHAREPOINT_2_EXCEL_FILEPATH = @"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\importfiles\SharePoint2Excel\";
        private static List<string> lstCreateModernPagesLog;
        private static List<string> lstLinksInContent = new List<string>();
        private static List<string> lstLog = new List<string>();
        private static List<string> lstValidateContent = new List<string>();

        private static List<string> lstError = new List<string>();
        public static string IsPageCoincidence(string fileName)
        {

            using (var reader = new StreamReader(COINCIDENCE_IN_FILES_FILEPATH))
            {
                List<string> listA = new List<string>();
                List<string> listB = new List<string>();
                while (!reader.EndOfStream)
                {

                    var line = reader.ReadLine();
                    var values = line.Split(';');
                    //Console.WriteLine(values[0] + " - " + values[1]);
                    if (values[1] == fileName)
                    {
                        return values[0];
                    }

                }
            }
            return null;

        }


        //public static List<FileWithLinks> GetFilesWithLinks()
        //{
        //    List<FileWithLinks> resFiles = new List<FileWithLinks>();
        //    using (var reader = new StreamReader(LINKS_IN_PAGES_FILEPATH, Encoding.UTF8))
        //    {
        //        while (!reader.EndOfStream)
        //        {
        //            var line = reader.ReadLine();
        //            var values = line.Split(';');

        //            FileWithLinks fwl;
        //            fwl.FileName = values[0];
        //            fwl.OriginalLink = values[1];
        //            fwl.NewLink = values[2];
        //            fwl.CoincidenceFilePrefix = values[3];
        //            resFiles.Add(fwl);

        //        }
        //    }
        //    return resFiles;

        //}
        public static void GetLinksInText(string input, string fileName, string branch)
        {
            Regex regex = new Regex("href\\s*=\\s*(?:\"(?<1>[^\"]*)\"|(?<1>\\S+))", RegexOptions.IgnoreCase);
            Match match;

            for (match = regex.Match(input); match.Success; match = match.NextMatch())
            {
                foreach (System.Text.RegularExpressions.Capture capture in match.Captures)
                {
                    //TODO to find inline img
                }
            }
            Console.WriteLine("--------------------------------------------");


        }
        public static void ValidateContent(ClientContext ctx, string branch)
        {
            lstValidateContent.Add("Filnavn;Gruppe;Undergruppe;Branche;Content");
            lstLinksInContent.Add("Filnavn;Gruppe;Undergruppe;Branche;Content");
            CamlQuery camlQuery = new CamlQuery();
            string viewXml = string.Format(@"
                    <View>
                        <Query>
                            <Where>
                                <Eq>
                                    <FieldRef Name='H_x00e5_ndbog' />
                                    <Value Type='Text'>{0}</Value>
                                </Eq>
                            </Where>
                        </Query>
                    </View>", branch);

            camlQuery.ViewXml = viewXml;

            var oList = ctx.Web.Lists.GetByTitle("Webstedssider");

            ListItemCollection collListItem = oList.GetItems(camlQuery);
            ctx.Load(collListItem);
            ctx.ExecuteQuery();

            List<string> pdfList = new List<string>();

            foreach (ListItem item in collListItem)
            {
                ClientSidePage clientPage = ClientSidePage.Load(ctx, item["FileLeafRef"].ToString());
                foreach (var section in clientPage.Sections)
                {
                    foreach (var control in section.Controls)
                    {
                        if (control.Type.Name == "ClientSideText")
                        {
                            ClientSideText t = (ClientSideText)control;
                            if (t.Text.Contains("<p>a</p>") ||
                                t.Text.Contains("<p>v</p>") ||
                                t.Text.Contains("[TODO]") ||
                                t.Text.Length < 10)
                            {
                                Console.ForegroundColor = ConsoleColor.Yellow;

                                string strWriteLine = String.Format("{0};{1};{2};{3};{4}",
                                                                    item["FileLeafRef"],
                                                                    item["Gruppe"] != null ? item["Gruppe"].ToString() : "Gruppe",
                                                                    item["Undergruppe"] != null ? item["Undergruppe"].ToString() : "Undergruppe",
                                                                    branch,
                                                                    t.Text
                                                                    );
                                lstValidateContent.Add(strWriteLine);

                                Console.ForegroundColor = ConsoleColor.White;
                            }
                            if (t.Text.Contains(@"_layouts/images/pdf16.gif"))
                            {
                                pdfList.Add(item["FileLeafRef"].ToString());
                            }

                            Regex regex = new Regex("href\\s*=\\s*(?:\"(?<1>[^\"]*)\"|(?<1>\\S+))", RegexOptions.IgnoreCase);
                            Match match;
                            for (match = regex.Match(t.Text); match.Success; match = match.NextMatch())
                            {
                                foreach (System.Text.RegularExpressions.Capture capture in match.Captures)
                                {
                                    string strWriteLine = String.Format("{0};{1};{2};{3};{4}",
                                                                    item["FileLeafRef"],
                                                                    item["Gruppe"] != null ? item["Gruppe"].ToString() : "Gruppe",
                                                                    item["Undergruppe"] != null ? item["Undergruppe"].ToString() : "Undergruppe",
                                                                    branch,
                                                                    capture
                                                                    );

                                    lstLinksInContent.Add(strWriteLine);
                                }
                            }
                        }
                    }
                }


                Console.WriteLine(clientPage.Controls);
            }

            System.IO.File.WriteAllLines(VALIDATE_CONTENT_LOG_FILEPATH + branch + ".csv", lstValidateContent.ToArray(), Encoding.UTF8);
            System.IO.File.WriteAllLines(LINKS_IN_CONTENT_LOG_FILEPATH + branch + ".csv", lstLinksInContent.ToArray(), Encoding.UTF8);
        }
        private static SecureString GetPassword()
        {
            ConsoleKeyInfo info;
            //Get the user's password as a SecureString  
            SecureString securePassword = new SecureString();
            do
            {
                info = Console.ReadKey(true);
                if (info.Key != ConsoleKey.Enter)
                {
                    securePassword.AppendChar(info.KeyChar);
                }
            }
            while (info.Key != ConsoleKey.Enter);
            return securePassword;
        }

        static void Main(string[] args)
        {
            Branches objBranches = new Branches();


            Console.WriteLine("##########   Vælg feature  ##########");
            Console.WriteLine("[1] - Create Modern Pages");
            Console.WriteLine("[2] - Check for obscure content");
            Console.WriteLine("[3] - TODO");
            Console.WriteLine("[4] - Repair Modern Pages");
            string InputFromScreen_FEATURE = Console.ReadLine();
            Console.WriteLine("Skriv hvilken 'Branche' Der skal migreres");
            string InputFromScreen_BRANCHE = Console.ReadLine();
            Console.WriteLine(DateTime.Now.ToShortTimeString());
            string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";
            ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM5555");

            List<List<GenericManualStruct>> L = new List<List<GenericManualStruct>>();
            List<GenericManualStruct> lstAnsvar = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Ansvar + ".csv");
            List<GenericManualStruct> lstBil = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Bil + ".csv");
            List<GenericManualStruct> lstBPG = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.BPG + ".csv");
            List<GenericManualStruct> lstBygning = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Bygning + ".csv");
            List<GenericManualStruct> lstGerningsmand = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Gerningsmand + ".csv");
            List<GenericManualStruct> lstHund = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Hund + ".csv");
            List<GenericManualStruct> lstIndbo = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Indbo + ".csv");
            List<GenericManualStruct> lstPersonskade = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Personskade + ".csv");
            List<GenericManualStruct> lstRegres = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Regres + ".csv");
            List<GenericManualStruct> lstRejse = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Rejse + ".csv");
            List<GenericManualStruct> lstRetshjælp = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Retshjælp + ".csv");
            List<GenericManualStruct> lstSanering = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Sanering + ".csv");
            List<GenericManualStruct> lstScalePoint = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.ScalePoint + ".csv");
            List<GenericManualStruct> lstSkadeservice = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Skadeservice + ".csv");

            List<GenericManualStruct> lstSkybrudsmanual = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Skybrudsmanual + ".csv");
            List<GenericManualStruct> lstBeredskab = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Beredskab + ".csv");
            List<GenericManualStruct> lstStormmanual = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Stormmanual + ".csv");
            List<GenericManualStruct> lstStorskade = MigrationEngine.GetSourceFilesFromCSV(SHAREPOINT_2_EXCEL_FILEPATH + objBranches.Storskade + ".csv");


            L.Add(lstAnsvar);
            L.Add(lstBil);
            L.Add(lstBPG);
            L.Add(lstBygning);
            L.Add(lstGerningsmand);
            L.Add(lstHund);
            L.Add(lstIndbo);
            L.Add(lstPersonskade);
            L.Add(lstRegres);
            L.Add(lstRejse);
            L.Add(lstRetshjælp);
            L.Add(lstSanering);
            L.Add(lstScalePoint);
            L.Add(lstSkadeservice);
            L.Add(lstSkybrudsmanual);
            L.Add(lstBeredskab);
            L.Add(lstStormmanual);
            L.Add(lstStorskade);

            string newFilenamePrefix = string.Empty;
            //lstCreateModernPagesLog.Add("Filnavn;Gruppe;Undergruppe;Branche;Status");


            //MigrationEngine.ChangePageLayoutType(ctx, L);
            switch (InputFromScreen_FEATURE)
            {
                case "1":

                    //CreatemodernPagesFeature(InputFromScreen_BRANCHE, ctx, L, newFilenamePrefix);
                    List<string> lstBranches = new List<string>() { objBranches.Ansvar,
                                                                    objBranches.Beredskab,
                                                                    objBranches.Bil,
                                                                    objBranches.BPG,
                                                                    objBranches.Bygning,
                                                                    objBranches.Gerningsmand,
                                                                    objBranches.Hund,
                                                                    objBranches.Indbo,
                                                                    objBranches.Personskade,
                                                                    objBranches.Regres,
                                                                    objBranches.Rejse,
                                                                    objBranches.Retshjælp,
                                                                    objBranches.Sanering,
                                                                    objBranches.ScalePoint,
                                                                    objBranches.Skadeservice,
                                                                    objBranches.Skybrudsmanual,
                                                                    objBranches.Stormmanual,
                                                                    objBranches.Storskade};
                    foreach (var branch in lstBranches)
                    {
                        lstCreateModernPagesLog = new List<string>();
                        lstCreateModernPagesLog.Add("OrignalFilnavn;NytFilnavn;Gruppe;Undergruppe;Branche;Coincidence;Status");
                        InputFromScreen_BRANCHE = branch;

                        //CreatemodernPagesFeature(InputFromScreen_BRANCHE, ctx, L, newFilenamePrefix);
                        CreatemodernPagesFeature(InputFromScreen_BRANCHE, ctx, L);

                        System.IO.File.WriteAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\importfiles\CreateModernPagesLog\log_" + InputFromScreen_BRANCHE + ".csv", lstCreateModernPagesLog.ToArray(), Encoding.UTF8);
                        lstCreateModernPagesLog = null;
                    }
                    //System.IO.File.WriteAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\importfiles\CreateModernPagesLog\log_" + InputFromScreen_BRANCHE + ".csv", lstCreateModernPagesLog.ToArray(), Encoding.UTF8);
                    break;
                case "2":
                    List<string> branches = new List<string>() { "Ansvar" };
                    string fileName = "";
                    foreach (var branch in branches)
                    {
                        //ValidateContent(ctx, branch);

                        //fileName = VALIDATE_CONTENT_LOG_FILEPATH + branch + ".csv";
                        //System.IO.File.WriteAllLines(fileName, lst.ToArray(), Encoding.UTF8);

                        //fileName = VALIDATE_CONTENT_LOG_FILEPATH + branch + ".csv";
                        //System.IO.File.WriteAllLines(fileName, lstLog.ToArray(), Encoding.UTF8);

                    }

                    ValidateContent(ctx, InputFromScreen_BRANCHE);
                    fileName = VALIDATE_CONTENT_LOG_FILEPATH + InputFromScreen_BRANCHE + ".csv";
                    System.IO.File.WriteAllLines(fileName, lstLog.ToArray(), Encoding.UTF8);




                    break;
                case "4":

                    lstCreateModernPagesLog = new List<string>();
                    lstCreateModernPagesLog.Add("OrignalFilnavn;NytFilnavn;Gruppe;Undergruppe;Branche;Coincidence;Status");

                    CreatemodernPagesFeature(InputFromScreen_BRANCHE, ctx, L);

                    System.IO.File.WriteAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\importfiles\CreateModernPagesLog\log_Repair" + InputFromScreen_BRANCHE + ".csv", lstCreateModernPagesLog.ToArray(), Encoding.UTF8);
                    lstCreateModernPagesLog = null;

                    
                    break;
                default:
                    break;
            }



            Console.WriteLine(DateTime.Now.ToShortTimeString());
            Console.ReadLine();
            return;

            #region Old stuff

            //string logFileName = "";
            //string errorFileName = "";



            //System.Diagnostics.Debugger.Launch();

            //Console.WriteLine("Check for links in WikiFields [W]");
            //Console.WriteLine("Create Modern Pages [M]");
            //Console.WriteLine("Repair Modern Pages [R]");
            //Console.WriteLine("Publish All Pages [P]");
            //var input = Console.ReadLine();

            //if (input.ToLower().Equals("m"))
            //{
            //    try
            //    {
            //        StartCreatingModernPages(false);
            //    }
            //    catch (Exception ex)
            //    {

            //        Console.WriteLine(ex);
            //    }

            //    Console.WriteLine("Done....");
            //    Console.ReadLine();

            //}
            //if (input.ToLower().Equals("r"))
            //{
            //    try
            //    {
            //        StartCreatingModernPages(true);
            //    }
            //    catch (Exception ex)
            //    {

            //        Console.WriteLine(ex);
            //    }

            //    Console.WriteLine("Done....");
            //    Console.ReadLine();

            //}
            //else if (input.ToLower().Equals("w"))
            //{
            //    Console.WriteLine("Båd [1]");
            //    Console.WriteLine("Beredskab [2]");
            //    Console.WriteLine("Byg [3]");
            //    Console.WriteLine("Ansvar [4]");
            //    Console.WriteLine("Hund [5]");
            //    Console.WriteLine("Gerningsmand [6]");
            //    Console.WriteLine("Ejerskifte [7]");
            //    Console.WriteLine("Erhverv [8]");
            //    Console.WriteLine("Lønsikring Individuel [9]");
            //    Console.WriteLine("Retshjælp [10]");
            //    Console.WriteLine("ScalePoint [11]");
            //    Console.WriteLine("Lønsikring Kollektiv [12]");
            //    Console.WriteLine("Personskade [13]");
            //    Console.WriteLine("Regres [14]");
            //    Console.WriteLine("Skybrud [15]");
            //    Console.WriteLine("Storskade [16]");
            //    Console.WriteLine("Rejse [17]");
            //    Console.WriteLine("Indbo [18]");
            //    Console.WriteLine("Bil [19]");
            //    string choice = Console.ReadLine();

            //    Console.WriteLine("Find obscure and empty content  ex. 'false,1,1' and '<p>a</p>' and '<p>v</p>' string [1]");
            //    Console.WriteLine("Output links to screen[2]");
            //    Console.WriteLine("Migrate links [3]");
            //    string featureToRun = Console.ReadLine();
            //    ParsingFeature parsingFeature;


            //    string branchLibraryName = "";
            //    string documentLibrarySearchString = "";
            //    string manualTaxDisplayname = "";

            //    #region REGION Choose branch
            //    if (choice == "1")
            //    {
            //        //ctName = "BaadManual";
            //        branchLibraryName = "baad";
            //        documentLibrarySearchString = "skade/hb/baad/delte";
            //    }
            //    else if (choice == "2")
            //    {
            //        //ctName = "BeredskabManual";
            //        branchLibraryName = "Beredskab";
            //        documentLibrarySearchString = "skade/hb/besk/delte";
            //    }
            //    else if (choice == "3")
            //    {
            //        manualTaxDisplayname = "Bygning";
            //        //ctName = "BygningManual";
            //        branchLibraryName = "Byg";
            //        documentLibrarySearchString = "skade/hb/byg/delte";
            //    }
            //    else if (choice == "4")
            //    {
            //        //ctName = "AnsvarManual";
            //        branchLibraryName = "Ansvar";
            //        documentLibrarySearchString = "skade/hb/ansvarny/delte";
            //    }
            //    else if (choice == "5")
            //    {
            //        //ctName = "HundManual";
            //        branchLibraryName = "Hund";
            //        documentLibrarySearchString = "skade/hb/hund/delte";
            //    }
            //    else if (choice == "6")
            //    {
            //        //ctName = "GerningsmandManual";
            //        branchLibraryName = "Gerningsmand";
            //        documentLibrarySearchString = "skade/hb/gerningsmand/delte";

            //    }
            //    else if (choice == "7")
            //    {
            //        //ctName = "EjerskifteManual";
            //        branchLibraryName = "Ejerskifte";
            //        documentLibrarySearchString = "skade/hb/ejerskifte/delte";

            //    }
            //    else if (choice == "8")
            //    {
            //        //ctName = "ErhvervManual";
            //        branchLibraryName = "Erhverv";
            //        documentLibrarySearchString = "skade/hb/erhv/delte";
            //    }
            //    else if (choice == "9")
            //    {
            //        //ctName = "LønsikringIndividuelManual";
            //        branchLibraryName = "LoensikringIndividuel";
            //        documentLibrarySearchString = "skade/hb/lønsikring/delte";
            //    }
            //    else if (choice == "10")
            //    {
            //        manualTaxDisplayname = "Retshjælp";
            //        //ctName = "RetshjælpManual";
            //        branchLibraryName = "Retshjlp";
            //        documentLibrarySearchString = "skade/hb/retshj/delte";
            //    }
            //    else if (choice == "11")
            //    {
            //        //ctName = "ScalePointManual";
            //        branchLibraryName = "ScalePoint";
            //        documentLibrarySearchString = "skade/hb/sp/delte";
            //    }
            //    else if (choice == "12")
            //    {
            //        //ctName = "LønsikringKollektivManual";
            //        branchLibraryName = "LoensikringKollektiv";
            //        documentLibrarySearchString = "skade/hb/lønsikringkollektiv/delte";
            //    }
            //    else if (choice == "13")
            //    {
            //        //ctName = "PersonskadeManual";
            //        manualTaxDisplayname = "Personskade";
            //        branchLibraryName = "Personskade";
            //        documentLibrarySearchString = "skade/hb/person/delte";
            //    }
            //    else if (choice == "14")
            //    {
            //        //ctName = "RegresManual";
            //        branchLibraryName = "Regres";
            //        documentLibrarySearchString = "skade/hb/reg/delte";
            //    }
            //    else if (choice == "15")
            //    {
            //        //ctName = "SkybrudsManual";
            //        branchLibraryName = "Skybrudsmanual";
            //        documentLibrarySearchString = "skade/hb/SkybrudsManual/delte";
            //    }
            //    else if (choice == "16")
            //    {
            //        //ctName = "StorskadeManual";
            //        branchLibraryName = "Storskade";
            //        documentLibrarySearchString = "skade/hb/storskade/delte";
            //    }
            //    else if (choice == "17")
            //    {
            //        manualTaxDisplayname = "Rejse";
            //        //ctName = "StorskadeManual";
            //        branchLibraryName = "Rejse";
            //        documentLibrarySearchString = "skade/hb/rejse/delte";
            //    }
            //    else if (choice == "18")
            //    {
            //        manualTaxDisplayname = "Indbo";
            //        //ctName = "StorskadeManual";
            //        branchLibraryName = "Indbo";
            //        documentLibrarySearchString = "skade/hb/indbo/delte";
            //    }
            //    else if (choice == "19")
            //    {
            //        manualTaxDisplayname = "Bil";
            //        //ctName = "StorskadeManual";
            //        branchLibraryName = "Bil";
            //        documentLibrarySearchString = "skade/hb/bil/delte";
            //    }
            //    #endregion


            //    //string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";
            //    //ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM5555");

            //    if (featureToRun == "1")
            //    {
            //        logFileName = branchLibraryName + "_CheckForObscurity.txt";
            //        errorFileName = branchLibraryName + "_CheckForObscurityERROR.txt";
            //        parsingFeature = ParsingFeature.CheckForObscurity;
            //    }
            //    else if (featureToRun == "2")
            //    {
            //        errorFileName = branchLibraryName + "_OutputLinksToScreenERROR.txt";
            //        logFileName = branchLibraryName + "_OutputLinksToScreen.txt";
            //        parsingFeature = ParsingFeature.OutputLinksToScreen;
            //    }
            //    else if (featureToRun == "3")
            //    {
            //        errorFileName = branchLibraryName + "_MigrateLinksERROR.txt";
            //        logFileName = branchLibraryName + "_MigrateLinksLOG.txt";
            //        parsingFeature = ParsingFeature.MigrateLinks;
            //    }
            //    else
            //    {
            //        parsingFeature = ParsingFeature.UnknownFeature;
            //    }

            //    string sitePagesLibrary = "Webstedssider";
            //    var fileName = "";
            //    ListItemCollection collListItem = LinksUtility.GetManualsFromSitePages(ctx, sitePagesLibrary, manualTaxDisplayname);

            //    if (parsingFeature == ParsingFeature.MigrateLinks)
            //    {
            //        List<FileWithLinks> files = GetFilesWithLinks();

            //        List<FileWithLinks> orderedFiles = files.OrderBy(o => o.FileName).ToList();
            //        int i = 0;
            //        foreach (var file in orderedFiles)
            //        {
            //            i++;
            //            Console.WriteLine("Processing " + i + " of " + orderedFiles.Count);
            //            // Handle only the files with these 'CoincidenceFilePrefix' in order to keep track of the migration stages.
            //            if (!string.IsNullOrEmpty(file.FileName)
            //                && (file.CoincidenceFilePrefix.Equals("Indbo") ||
            //                    file.CoincidenceFilePrefix.Equals("Bygning") ||
            //                    file.CoincidenceFilePrefix.Equals("Bil") ||
            //                    file.CoincidenceFilePrefix.Equals("Rejse")
            //                    )
            //            )
            //            {
            //                try
            //                {
            //                    string tmpFileNameFromLink = Uri.UnescapeDataString(file.OriginalLink);
            //                    bool coincidenceInLink;
            //                    // Coincidence in filenames
            //                    if (IsPageCoincidence(tmpFileNameFromLink.Substring(tmpFileNameFromLink.LastIndexOf('/') + 1)) != null)
            //                    {
            //                        coincidenceInLink = true;
            //                    }
            //                    else
            //                    {
            //                        coincidenceInLink = false;
            //                    }
            //                    EditCurrentLink(ctx, file, coincidenceInLink);
            //                }
            //                catch (Exception ex)
            //                {
            //                    Console.ForegroundColor = ConsoleColor.Red;
            //                    Console.WriteLine("----------------------------------------------");
            //                    Console.WriteLine(file.FileName);
            //                    Console.WriteLine("----------------------------------------------");
            //                    Console.ForegroundColor = ConsoleColor.Yellow;
            //                    Console.WriteLine("----------------------------------------------");
            //                    Console.WriteLine(ex.Message);
            //                    Console.WriteLine("----------------------------------------------");
            //                    Console.ForegroundColor = ConsoleColor.White;
            //                }

            //            }

            //        }
            //    }
            //    else
            //    {
            //        lstOutputLinksInPages.Add("FileName;OriginalHyperLink;NewHyperLink;CoincidencePrefix");
            //        foreach (ListItem item in collListItem)
            //        {
            //            fileName = item["FileRef"].ToString();
            //            fileName = fileName.Substring(fileName.LastIndexOf('/') + 1);
            //            try
            //            {
            //                ClientSidePage P = ClientSidePage.Load(ctx, fileName);

            //                foreach (CanvasSection section in P.Sections)
            //                {
            //                    foreach (CanvasControl control in section.Controls)
            //                    {
            //                        if (control.Type.Name == "ClientSideText")
            //                        {
            //                            ClientSideText t = (ClientSideText)control;
            //                            if (parsingFeature == ParsingFeature.CheckForObscurity)
            //                            {
            //                                FindObscureText(t.Text, fileName);

            //                            }
            //                            else if (parsingFeature == ParsingFeature.OutputLinksToScreen)
            //                            {
            //                                try
            //                                {
            //                                    OutputLinksToScreen(fileName, t.Text, branchLibraryName, documentLibrarySearchString);
            //                                }
            //                                catch (Exception ex)
            //                                {

            //                                    lstError.Add(fileName + ";" + ex.Message + ";OutputLinksToScreen");
            //                                }

            //                            }
            //                            else if (parsingFeature == ParsingFeature.MigrateLinks)
            //                            {

            //                                //var res = LinksUtility.TraverseHyperLinks(fileName, t.Text, branchLibraryName, documentLibrarySearchString);
            //                                //t.Text = res;
            //                                //P.Save();
            //                                //P.Publish();
            //                            }
            //                        }
            //                    }
            //                }
            //            }
            //            catch (Exception ex)
            //            {
            //                Console.ForegroundColor = ConsoleColor.Red;
            //                Console.WriteLine(ex.Message);
            //                Console.ForegroundColor = ConsoleColor.White;
            //                lstError.Add(fileName + ";" + ex.Message + ";OutputLinksToScreen");
            //            }

            //        }
            //    }
            //}
            //else if (input.ToLower().Equals("p"))
            //{

            //    SPOUtility.CheckInAllDocuments(ctx, "Webstedssider");
            //}

            ////System.IO.File.WriteAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\" + logFileName, lstLog.ToArray());

            //System.IO.File.WriteAllLines(OUTPUT_LINKS_IN_PAGES_FILEPATH + logFileName, lstOutputLinksInPages.ToArray());
            //System.IO.File.WriteAllLines(OBSCURITIES_IN_FILES_FILEPATH + logFileName, lstLog.ToArray());

            ////System.IO.File.WriteAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\" + errorFileName, lstError.ToArray());
            ////ORG LinksUtility.CheckForLinks(ctx, sitePagesLibrary, ctName, featureToRun);


            ////LinksUtility.CheckForLinks(ctx, sitePagesLibrary, parsingFeature ,documentLibrarySearchString,branchLibraryName,manualTaxDisplayname);

            //Console.WriteLine("Done searching for links");
            //Console.ReadLine(); 
            #endregion
        }

        private static void CreatemodernPagesFeature(string InputFromScreen_BRANCHE, ClientContext ctx, List<List<GenericManualStruct>> L)
        {
            int counter = 0;
            string modernPageFilename = "";
            foreach (List<GenericManualStruct> lstManual in L)
            {

                foreach (GenericManualStruct manual in lstManual)
                {
                    
                    
                    //InputFromScreen_BRANCHE
                    //if (manual.Branche.Equals("Personskade") ||
                    //    manual.Branche.Equals("Regres") ||
                    //    manual.Branche.Equals("Retshjælp") ||
                    //    manual.Branche.Equals("Gerningsmand") ||
                    //    manual.Branche.Equals("Hund") ||
                    //    manual.Branche.Equals("Sanering") ||
                    //    manual.Branche.Equals("BPG") ||
                    //    manual.Branche.Equals("Skadeservice") ||
                    //    manual.Branche.Equals("ScalePoint"))
                    if (manual.Branche.Equals(InputFromScreen_BRANCHE))
                    {
                        Console.WriteLine("Creating " + counter + " of " + lstManual.Count + " Modern Pages");
                        counter++;
                        bool isCoincidenceInFilename = MigrationEngine.IsPageCoincidence(manual, L);
                        //if (MigrationEngine.IsPageCoincidence(manual, L))
                        //{
                        //    newFilenamePrefix = manual.Branche;
                        //}

                        try
                        {
                            modernPageFilename = isCoincidenceInFilename ? manual.Branche + manual.FileName : manual.FileName;

                            MigrationEngine.CreateNewModernPage(ctx, manual, modernPageFilename);

                            lstCreateModernPagesLog.Add(string.Format("{0};{1};{2};{3};{4};{5};{6}",
                                                        manual.FileName,
                                                        modernPageFilename,
                                                        manual.Gruppe,
                                                        manual.UnderGruppe,
                                                        manual.Branche,
                                                        isCoincidenceInFilename.ToString(),
                                                        "Success"));
                        }
                        catch (Exception ex)
                        {

                            lstCreateModernPagesLog.Add(string.Format("{0};{1};{2};{3};{4};{5};{6}",
                                                        manual.FileName,
                                                        modernPageFilename,
                                                        manual.Gruppe,
                                                        manual.UnderGruppe,
                                                        manual.Branche,
                                                        isCoincidenceInFilename.ToString(),
                                                        "Error"));
                        }
                    }
                }

            }

        }


        private static void EditCurrentLink(ClientContext ctx, FileWithLinks file, bool linkToCoincidenceFile)
        {
            string filePrefix = "";
            string tmpFileNameFromLink = "";
            ClientSidePage P = ClientSidePage.Load(ctx, file.FileName);
            foreach (CanvasSection section in P.Sections)
            {
                foreach (CanvasControl control in section.Controls)
                {
                    if (control.Type.Name == "ClientSideText")
                    {
                        ClientSideText t = (ClientSideText)control;
                        string s = t.Text;

                        //Replace link
                        string newPageText = Uri.UnescapeDataString(t.Text).Replace(Uri.UnescapeDataString(file.OriginalLink), Uri.UnescapeDataString("https://lbforsikring.sharepoint.com/sites/Skade" + file.NewLink));

                        //Replace filename
                        if (linkToCoincidenceFile)
                        {
                            tmpFileNameFromLink = Uri.UnescapeDataString(file.OriginalLink);
                            filePrefix = IsPageCoincidence(tmpFileNameFromLink.Substring(tmpFileNameFromLink.LastIndexOf('/') + 1));
                            newPageText.Replace(tmpFileNameFromLink, filePrefix + tmpFileNameFromLink);
                        }

                        t.Text = newPageText;
                        P.Save();
                        P.Publish();
                        filePrefix = "";
                        tmpFileNameFromLink = "";
                    }
                }
            }
        }



        public static void OutputLinksToScreen(string fileName, string input, string branchLibraryName, string documentLibrarySearchString)
        {

            Regex regex = new Regex("href\\s*=\\s*(?:\"(?<1>[^\"]*)\"|(?<1>\\S+))", RegexOptions.IgnoreCase);
            Match match;

            for (match = regex.Match(input); match.Success; match = match.NextMatch())
            {

                foreach (System.Text.RegularExpressions.Capture capture in match.Captures)
                {
                    lstLinksInContent.Add(fileName + ";N/A;" + capture + ";N/A");
                }
            }



        }

        private void ChangePageLayoutType(ClientContext ctx)
        { }



        #region More old stuff

        private static void StartCreatingModernPages(bool? repair)
        {
            string branchImageUrl = "";
            string manualTaxFieldValue = "";
            string targetLibraryName = "SitePages";
            targetLibraryName = "Webstedssider";


            string targetSiteUrl = "https://lbforsikring.sharepoint.com/sites/skade";

            ClientContext ctx = SPOUtility.Authenticate(targetSiteUrl, "admnicd@lb.dk", "MandM5555");


            GenericConfiguration g;
            g.ContentTypeName = "";
            g.SourceLibrary = "";

            Console.WriteLine("Vælg branch:");
            Console.WriteLine("Bygning [1]");
            Console.WriteLine("Ansvar [2]");
            Console.WriteLine("Hund [3]");
            Console.WriteLine("Ejerskifte [4]");
            Console.WriteLine("Gerningsmand[5]");
            Console.WriteLine("Erhverv[6]");
            Console.WriteLine("Lønsikring Individuel[7]");
            Console.WriteLine("Lønsikring Kollektiv[8]");
            Console.WriteLine("Indbo[9]");
            Console.WriteLine("Personskade[10]");
            Console.WriteLine("Regres[11]");
            Console.WriteLine("Retshjælp[12]");
            Console.WriteLine("ScalePoint[13]");
            Console.WriteLine("Generel Skadepolitik[14]");
            Console.WriteLine("Skybrud[15]");
            Console.WriteLine("Storskade[16]");
            Console.WriteLine("Rejse[17]");
            Console.WriteLine("Beredskab[18]");
            Console.WriteLine("Båd[19]");
            Console.WriteLine("Bil[20]");


            string branch = Console.ReadLine();
            string importFile = @"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\importfiles\SharePointToExcel_{0}.csv";
            #region Menu choices
            if (branch == "1")
            {
                branchImageUrl = @"https://lbforsikring.sharepoint.com/sites/skade/SiteAssets/ikoner/hus.png";
                manualTaxFieldValue = "Bygning";
                g.ContentTypeName = "BygningManual";
                g.SourceLibrary = "Bygwebsider";
            }
            else if (branch == "2")
            {
                manualTaxFieldValue = "Ansvar";
                branchImageUrl = @"https://lbforsikring.sharepoint.com/sites/skade/SiteAssets/ikoner/ansvar.png";
                g.ContentTypeName = "AnsvarManual";
                g.SourceLibrary = "Ansvarwebsider";
            }
            else if (branch == "3")
            {
                manualTaxFieldValue = "Hund";
                g.ContentTypeName = "HundManual";
                g.SourceLibrary = "Hundwebsider";
            }
            else if (branch == "4")
            {
                g.ContentTypeName = "EjerskifteManual";
                g.SourceLibrary = "Ejerskiftewebsider";
            }
            else if (branch == "5")
            {
                manualTaxFieldValue = "Gerningsmand";
                g.ContentTypeName = "GerningsmandManual";
                g.SourceLibrary = "Gerningsmandwebsider";
            }
            else if (branch == "6")
            {
                g.ContentTypeName = "ErhvervManual";
                g.SourceLibrary = "Erhvervwebsider";
            }
            else if (branch == "7")
            {
                g.ContentTypeName = "LønsikringIndividuelManual";
                g.SourceLibrary = "LoensikringIndividuelWebsider";
            }
            else if (branch == "8")
            {
                g.ContentTypeName = "LønsikringKollektivManual";
                g.SourceLibrary = "loensikringKollektivWebsider";
            }
            else if (branch == "9")
            {
                branchImageUrl = @"https://lbforsikring.sharepoint.com/sites/skade/SiteAssets/ikoner/indbo.png";
                manualTaxFieldValue = "Indbo";
                g.ContentTypeName = "IndboManual";
                g.SourceLibrary = "indboWebsider";
            }
            else if (branch == "10")
            {
                branchImageUrl = @"https://lbforsikring.sharepoint.com/sites/skade/SiteAssets/ikoner/personskade.png";

                manualTaxFieldValue = "Personskade";
                g.ContentTypeName = "PersonskadeManual";
                g.SourceLibrary = "PersonskadeWebsider";
            }
            else if (branch == "11")
            {
                branchImageUrl = @"https://lbforsikring.sharepoint.com/sites/skade/SiteAssets/ikoner/regres.png";

                manualTaxFieldValue = "Regres";
                g.ContentTypeName = "RegresManual";
                g.SourceLibrary = "RegresWebsider";
            }
            else if (branch == "12")
            {
                branchImageUrl = @"https://lbforsikring.sharepoint.com/sites/skade/SiteAssets/ikoner/retshjælp.png";
                manualTaxFieldValue = "Retshjælp";
                g.ContentTypeName = "RetshjælpManual";
                g.SourceLibrary = "RetshjaelpWebsider";
            }
            else if (branch == "13")
            {
                g.ContentTypeName = "ScalePointManual";
                g.SourceLibrary = "ScalePointWebsider";
            }
            else if (branch == "14")
            {
                g.ContentTypeName = "GenerelSkadepolitikManual";
                g.SourceLibrary = "GenerelSkadepolitikWebsider";
            }
            else if (branch == "15")
            {
                g.ContentTypeName = "SkybrudsManual";
                g.SourceLibrary = "SkybrudsManualWebsider";
            }
            else if (branch == "16")
            {
                g.ContentTypeName = "StorskadeManual";
                g.SourceLibrary = "StorskadeWebsider";
            }
            else if (branch == "17")
            {
                branchImageUrl = @"https://lbforsikring.sharepoint.com/sites/skade/SiteAssets/ikoner/rejse.png";
                manualTaxFieldValue = "Rejse";
                g.ContentTypeName = "RejseManual";
                g.SourceLibrary = "RejseWebsider";
            }
            else if (branch == "18")
            {
                manualTaxFieldValue = "Beredskab";
                g.ContentTypeName = "BeredskabManual";
                g.SourceLibrary = "BeredskabWebsider";
            }
            else if (branch == "19")
            {
                manualTaxFieldValue = "Båd";
                g.ContentTypeName = "BaadManual";
                g.SourceLibrary = "BaadWebsider";
            }
            else if (branch == "20")
            {
                branchImageUrl = @"https://lbforsikring.sharepoint.com/sites/skade/SiteAssets/ikoner/bil.png";
                manualTaxFieldValue = "Bil";
                g.ContentTypeName = "BilManual";
                g.SourceLibrary = "BilWebsider";
            }
            #endregion



            List<GenericManualProperies> manuals;
            manuals = GenericManual.GetSourceFilesFromCSV(string.Format(importFile, manualTaxFieldValue));


            int counter = 1;
            foreach (var p in manuals)
            {

                string fileName = p.FileName;
                Console.WriteLine("Creating " + counter + " of " + manuals.Count);
                Console.WriteLine("Start creating " + p.FileName);

                try
                {
                    if (!string.IsNullOrEmpty(Program.IsPageCoincidence(p.FileName)))
                    {
                        fileName = manualTaxFieldValue + p.FileName;
                    }

                    ClientSidePage page = ctx.Web.AddClientSidePage(fileName, true);
                    //ClientSidePage page = new ClientSidePage(ctx);

                    Microsoft.SharePoint.Client.ContentType newContentType = ctx.Web.GetContentTypeByName("Skadehåndbog");
                    ctx.Load(newContentType);
                    ctx.ExecuteQuery();

                    ListItem item = page.PageListItem;
                    ctx.Load(item);
                    ctx.ExecuteQuery();
                    item.Properties["ContentTypeId"] = newContentType.Id.StringValue;
                    item["ContentTypeId"] = newContentType.Id;
                    item["PageLayoutType"] = "Home";
                    item["BannerImageUrl"] = "https://lbforsikring.sharepoint.com" + branchImageUrl;
                    item.Update();

                    if (!string.IsNullOrEmpty(p.Gruppe))
                    {
                        //SPOUtility.SetMetadataField(ctx, item, p.Gruppe, "Gruppe");
                        SPOUtility.SetMetadataField(ctx, item, p.Gruppe, "Gruppe", manualTaxFieldValue);
                        item.Update();
                    }
                    if (!string.IsNullOrEmpty(p.UnderGruppe))
                    {
                        SPOUtility.SetMetadataField(ctx, item, p.UnderGruppe, "Undergruppe", manualTaxFieldValue);
                        item.Update();
                    }

                    SPOUtility.SetMetadataField(ctx, item, manualTaxFieldValue, "H_x00e5_ndbog");
                    item.Update();

                    ctx.Load(item);
                    ctx.ExecuteQuery();


                    page.PageTitle = p.FileName.Substring(0, p.FileName.Length - 5);
                    //page.Save();

                    page.AddSection(CanvasSectionTemplate.TwoColumnLeft, 1);
                    //page.Save();
                    CanvasSection section = page.Sections[0];


                    ClientSideText t = new ClientSideText() { Text = "[TODO]" };
                    page.AddControl(t, section.Columns[0], 0);


                    ClientSideWebPart imageWebPart = page.InstantiateDefaultWebPart(DefaultClientSideWebParts.Image);
                    //imageWebPart.Properties["siteId"] = "843f7b1b-ffcf-4881-bcf7-2ada5969a5fe";
                    //imageWebPart.Properties["webId"] = "18196690-7d06-4ad4-ae87-af7cd393a25";
                    //imageWebPart.Properties["listId"] = "8e992018-f0cc-48fa-a4e3-74cb8af6eb63";
                    ////rejse.png
                    //imageWebPart.Properties["uniqueId"] = "d2bd511c-5fb8-475e-9e23-dcd2d72c621b";
                    //imageWebPart.Properties["imgWidth"] = 1002;
                    //imageWebPart.Properties["imgHeight"] = 469;
                    imageWebPart.Properties["imageSourceType"] = 2;
                    imageWebPart.Properties["imageSource"] = branchImageUrl;
                    //page.Save();

                    page.AddControl(imageWebPart, section.Columns[1], 0);
                    page.Save();
                    page.Publish();

                    //ctx.ExecuteQuery();

                    counter++;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(p.FileName);
                    Console.WriteLine(ex);

                }



            }



        }


        #endregion

    }
}

