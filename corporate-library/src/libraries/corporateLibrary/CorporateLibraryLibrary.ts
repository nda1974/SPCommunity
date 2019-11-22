export class CorporateLibraryLibrary {
  
public importPNPJS(){
  const pnpjs = require('@pnp/sp')
  return pnpjs;
}

public getCurrentTime(): string {
  return 'The current time as returned from the corporate library is ' + new Date().toTimeString();
}


}
