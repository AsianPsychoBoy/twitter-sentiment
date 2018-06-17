import { bindCallback, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { writeFile } from 'fs';

import * as language from '@google-cloud/language';

export class NaturalLanguage {
	client;

	constructor(options: GoogleOptions) {
		writeFile('./google-api-config.json', JSON.stringify(options), (err) => {
			console.log(err);
		})
		this.client = new language.LanguageServiceClient({
			keyFilename: './google-api-config.json'
		})
	}
}

export interface GoogleOptions {
	
}
