const User = require("../../../../Model/userModel");

exports.getMyProfile = async (req, res)=> {
    const userId = req.user.id;
    const getMyProfile = await User.findById(userId);
    res.status(200).json({
        data: MyProfile,
        message : "Profile fetched successfully",
    });
};