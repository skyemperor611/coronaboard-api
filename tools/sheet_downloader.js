const fs = require('fs');
const path = require('path');

class SheetDownloader {
    constructor(apiClient){
        this.apiClient = apiClient;
    }

    async downloadToJson(spreadsheetId, sheetName, filePath = null) {
        const res = await this.apiClient.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: sheetName,
        });

        const rows = res.data.values;

        if (rows.length === 0) {
            const message = 'No Data found on the street';
            console.error(message);
            return {};
        }

        const object = this._rowToObject(rows);

        if(filePath) {
            
            const jsonText = JSON.stringify(object, null, 2);

            const directory = path.dirname(filePath);
            if(!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            fs.writeFileSync(filePath, jsonText);
            console.log(`Written to ${filePath}`);
        }

        return object;
    }

    _rowToObject(rows){
        const headerRow = rows.slice(0,1)[0];
        const dataRows = rows.slice(1, rows.length);

        return dataRows.map((row) => {
            const item = {};
            for (let i = 0; i < headerRow.length; i++) {
                const fieldName = headerRow[i];
                const fieldValue = row[i];
                item[fieldName] = fieldValue;
            }
            return item;
        });
    }
}

module.exports = SheetDownloader;