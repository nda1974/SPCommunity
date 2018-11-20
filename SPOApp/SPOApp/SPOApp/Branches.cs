using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SPOApp
{
    public class Branches
    {
        string ansvar;
        string bil;
        string bPG;
        string bygning;
        string gerningsmand;
        string hund;
        string indbo;
        string personskade;
        string regres;
        string rejse;
        string retshjælp;
        string sanering;
        string scalePoint;
        string skadeservice;
        string skybrudsmanual;
        string beredskab;
        string stormmanual;
        string storskade;
        string båd;
        string individuelLønsikring;
        string kollektivLønsikring;
        string ejerskifte;
        string erhverv;
        string generelSkadePolitik;
        string stormFlod;
        string ulykkeskade;
        public Branches()
        {
            this.ansvar = "Ansvar";
            this.bil = "Bil";
            this.bPG = "BPG";
            this.bygning = "Bygning";
            this.gerningsmand = "Gerningsmand";
            this.hund = "Hund";
            this.indbo = "Indbo";
            this.personskade = "Personskade";
            this.regres = "Regres";
            this.rejse = "Rejse";
            this.retshjælp = "Retshjælp";
            this.sanering = "Sanering";
            this.scalePoint = "ScalePoint";
            this.skadeservice = "Skadeservice";
            this.skybrudsmanual = "Skybrudsmanual";
            this.beredskab = "Beredskab";
            this.stormmanual = "StormManual";
            this.storskade = "Storskade";
            this.båd = "Båd";
            this.IndividuelLønsikring = "Individuel lønsikring";
            this.kollektivLønsikring = "Kollektiv lønsikring";
            this.ejerskifte = "Ejerskifte";
            this.erhverv= "Erhverv";
            this.generelSkadePolitik= "Generel skadepolitik";
            this.stormFlod = "Stormflod";
            this.Ulykkeskade= "Ulykkeskade";

        }

        public string Ansvar { get => ansvar; set => ansvar = value; }
        public string Bil { get => bil; set => bil = value; }
        public string BPG { get => bPG; set => bPG = value; }
        public string Bygning { get => bygning; set => bygning = value; }
        public string Gerningsmand { get => gerningsmand; set => gerningsmand = value; }
        public string Hund { get => hund; set => hund = value; }
        public string Indbo { get => indbo; set => indbo = value; }
        public string Personskade { get => personskade; set => personskade = value; }
        public string Regres { get => regres; set => regres = value; }
        public string Rejse { get => rejse; set => rejse = value; }
        public string Retshjælp { get => retshjælp; set => retshjælp = value; }
        public string Sanering { get => sanering; set => sanering = value; }
        public string ScalePoint { get => scalePoint; set => scalePoint = value; }
        public string Skadeservice { get => skadeservice; set => skadeservice = value; }
        public string Skybrudsmanual { get => skybrudsmanual; set => skybrudsmanual = value; }
        public string Beredskab { get => beredskab; set => beredskab = value; }
        public string Storskade { get => storskade; set => storskade = value; }
        public string Båd { get => båd; set => båd = value; }
        public string IndividuelLønsikring { get => individuelLønsikring; set => individuelLønsikring = value; }
        public string KollektivLønsikring { get => kollektivLønsikring; set => kollektivLønsikring = value; }
        public string Ejerskifte { get => ejerskifte; set => ejerskifte= value; }
        public string Erhverv{ get => erhverv; set => erhverv = value; }
        public string GenerelSkadePolitik { get => generelSkadePolitik; set => generelSkadePolitik= value; }
        public string StormFlod { get => stormFlod; set => stormFlod = value; }
        public string StormManual { get => stormmanual; set => stormmanual = value; }
        public string Ulykkeskade { get => ulykkeskade; set => ulykkeskade = value; }
    }
}
