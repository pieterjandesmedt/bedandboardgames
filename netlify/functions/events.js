import Airtable from 'airtable';

const API_ENDPOINT = 'https://api.airtable.com';
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE = process.env.AIRTABLE_BASE;

Airtable.configure({
	endpointUrl: API_ENDPOINT,
	apiKey: AIRTABLE_API_KEY
});

const base = Airtable.base(AIRTABLE_BASE);
const eventsTable = base('Weekends');

const fields = ['startDate', 'endDate', 'isReserved'];
const sort = [{ field: 'startDate', direction: "asc" }];

exports.handler = async (event, context) => {
	console.log('event:', event);

	try {
		const results = await eventsTable.select({
			// Selecting the first 12 records in Grid view:
			maxRecords: 12,
			view: "Grid view",
			fields,
			sort,
			filterByFormula: 'AND({isOnline}, IS_AFTER({startDate}, TODAY()))'
		}).firstPage();

		console.log('results:', results);

		if (typeof results === 'undefined') throw new Error('eventsTable select resultsonse was undefined');

		const body = results.map(r => r.fields);

		return {
			statusCode: 200,
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		};
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Failed fetching data' }),
		};
	}
};
