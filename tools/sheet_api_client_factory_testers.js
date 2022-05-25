const SheetApiClientFactory = require('./sheet_api_client_factory');

async function main(){
    try {
        await SheetApiClientFactory.create();
    } catch(e) {
        console.log(e);
    }
}

main();