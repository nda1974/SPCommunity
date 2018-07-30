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
    public static class GenericManual
    {
        public static List<GenericManualProperies> GetSourceFiles(ClientContext context, GenericConfiguration g)
        {
            
            List sourceSitePagesLibrary = context.Web.Lists.GetByTitle(g.SourceLibrary);

            CamlQuery query = CamlQuery.CreateAllItemsQuery();
            ListItemCollection items = sourceSitePagesLibrary.GetItems(query);
            context.Load(items);
            context.ExecuteQuery();
            List<GenericManualProperies> pages = new List<GenericManualProperies>();
            foreach (ListItem listItem in items)
            {

                if (listItem.FileSystemObjectType == FileSystemObjectType.File)
                {

                    GenericManualProperies spp;
                    spp.WikiContent = (listItem["WikiField"] == null) ? "" : listItem["WikiField"].ToString();

                    
                    if (g.ContentTypeName=="AnsvarManual")
                    {
                        spp.Gruppe = (listItem["kATEGORI"] == null) ? "" : listItem["kATEGORI"].ToString();
                    }
                    else
                    {
                        spp.Gruppe = (listItem["Kategori"] == null) ? "" : listItem["Kategori"].ToString();
                    }
                    
                    spp.UnderGruppe= (listItem["Omr_x00e5_de"] == null) ? "" : listItem["Omr_x00e5_de"].ToString();
                    spp.Title = listItem["FileLeafRef"].ToString().Split('.')[0];
                    spp.FileName = listItem["FileLeafRef"].ToString();

                    pages.Add(spp);
                }
            }
            return pages;
        }

        public static void CreateModernSitePages(ClientContext context, List<GenericManualProperies> pages,GenericConfiguration g)
        {
            int counter = 1;
            foreach (var p in pages)
            {
                Console.WriteLine("Creating " + counter + " of " + pages.Count);
                Console.WriteLine("Start creating " + p.FileName);
                CreatePages(context, p, g.ContentTypeName);
                //if (p.FileName.Equals("1 eller 2 selvrisikobeløb.aspx"))
                //{
                //    Console.WriteLine("Creating " + counter + " of " + pages.Count);
                //    Console.WriteLine("Start creating " + p.FileName);
                //    CreatePages(context, p, g.ContentTypeName);
                //}

            }
        }

        private static void CreatePages(ClientContext context, GenericManualProperies p, string targetContentTypeName)
        {
            var page = context.Web.AddClientSidePage(p.FileName, true);

            ClientSideText txt1 = new ClientSideText() { Text = p.WikiContent };

            page.AddControl(txt1, -1);

            Microsoft.SharePoint.Client.ContentType newContentType = context.Web.GetContentTypeByName(targetContentTypeName);
            context.Load(newContentType);
            context.ExecuteQuery();

            ListItem item = page.PageListItem;

            context.Load(item);
            context.ExecuteQuery();

            item.Properties["ContentTypeId"] = newContentType.Id.StringValue;
            item["ContentTypeId"] = newContentType.Id;

            item.Update();

            if (!string.IsNullOrEmpty(p.Gruppe))
            {
                SPOUtility.SetMetadataField(context, item, p.Gruppe, "Gruppe");
                item.Update();
            }
            if (!string.IsNullOrEmpty(p.UnderGruppe))
            {
                SPOUtility.SetMetadataField(context, item, p.UnderGruppe, "Undergruppe");
                item.Update();
            }
            
            page.Save();
            page.Publish();

            context.ExecuteQuery();

        }


    }
}
