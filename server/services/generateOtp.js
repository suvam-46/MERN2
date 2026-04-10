/**
 * Generates a random 4-digit OTP.
 * You can change 9000 to 900000 and 1000 to 100000 
 * if you ever want a 6-digit OTP later.
 */
exports.generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000);
};