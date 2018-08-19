using HtmlAgilityPack;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using OfficeDevPnP.Core.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace SPOApp
{
    public static class LinksUtility
    {
        private static List<string> strLog = new List<string>();
        //public static void CheckForLinks(ClientContext context, string sitePagesLibraryTitle, string contentType)
        //{

        //    CamlQuery camlQuery = new CamlQuery();
        //    string viewXml = string.Format(@"
        //        <View>
        //            <Query>
        //                <Where>
        //                    <Eq>
        //                        <FieldRef Name='ContentType' />
        //                        <Value Type='Computed'>{0}</Value>
        //                    </Eq>
        //                </Where>
        //            </Query>
        //        </View>", contentType);

        //    camlQuery.ViewXml = viewXml;

        //    //string cq = "<Where><Eq><FieldRef Name='ContentType'/><Value Type='Computed'> BaadManual </ Value></Eq></Where>";

        //    List<string> strLogMessageNoFilesWithLinks = new List<string>();
        //    List<string> strLogMessageNoFilesWithNoCanvas = new List<string>();

        //    var oList = context.Web.Lists.GetByTitle(sitePagesLibraryTitle);

        //    ListItemCollection collListItem = oList.GetItems(camlQuery);
        //    //context.Load(collListItem);
        //    context.Load(collListItem,
        //         items => items.Include(
        //            item => item.Id,
        //            item => item.DisplayName,
        //            item => item.ContentType,
        //            item => item["FileRef"],
        //            item => item["WikiField"]));

        //    context.ExecuteQuery();


        //    int counter = 0;

        //    string documentLibrarySearchString = "";
        //    string branchLibraryName = "";

        //    if (contentType == "BaadManual")
        //    {
        //        branchLibraryName = "baad";
        //        documentLibrarySearchString = "skade/hb/baad/delte";
        //    }
        //    else if (contentType == "BeredskabManual")
        //    {
        //        branchLibraryName = "beredskab";
        //        documentLibrarySearchString = "skade/hb/besk/delte";
        //    }
        //    else if (contentType == "BygningManual")
        //    {
        //        branchLibraryName = "byg";
        //        documentLibrarySearchString = "skade/hb/byg/delte";
        //    }
        //    else if (contentType == "EjerskifteManual")
        //    {
        //        branchLibraryName = "ejerskifte";
        //        documentLibrarySearchString = "skade/hb/ejerskifte/delte";
        //    }

        //    string fileName = "";
        //    foreach (ListItem oListItem in collListItem)
        //    {
        //        counter++;
        //        Console.WriteLine(counter + " of " + collListItem.Count);

        //        fileName = oListItem["FileRef"].ToString();
        //        AnalyzeFile(context, fileName, branchLibraryName, documentLibrarySearchString);

        //    }


        //    System.IO.File.AppendAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\linksInManuals.csv", strLog.ToArray(), Encoding.UTF8);
        //    Console.WriteLine("Links counter: " + counter);

        //}





        //public static void RunFeature(ClientContext context, string sitePagesLibraryTitle, ParsingFeature parsingFeature, string documentLibrarySearchString, string branchLibraryName, string manualDisplayName)
        //{
        //    ListItemCollection collListItem = GetManualsFromSitePages(context, sitePagesLibraryTitle, manualDisplayName);

        //    int counter = 0;
        //    string fileName = "";
        //    foreach (ListItem oListItem in collListItem)
        //    {
        //        counter++;
        //        Console.WriteLine(counter + " of " + collListItem.Count);

        //        fileName = oListItem["FileRef"].ToString();


        //        fileName = fileName.Substring(fileName.LastIndexOf('/') + 1);
        //        //fileName="Forretningsgange og retningslinier - Forlængelser hos Selandia.aspx";
        //        ClientSidePage P = ClientSidePage.Load(context, fileName);
        //        foreach (CanvasSection section in P.Sections)
        //        {
        //            try
        //            {
        //                foreach (CanvasControl control in section.Controls)
        //                {
        //                    if (control.Type.Name == "ClientSideText")
        //                    {
        //                        ClientSideText t = (ClientSideText)control;
        //                        if (parsingFeature == ParsingFeature.CheckForObscurity)
        //                        {
        //                            FindObscureText(t.Text, fileName);

        //                        }
        //                        else if (parsingFeature == ParsingFeature.OutputLinksToScreen)
        //                        {
        //                            OutputLinksToScreen(fileName, t.Text, branchLibraryName, documentLibrarySearchString);

        //                        }
        //                        else if (parsingFeature == ParsingFeature.MigrateLinks)
        //                        {
        //                            var res = TraverseHyperLinks(fileName, t.Text, branchLibraryName, documentLibrarySearchString);
        //                            t.Text = res;
        //                            P.Save();
        //                            P.Publish();
        //                        }
        //                    }
        //                }
        //            }
        //            catch (Exception)
        //            {

        //                Console.ForegroundColor = ConsoleColor.Red;
        //                Console.WriteLine("------------------------------------------");
        //                Console.WriteLine(fileName);
        //                Console.WriteLine("------------------------------------------");

        //                Console.ForegroundColor = ConsoleColor.White;
        //                //throw;
        //            }

        //        }



        //    }


        //    System.IO.File.AppendAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\linksInManuals.csv", strLog.ToArray(), Encoding.UTF8);
        //    Console.WriteLine("Links counter: " + counter);

        //}

        //public static void CheckForLinks(ClientContext context, string sitePagesLibraryTitle, ParsingFeature parsingFeature, string documentLibrarySearchString,string branchLibraryName,string manualDisplayName)
        //{
        //    ListItemCollection collListItem = GetManualsFromSitePages(context, sitePagesLibraryTitle, manualDisplayName);

        //    int counter = 0;
        //    string fileName = "";
        //    foreach (ListItem oListItem in collListItem)
        //    {
        //        counter++;
        //        Console.WriteLine(counter + " of " + collListItem.Count);

        //        fileName = oListItem["FileRef"].ToString();
        //        ParseManualPages(context, fileName, branchLibraryName, documentLibrarySearchString, parsingFeature);
        //    }


        //    System.IO.File.AppendAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\linksInManuals.csv", strLog.ToArray(), Encoding.UTF8);
        //    Console.WriteLine("Links counter: " + counter);

        //}
        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        /// <param name="sitePagesLibraryTitle"></param>
        /// <param name="manualDisplayName">The name of the manual from the termset ex. Rejse</param>
        /// <returns></returns>
        public static ListItemCollection GetManualsFromSitePages(ClientContext context, string sitePagesLibraryTitle, string manualDisplayName)
        {
            CamlQuery camlQuery = new CamlQuery();
            string viewXml = string.Format(@"
                <View>
                    <Query>
                        <Where>
                            <Eq>
                                <FieldRef Name='H_x00e5_ndbog' />
                                <Value Type='TaxonomyFieldType'>{0}</Value>
                            </Eq>
                        </Where>
                    </Query>
                </View>", manualDisplayName);
            camlQuery.ViewXml = viewXml;



            var oList = context.Web.Lists.GetByTitle(sitePagesLibraryTitle);
            ListItemCollection collListItem = oList.GetItems(camlQuery);
            context.Load(collListItem,
                 items => items.Include(
                    item => item.Id,
                    item => item.DisplayName,
                    item => item.ContentType,
                    item => item["FileRef"],
                    item => item["WikiField"]));
            context.ExecuteQuery();
            return collListItem;
        }

        //private static void AnalyzeFile(ClientContext context, string fileName, string branchLibraryName, string documentLibrarySearchString)
        //{
        //    fileName = fileName.Substring(fileName.LastIndexOf('/') + 1);
        //    ClientSidePage P = ClientSidePage.Load(context, fileName);
        //    foreach (CanvasSection section in P.Sections)
        //    {

        //        foreach (CanvasControl control in section.Controls)
        //        {
        //            if (control.Type.Name == "ClientSideText")
        //            {
        //                ClientSideText t = (ClientSideText)control;
        //                //test(t.Text, fileName);
        //                FindObscureText(t.Text, fileName);
        //                //var res = TraverseHyperLinks(fileName, t.Text, branchLibraryName, documentLibrarySearchString);
        //                //t.Text = res;
        //            }
        //        }
        //    }
        //    //P.Save();
        //    //P.Publish();

        //}
        //private static void ParseManualPages(ClientContext context, string fileName, string branchLibraryName, string documentLibrarySearchString, ParsingFeature parsingFeature)
        //{
        //    List<string> errors = new List<string>();
        //    try
        //    {

            
        //    fileName = fileName.Substring(fileName.LastIndexOf('/') + 1);
        //    //fileName="Forretningsgange og retningslinier - Forlængelser hos Selandia.aspx";
        //    ClientSidePage P = ClientSidePage.Load(context, fileName);
        //    foreach (CanvasSection section in P.Sections)
        //    {
        //        try
        //        {
        //            foreach (CanvasControl control in section.Controls)
        //            {
        //                if (control.Type.Name == "ClientSideText")
        //                {
        //                    ClientSideText t = (ClientSideText)control;
        //                    if (parsingFeature == ParsingFeature.CheckForObscurity)
        //                    {
        //                        FindObscureText(t.Text, fileName);

        //                    }
        //                    else if (parsingFeature == ParsingFeature.OutputLinksToScreen)
        //                    {
        //                        OutputLinksToScreen(fileName, t.Text, branchLibraryName, documentLibrarySearchString);

        //                    }
        //                    else if (parsingFeature == ParsingFeature.MigrateLinks)
        //                    {
        //                        var res = TraverseHyperLinks(fileName, t.Text, branchLibraryName, documentLibrarySearchString);
        //                        t.Text = res;
        //                        P.Save();
        //                        P.Publish();
        //                    }
        //                }
        //            }
        //        }
        //        catch (Exception)
        //        {

        //            Console.ForegroundColor = ConsoleColor.Red;
        //            Console.WriteLine("------------------------------------------");
        //            Console.WriteLine(fileName);
        //            Console.WriteLine("------------------------------------------");

        //            Console.ForegroundColor = ConsoleColor.White;
        //            //throw;
        //        }

        //    }
        //    }
        //    catch (Exception ex)
        //    {
        //        errors.Add(fileName + ";" + ex);
        //        System.IO.File.WriteAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\errors.txt", errors.ToArray());

        //    }
        //    System.IO.File.WriteAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\bla.txt", strLog.ToArray());
        //}
        /// <summary>
        /// Feature = 1
        /// </summary>
        /// <param name="content"></param>
        /// <param name="fileName"></param>
        //public static void FindObscureText(string content, string fileName)
        //{
        //    if (content.Contains("false,false,1") ||
        //        content.Contains("<p>a</p>") ||
        //        content.Contains("<p>v</p>") ||
        //        content.Contains("[TODO]") ||
        //        content.Length < 50)
        //    {
        //        Console.ForegroundColor = ConsoleColor.Yellow;
                
        //        strLog.Add(fileName + ";" + string.Empty);
        //        Console.WriteLine(fileName);
        //        Console.ForegroundColor = ConsoleColor.White;
        //    }
        //}
        /// <summary>
        /// Feature = 2
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="input"></param>
        /// <param name="branchLibraryName"></param>
        /// <param name="documentLibrarySearchString"></param>
        public static void OutputLinksToScreen(string fileName, string input, string branchLibraryName, string documentLibrarySearchString)
        {
            Regex regex = new Regex("href\\s*=\\s*(?:\"(?<1>[^\"]*)\"|(?<1>\\S+))", RegexOptions.IgnoreCase);
            Match match;

            for (match = regex.Match(input); match.Success; match = match.NextMatch())
            {
                //IdentifyHyperLinks(fileName, input, branchLibraryName, documentLibrarySearchString, match);
                foreach (System.Text.RegularExpressions.Capture capture in match.Captures)
                {

                    if (capture.Value.ToString().ToLower().Contains("skade/hb"))
                    {
                        if (capture.Value.ToString().ToLower().Contains(documentLibrarySearchString))
                        {
                            Console.ForegroundColor = ConsoleColor.Yellow;
                            Console.WriteLine(fileName + " : " + capture);
                            Console.ForegroundColor = ConsoleColor.White;
                            strLog.Add(fileName + ";" + capture);
                        }
                        else
                        {
                            Console.ForegroundColor = ConsoleColor.Yellow;
                            Console.WriteLine(fileName + " : " + capture);
                            Console.ForegroundColor = ConsoleColor.White;
                            strLog.Add(fileName + ";" + capture);
                        }
                    }
                    else if (capture.Value.ToString().ToLower().Contains("ankeforsikring.dk") ||
                        capture.Value.ToString().ToLower().Contains("retsinformation.dk") ||
                        capture.Value.ToString().ToLower().Contains("www.lb.dk") ||
                        capture.Value.ToString().ToLower().Contains("tinglysning.dk") ||
                        capture.Value.ToString().ToLower().Contains("tinglysning.dk")
                        )
                    {
                    }
                    else
                    {
                        Console.ForegroundColor = ConsoleColor.Green;
                        Console.WriteLine(fileName + " : " + capture);
                        Console.ForegroundColor = ConsoleColor.White;
                        strLog.Add(fileName + ";" + capture);
                    }
                }
            }
            Console.WriteLine("--------------------------------------------");


        }
        public static string TraverseHyperLinks(string fileName, string input, string branchLibraryName, string documentLibrarySearchString)
        {
            Regex regex = new Regex("href\\s*=\\s*(?:\"(?<1>[^\"]*)\"|(?<1>\\S+))", RegexOptions.IgnoreCase);
            Match match;

            for (match = regex.Match(input); match.Success; match = match.NextMatch())
            {
                input = EditHyperLinks(fileName, input, branchLibraryName, documentLibrarySearchString, match);
            }
            Console.WriteLine("--------------------------------------------");
            return input;

        }


        private static string EditHyperLinks(string fileName, string input, string branchLibraryName, string documentLibrarySearchString, Match match)
        {
            foreach (System.Text.RegularExpressions.Capture capture in match.Captures)
            {

                if (capture.Value.ToString().ToLower().Contains("skade/hb"))
                {
                    if (capture.Value.ToString().ToLower().Contains(documentLibrarySearchString))
                    {
                        string postFileString = capture.Value.Substring(capture.Value.LastIndexOf('/') + 1);
                        string newCapture = string.Format("href=\"/sites/Skade/{0}/" + postFileString + "\"", branchLibraryName);
                        input = input.Replace(capture.Value, newCapture);
                    }
                    else
                    {
                        Console.WriteLine("Filename: {1} - Capture.Value: {0}", capture.Value, fileName);
                        string postFileString = capture.Value.Substring(capture.Value.LastIndexOf('/') + 1);
                        string newCapture = "href=\"/sites/Skade/SitePages/" + postFileString + "\"";
                        input = input.Replace(capture.Value, newCapture);
                    }
                }
                else if (capture.Value.ToString().ToLower().Contains("ankeforsikring.dk") ||
                    capture.Value.ToString().ToLower().Contains("retsinformation.dk") ||
                    capture.Value.ToString().ToLower().Contains("www.lb.dk") ||
                    capture.Value.ToString().ToLower().Contains("tinglysning.dk") ||
                    capture.Value.ToString().ToLower().Contains("tinglysning.dk")
                    )
                {
                }
                else if (capture.Value.ToString().ToLower().Contains("/policehaandbog/"))
                {
                    
                    string newCapture = capture.Value.Replace("/policehaandbog/", "http://intranet.lb.dk/policehaandbog/");
                    input = input.Replace(capture.Value, newCapture);
                }
                else
                {
                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.WriteLine(capture);
                    Console.ForegroundColor = ConsoleColor.White;
                    //Console.WriteLine("Capture.Value: {0}", capture.Value);
                    strLog.Add(fileName + ";" + capture.Value);
                }
            }

            return input;
        }

        //private static void IdentifyHyperLinks(string fileName, string input, string branchLibraryName, string documentLibrarySearchString, Match match)
        //{

        //    foreach (System.Text.RegularExpressions.Capture capture in match.Captures)
        //    {

        //        if (capture.Value.ToString().ToLower().Contains("skade/hb"))
        //        {
        //            if (capture.Value.ToString().ToLower().Contains(documentLibrarySearchString))
        //            {
        //                Console.ForegroundColor = ConsoleColor.Yellow;
        //                Console.WriteLine(fileName + " : " + capture);
        //                Console.ForegroundColor = ConsoleColor.White;
        //                strLog.Add(fileName + ";" + capture);
        //            }
        //            else
        //            {
        //                Console.ForegroundColor = ConsoleColor.Yellow;
        //                Console.WriteLine(fileName + " : " + capture);
        //                Console.ForegroundColor = ConsoleColor.White;
        //                strLog.Add(fileName + ";" + capture);
        //            }
        //        }
        //        else if (capture.Value.ToString().ToLower().Contains("ankeforsikring.dk") ||
        //            capture.Value.ToString().ToLower().Contains("retsinformation.dk") ||
        //            capture.Value.ToString().ToLower().Contains("www.lb.dk") ||
        //            capture.Value.ToString().ToLower().Contains("tinglysning.dk") ||
        //            capture.Value.ToString().ToLower().Contains("tinglysning.dk")
        //            )
        //        {
        //        }
        //        else
        //        {
        //            Console.ForegroundColor = ConsoleColor.Green;
        //            Console.WriteLine(fileName + " : " + capture);
        //            Console.ForegroundColor = ConsoleColor.White;
        //            strLog.Add(fileName + ";" + capture);
        //        }
        //    }

        //}

    }
}
