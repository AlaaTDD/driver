const axios = require("axios");


exports.getData=async (URL)=> {
const result = await axios.post(URL);
console.log(result.data);  
return result.data; // order id
}


