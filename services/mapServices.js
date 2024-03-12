const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const {
getData
}=require("../getdata");


exports.moveandgetlocation = asyncHandler(async (req, res, next) => {
 const {lat,long}=req.query;   
// eslint-disable-next-line no-template-curly-in-string
const map=await getData(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=token`);
res.send(map);
});


exports.getlocationplaceId = asyncHandler(async (req, res, next) => {
    const {placeId}=req.query;  
    // eslint-disable-next-line no-template-curly-in-string
    const map=await getData(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=token`);
    res.send(map);
});

exports.getlocationplaceName = asyncHandler(async (req, res, next) => {
    const {nameplace}=req.query;  
    // eslint-disable-next-line no-template-curly-in-string
    const map=await getData(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${nameplace}&key=token`);
    res.send(map);
});

exports.getDirectionFromTo = asyncHandler(async (req, res, next) => {
    const {lati,longi,latf,longf}=req.query;  
    // eslint-disable-next-line no-template-curly-in-string
    const map=await getData(`https://maps.googleapis.com/maps/api/directions/json?origin=${lati},${longi}&destination=${latf},${longf}&key=token`);
   console.log(map);
    res.send(map);
});

