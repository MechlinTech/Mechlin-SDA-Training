module.exports = (err,req,res,next)=>{
    console.log(err);
    res.status(500).json({
        succcess: false,
        message:err.message || 'Server Error'
    });
};