using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SPOApp
{
    public static class ContentType
    {
        public static void CreateContentType(ClientContext ctx,string contentTypeName, string categoryFieldName) {
            //ctx.Web.ContentTypeExistsByName
            ContentTypeCollection contentTypes = ctx.Web.ContentTypes;
            ctx.Load(contentTypes);
            ctx.ExecuteQuery();
            if (ctx.Web.ContentTypeExistsByName(contentTypeName))
            {
                return;
            }
            

            // Create a Content Type Information object.
            ContentTypeCreationInformation newCt = new ContentTypeCreationInformation();

            // Set the name for the content type.
            newCt.Name = contentTypeName;


            //Site Page - 0x0101009D1CB255DA76424F860D91F20E6C4118
            newCt.ParentContentType = ctx.Web.ContentTypes.GetById("0x0101009D1CB255DA76424F860D91F20E6C4118");

            // Set content type to be available from specific group.
            newCt.Group = "LB Content Types";

            
            // Create the content type.
            Microsoft.SharePoint.Client.ContentType myContentType = contentTypes.Add(newCt);

            FieldLinkCollection fieldsCollection = myContentType.FieldLinks;
            ctx.Load(fieldsCollection);
            ctx.ExecuteQuery();



            FieldCollection fields = ctx.Site.RootWeb.Fields;
            
            ctx.Load(fields);
            ctx.ExecuteQuery();
            
            
            //Field f = ctx.Site.RootWeb.Fields.GetFieldByInternalName(categoryFieldName);
            fieldsCollection.Add(new FieldLinkCreationInformation
            {
                //Field = ctx.Site.RootWeb.Fields.GetFieldByInternalName(categoryFieldName)
                Field = fields.GetFieldByInternalName(categoryFieldName)
            });
            
            myContentType.Update(true);
            ctx.ExecuteQuery();

            

        }
        public static void CreateSiteColumn(ClientContext ctx, string displayName, string internalName,string termSetName)
        {
            Web rootWeb = ctx.Site.RootWeb;

            if (rootWeb.FieldExistsByName(internalName))
            {
                return;
            }
            
            // Create as a regular field setting the desired type in XML
            //https://msdn.microsoft.com/da-dk/library/office/microsoft.sharepoint.client.addfieldoptions.aspx

            Field field = rootWeb.Fields.AddFieldAsXml("<Field DisplayName='"+displayName+"' Name='"+internalName+"' ID='"+Guid.NewGuid()+"' Group='LB Columns' Type='TaxonomyFieldType' />", false, AddFieldOptions.AddFieldInternalNameHint);
            ctx.ExecuteQuery();

            Guid termStoreId = Guid.Empty;
            Guid termSetId = Guid.Empty;
            GetTaxonomyFieldInfo(ctx, out termStoreId, out termSetId,termSetName);

            // Retrieve as Taxonomy Field
            TaxonomyField taxonomyField = ctx.CastTo<TaxonomyField>(field);
            taxonomyField.SspId = termStoreId;
            taxonomyField.TermSetId = termSetId;
            taxonomyField.TargetTemplate = String.Empty;
            taxonomyField.AnchorId = Guid.Empty;
            taxonomyField.Update();

            ctx.ExecuteQuery();
        }

        private static void CreateTaxColumn(ClientContext ctx)
        {
            //Web rootWeb = ctx.Site.RootWeb;

            //// Create as a regular field setting the desired type in XML
            ////https://msdn.microsoft.com/da-dk/library/office/microsoft.sharepoint.client.addfieldoptions.aspx
            //Field field = rootWeb.Fields.AddFieldAsXml("<Field DisplayName='LB håndbog kategori' Name='LBManualCategory' ID='{bed14299-afe0-4c75-9e04-92e3d8b39a18}' Group='LB Columns' Type='TaxonomyFieldType' />", false, AddFieldOptions.AddFieldInternalNameHint);
            //ctx.ExecuteQuery();

            //Guid termStoreId = Guid.Empty;
            //Guid termSetId = Guid.Empty;
            //GetTaxonomyFieldInfo(ctx, out termStoreId, out termSetId);

            //// Retrieve as Taxonomy Field
            //TaxonomyField taxonomyField = ctx.CastTo<TaxonomyField>(field);
            //taxonomyField.SspId = termStoreId;
            //taxonomyField.TermSetId = termSetId;
            //taxonomyField.TargetTemplate = String.Empty;
            //taxonomyField.AnchorId = Guid.Empty;
            //taxonomyField.Update();

            //ctx.ExecuteQuery();
        }

        private static void GetTaxonomyFieldInfo(ClientContext clientContext, out Guid termStoreId, out Guid termSetId, string termSetName)
        {
            termStoreId = Guid.Empty;
            termSetId = Guid.Empty;

            TaxonomySession session = TaxonomySession.GetTaxonomySession(clientContext);
            TermStore termStore = session.GetDefaultSiteCollectionTermStore();
            TermSetCollection termSets = termStore.GetTermSetsByName(termSetName, 1033);

            clientContext.Load(termSets, tsc => tsc.Include(ts => ts.Id));
            clientContext.Load(termStore, ts => ts.Id);
            clientContext.ExecuteQuery();

            termStoreId = termStore.Id;
            termSetId = termSets.FirstOrDefault().Id;
        }
    }
}
