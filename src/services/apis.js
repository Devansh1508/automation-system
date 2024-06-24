const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const profile = {
    updateProfilePictureAPI:BASE_URL+'/profile/updateProfilePicture',
    updateProfileAPI:BASE_URL+'/profile/updateProfile',
    getUserDetailsAPI:BASE_URL+'/profile/getUserDetails'
}

export const auth = {
    signUpAPI: BASE_URL + '/auth/signUp',
    loginAPI: BASE_URL + '/auth/login',
    sendOtpAPI: BASE_URL + '/auth/otp',
    resetPasswordAPI: BASE_URL + '/auth/resetPassword',
    resetPasswordTokenAPI: BASE_URL + '/auth/resetPasswordToken'
}