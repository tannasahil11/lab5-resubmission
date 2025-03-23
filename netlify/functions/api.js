const https = require('https');
require('dotenv').config();

const fetchRecipes = (params = {}) => {
    return new Promise((resolve, reject) => {
        let queryString = `apiKey=${process.env.SPOONTACULAR_API_KEY}`;
        
        for (const key in params) {
            if (params[key]) {
                queryString += `&${key}=${encodeURIComponent(params[key])}`;
            }
        }
        console.log(queryString);
        
        const options = {
            hostname: 'api.spoonacular.com',
            path: `/recipes/findByIngredients?${queryString}&number=10`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('response', response);
                    resolve(response);
                } catch (error) {
                    reject('Error parsing Spoontacular API response');
                }
            });
        });
        
        req.on('error', (error) => {
            reject('Error fetching recipes: ' + error.message);
        });
        
        req.end();
    });
};

exports.handler = async (event, context) => {
    const query = event.queryStringParameters || {};
    console.log("query", query);
    
    try {
        const params = {
            ingredients: query.ingredients || "apple, flour",
        };
        
        const results = await fetchRecipes(params);
        
        if(results.length === 0) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: "No recipes found for the given ingredients"
            };
        } else {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(results)
            };
        }
    } catch (error) {
        console.error('API Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};