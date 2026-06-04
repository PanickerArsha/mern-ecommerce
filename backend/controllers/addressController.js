import Address from '../models/Address.js';

//Save address controller function
export const saveAddress = async (req, res) => {
    try {
        //whatever will comes in post call body will be saved in address collection in database
        const address = await Address.create(req.body); //Address.create is a Mongoose method that creates a new document in the Address collection using the data provided in req.body. It returns the created address document, which is then sent back in the response with a success message. If there's an error during this process, it catches the error and sends an error message in the response.
        res.json({message: 'Address saved successfully', address});
    } catch (error) {
        res.json({message: 'Error saving address', error});
    }
};

//Get address by userId
export const getAddresses = async (req, res) => {
    try {
        //whatever is created with the userId in address collection will be fetched and send to frontend
        const addresses = await Address.find({userId: req.params.userId}); 
        res.json({message: 'Addresses fetched successfully', addresses});
    }
    catch (error) {
        res.json({message: 'Error fetching addresses', error});
    }
}
