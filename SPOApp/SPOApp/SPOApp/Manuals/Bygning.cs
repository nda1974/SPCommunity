using Microsoft.SharePoint.Client;
using OfficeDevPnP.Core.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SPOApp
{
    public static class Bygning
    {
        

        

        public static List<BygningManualProperies> GetSourceFiles(ClientContext context, string sourceLibraryName)
        {

            List sourceSitePagesLibrary = context.Web.Lists.GetByTitle(sourceLibraryName);

            CamlQuery query = CamlQuery.CreateAllItemsQuery();
            ListItemCollection items = sourceSitePagesLibrary.GetItems(query);
            context.Load(items);
            context.ExecuteQuery();
            List<BygningManualProperies> pages = new List<BygningManualProperies>();
            foreach (ListItem listItem in items)
            {

                if (listItem.FileSystemObjectType == FileSystemObjectType.File)
                {

                    BygningManualProperies spp;
                    spp.WikiContent = (listItem["WikiField"] == null) ? "" : listItem["WikiField"].ToString();
                    spp.BygningCategory = (listItem["Kategori"] == null) ? "" : listItem["Kategori"].ToString();
                    spp.BygningArea= (listItem["Omr_x00e5_de"] == null) ? "" : listItem["Omr_x00e5_de"].ToString();
                    spp.Title = listItem["FileLeafRef"].ToString().Split('.')[0];
                    spp.FileName = listItem["FileLeafRef"].ToString();

                    pages.Add(spp);
                }
            }
            return pages;
        }

        public static void CreateModernSitePages(ClientContext context, List<BygningManualProperies> pages)
        {

            //List<AnsvarManualProperies> sourcePages = pages;
            string targetContentTypeName = "BygningManual";
            foreach (var p in pages)
            {
                CreatePages(context, p, targetContentTypeName);
                //if (p.FileName.Equals("Legehuse.aspx"))
                //{
                //    CreatePages(context, p, targetContentTypeName);
                //}

            }
        }

        private static void CreatePages(ClientContext context, BygningManualProperies p, string targetContentTypeName)
        {
            var page = context.Web.AddClientSidePage(p.FileName, true);

            ClientSideText txt1 = new ClientSideText() { Text = p.WikiContent };

            page.AddControl(txt1, -1);

            Microsoft.SharePoint.Client.ContentType newContentType = context.Web.GetContentTypeByName(targetContentTypeName);
            context.Load(newContentType);
            context.ExecuteQuery();

            ListItem item = page.PageListItem;
            //item.Update();

            context.Load(item);
            context.ExecuteQuery();

            //item["ContentType"] = newContentType.Name;
            item.Properties["ContentTypeId"] = newContentType.Id.StringValue;
            item["ContentTypeId"] = newContentType.Id;

            item.Update();
            //page.Save();

            //context.ExecuteQuery();



            //context.ExecuteQuery();

            if (!string.IsNullOrEmpty(p.BygningCategory))
            {
                SPOUtility.SetMetadataField(context, item, p.BygningCategory, "BygningCategory");
                item.Update();
            }
            if (!string.IsNullOrEmpty(p.BygningArea))
            {
                SPOUtility.SetMetadataField(context, item, p.BygningArea, "BygningArea");
                item.Update();
            }


            
            page.Save();


            context.ExecuteQuery();


        }
        public static void CheckForLinks(ClientContext context) {
            CamlQuery camlQuery = new CamlQuery();


            
            var oList = context.Web.Lists.GetByTitle("Webstedssider");
            ListItemCollection collListItem = oList.GetItems(camlQuery);
            context.Load(collListItem);

            context.Load(collListItem,
                 items => items.Include(
                    item => item.Id,
                    item => item.DisplayName,
                    item => item.ContentType,
                    item => item["FileRef"],
                    item => item["CanvasContent1"]));

            context.ExecuteQuery();

            foreach (ListItem oListItem in collListItem)
            {
                if (oListItem.ContentType.Name == "BygningManual")
                {
                    
                    if (oListItem["CanvasContent1"].ToString().Contains("href"))
                    {
                        Console.ForegroundColor = ConsoleColor.Red;
                        Console.WriteLine("ID: " + oListItem.Id);
                        Console.WriteLine("Title: " + oListItem.DisplayName);
                        Console.WriteLine("Url: " + oListItem["FileRef"]);
                        
                        FindHrefs(oListItem["CanvasContent1"].ToString());
                        Console.WriteLine("------------------------------------------------");
                        //Console.WriteLine("ID: {0} \nDisplay name: {1} \n Url {2} ",
                        //oListItem.Id, oListItem.DisplayName, oListItem["FileRef"]);
                        //FindHrefs(oListItem["CanvasContent1"].ToString());
                        Console.ForegroundColor = ConsoleColor.White;
                    }
                }
                
            }

        }

        private static void FindHrefs(string input)
        {
            Regex regex = new Regex("href\\s*=\\s*(?:\"(?<1>[^\"]*)\"|(?<1>\\S+))", RegexOptions.IgnoreCase);
            Match match;
            for (match = regex.Match(input); match.Success; match = match.NextMatch())
            {
                Console.WriteLine("Found a href. ");
                foreach (System.Text.RegularExpressions.Group group in match.Groups)
                {
                    Console.WriteLine("Href value: {0}", group);
                }
            }

        }

    }
}
