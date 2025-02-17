const template = (otp) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&family=Pacifico&display=swap" rel="stylesheet">
</head>
<style>
    body{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        font-family: Oswald, sans-serif;
        flex-direction: column;
    }
    h1{
        margin: 5px;
    }
    .otpDiv{
        background-color:rgb(222, 155, 68);
        padding: 10px;
        border-radius: 5px;
        margin: 5px;
    }
</style>
<body>
    <h1>Welcome!</h1>
    <p>We are excited to get started, first you need to confirm your email account. Your OTP is </p>
    <div class="otpDiv">${otp}</div>
    <p>Enter your otp in email verification page</p>
</body>
</html>`
}

module.exports = template;