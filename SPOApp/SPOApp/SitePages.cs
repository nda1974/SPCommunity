using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using OfficeDevPnP.Core.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SPOApp
{
    public struct SitePageProperies
    {
        public string ManualCategory;
        public string WikiContent;
        public string FileName;
        public string Title;
    }

    public static class SitePages
    {

        public static void CreateModernSitePages(ClientContext context, string sourceLibraryName, string targetLibraryName,string targetContentTypeName)
        {

            List<SitePageProperies> sourcePages = GetSourceFiles(context, sourceLibraryName);

            foreach (var p in sourcePages)
            {
                //CreateModernSitePages(context, p);

                if (p.FileName.Equals("Kilometersatser.aspx"))
                {
                    CreateModernSitePages(context, p, targetContentTypeName);
                }

                //if (p.FileName.Equals("Farveloyal - mærkeloyal.aspx"))
                //{
                //    CreateModernSitePages(context,p);
                //}
            }
        }

        private static void CreateModernSitePages(ClientContext context, SitePageProperies p,string targetContentTypeName)
        {
            var page = context.Web.AddClientSidePage(p.FileName, true);

            ClientSideText txt1 = new ClientSideText() { Text = p.WikiContent };

            page.AddControl(txt1, -1);
            //page.Save();


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

            if (!string.IsNullOrEmpty(p.ManualCategory))
            {
                SetMetadataField(context, item, p.ManualCategory);
            }
            //SetMetadataField(context, item, p.ManualCategory);

            item.Update();
            page.Save();


            context.ExecuteQuery();


        }
        private static void SetMetadataField(ClientContext ctx, ListItem item, string term)
        {
            List sitePagesList = ctx.Web.Lists.GetByTitle("Site Pages");
            Field field = sitePagesList.Fields.GetFieldByInternalName("IndboManualCategory");

            ctx.Load(field);
            ctx.ExecuteQuery();

            TaxonomyField txField = ctx.CastTo<TaxonomyField>(field);
            string termId = GetTermIdForTerm(term, txField.TermSetId, ctx);
            if (!string.IsNullOrEmpty(termId))
            {
                TaxonomyFieldValue termValue = new TaxonomyFieldValue();
                termValue.Label = term;
                termValue.TermGuid = termId;
                termValue.WssId = -1;
                txField.SetFieldValueByValue(item, termValue);
            }
        }

        private static string GetTermIdForTerm(string term, Guid termSetId, ClientContext clientContext)
        {
            string termId = string.Empty;

            TaxonomySession tSession = TaxonomySession.GetTaxonomySession(clientContext);
            TermStore ts = tSession.GetDefaultSiteCollectionTermStore();
            TermSet tset = ts.GetTermSet(termSetId);

            LabelMatchInformation lmi = new LabelMatchInformation(clientContext);

            lmi.Lcid = 1033;
            lmi.TrimUnavailable = true;
            lmi.TermLabel = term;

            TermCollection termMatches = tset.GetTerms(lmi);

            
            //tset.CreateTerm()
            clientContext.Load(tSession);
            clientContext.Load(ts);
            clientContext.Load(tset);
            clientContext.Load(termMatches);

            clientContext.ExecuteQuery();

            if (termMatches != null && termMatches.Count() > 0)
            {
                termId = termMatches.First().Id.ToString();
            }
            else
            {
                Term TermAdd = tset.CreateTerm(term, 1033, Guid.NewGuid());
                clientContext.ExecuteQuery();
                clientContext.Load(TermAdd);
                clientContext.ExecuteQuery();
                termId =TermAdd.Id.ToString();
                
            }


            return termId;

        }

        private static List<SitePageProperies> GetSourceFiles(ClientContext context, string sourceLibraryName)
        {

            List sourceSitePagesLibrary = context.Web.Lists.GetByTitle(sourceLibraryName);

            CamlQuery query = CamlQuery.CreateAllItemsQuery();
            ListItemCollection items = sourceSitePagesLibrary.GetItems(query);
            context.Load(items);
            context.ExecuteQuery();
            List<SitePageProperies> pages = new List<SitePageProperies>();
            foreach (ListItem listItem in items)
            {

                if (listItem.FileSystemObjectType == FileSystemObjectType.File)
                {

                    SitePageProperies spp;
                    spp.WikiContent = (listItem["WikiField"] == null) ? "" : listItem["WikiField"].ToString();
                    //spp.WikiContent = listItem["WikiField"].ToString(); 
                    spp.ManualCategory = (listItem["Kategori"] == null) ? "" : listItem["Kategori"].ToString();
                    //spp.ManualCategory = listItem["Kategori"].ToString();
                    spp.Title = listItem["FileLeafRef"].ToString().Split('.')[0];
                    spp.FileName = listItem["FileLeafRef"].ToString();


                    pages.Add(spp);
                }
            }
            return pages;
        }

    }
}
