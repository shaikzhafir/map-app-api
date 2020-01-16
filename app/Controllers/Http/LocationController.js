'use strict'

const Location = use('App/Models/Location')

class LocationController {
    async index({ response} ){
        
        const location = await Location.all()
        const jsonData = await location.toJSON()
       
       
        //declare an array to put all the diff objects 
        const allLocation = []

       //this function retrieves data from db to format as geojson 
       jsonData.forEach(function(data){
           
           allLocation.push({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [data.lon, data.lat]
            },
            "properties": {
            "name": data.name,
            "description" : data.description

            } 
           })

        })

        response.json({
            message : "list of all locations",
            data : allLocation
        })

        

    }

    

    async show ({ request, response, params : {id}}){

        //selects the location data from database
        const location = await Location.find(id)

        
        if(!location){
            return response.status(404).json({
                message : 'location not found sorry'
            })
        }
        

        const newObject = {
            
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [location.lon, location.lat]
                },
                "properties": {
                "name": location.name,
                "description" : location.description

                }  
        }
        //returns a json object of the location, including the image
        response.status(200).json({
            message : "this is the location",
            data : newObject
        })


    }

    async store ({ request , response }) {
        const { name , description , lat, lon} = request.post()
        
        const location = new Location()
        

        location.name = name
        location.description = description
        location.lat = lat
        location.lon = lon


        await location.save()

        response.json({
            message : 'successfully created a location',
            data : location
        })
    }



}

module.exports = LocationController
