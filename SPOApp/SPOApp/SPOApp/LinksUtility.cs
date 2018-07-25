using HtmlAgilityPack;
using Microsoft.SharePoint.Client;
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
        public static void CheckForLinks(ClientContext context, string sitePagesLibraryTitle)
        {
            CamlQuery camlQuery = new CamlQuery();

            List<string> strLogMessageNoFilesWithLinks = new List<string>();
            List<string> strLogMessageNoFilesWithNoCanvas = new List<string>();

            var oList = context.Web.Lists.GetByTitle(sitePagesLibraryTitle);

            ListItemCollection collListItem = oList.GetItems(camlQuery);
            //context.Load(collListItem);
            context.Load(collListItem,
                 items => items.Include(
                    item => item.Id,
                    item => item.DisplayName,
                    item => item.ContentType,
                    item => item["FileRef"],
                    item => item["WikiField"]));
            context.ExecuteQuery();


            int counter = 0;

            string documentLibrarySearchString = "";
            string branch = "";

            foreach (ListItem oListItem in collListItem)
            {
                counter++;
                Console.WriteLine(counter + " of " + collListItem.Count);
                if (oListItem.ContentType.Name == "BaadManual")
                {
                    branch = "baad";
                    documentLibrarySearchString = "skade/hb/baad/delte";
                    string tmp = oListItem["FileRef"].ToString();
                    string fileName = tmp;
                    //if (tmp.ToLower().Contains("links.aspx"))
                    //{
                    //    EditFile(context, tmp, fileName,branch, documentLibrarySearchString);
                    //}
                    EditFile(context, tmp, fileName, branch, documentLibrarySearchString);

                }
            }
            System.IO.File.AppendAllLines(@"C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\logfiles\linksInManuals.csv", strLog.ToArray(), Encoding.UTF8);
            Console.WriteLine("Links counter: " + counter);

        }

        private static void EditFile(ClientContext context, string tmp, string fileName, string branch, string documentLibrarySearchString)
        {
            fileName = fileName.Substring(fileName.LastIndexOf('/') + 1);
            string postFileString = tmp.Substring(0, tmp.LastIndexOf('/') + 1);
            ClientSidePage P = ClientSidePage.Load(context, fileName);
            foreach (CanvasSection section in P.Sections)
            {

                foreach (CanvasControl control in section.Controls)
                {
                    if (control.Type.Name == "ClientSideText")
                    {
                        ClientSideText t = (ClientSideText)control;
                        var res = EditHyperLinks(fileName, t.Text, branch, documentLibrarySearchString);
                        t.Text = res;
                    }
                }
            }
            P.Save();
            P.Publish();

        }

        private static string EditHyperLinks(string fileName, string input, string branch, string documentLibrarySearchString)
        {
            Regex regex = new Regex("href\\s*=\\s*(?:\"(?<1>[^\"]*)\"|(?<1>\\S+))", RegexOptions.IgnoreCase);
            Match match;

            for (match = regex.Match(input); match.Success; match = match.NextMatch())
            {

                foreach (System.Text.RegularExpressions.Capture capture in match.Captures)
                {

                    if (capture.Value.ToString().ToLower().Contains("skade/hb"))
                    {
                        if (capture.Value.ToString().ToLower().Contains(documentLibrarySearchString))
                        {
                            string postFileString = capture.Value.Substring(capture.Value.LastIndexOf('/') + 1);
                            string newCapture = string.Format("href=\"/sites/Skade/{0}/" + postFileString + "\"", branch);
                            input = input.Replace(capture.Value, newCapture);
                        }
                        else
                        {
                            Console.WriteLine("Capture.Value: {0}", capture.Value);
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
                    else
                    {
                        Console.ForegroundColor = ConsoleColor.Green;
                        Console.WriteLine(capture);
                        Console.ForegroundColor = ConsoleColor.White;
                        //Console.WriteLine("Capture.Value: {0}", capture.Value);
                        strLog.Add(fileName + ";" + capture.Value);
                    }
                }


            }
            Console.WriteLine("--------------------------------------------");
            return input;

        }
    }
}
