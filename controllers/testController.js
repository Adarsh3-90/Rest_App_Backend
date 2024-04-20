const testUserConroller = (req,res) =>{
    try{
        res.status(200).send({
            success:true,
            message:"test User Data API"
        })

    }catch(error){
        console.log("error in the test API",error)
    }
};

module.exports = {testUserConroller}