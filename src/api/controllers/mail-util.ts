const mailjet = require('node-mailjet')
.connect('9cba2e76140d0468bcb40083e2181373', '44e6bae5e51321eef6eb22b38a3f0b0e');
async function sendVerificationCodeEmail(fullName: String, email: String, verificationCode: String) {
    try {
        const request = mailjet.post("send", {'version': 'v3.1'})
        .request({
        "Messages":[
            {
                "From": {
                    "Email": "abhik.mehta1234@gmail.com",
                    "Name": "e-com.com"
                },
                "To": [
                    {
                    "Email": email,
                    "Name": fullName
                    }
                ],
                "Subject": "Greetings from e-com!",
                "TextPart": "Verification Code",
                "HTMLPart": `<h3>Dear User, This is your verification code ${verificationCode}. This code will expire in 5 minutes.`,
                "CustomID": "AppGettingStartedTest"
            }
        ]
        });
        request.then((result: any) => {
            console.log(result.body);
        })
        .catch((err: any) => {
            console.log(err.statusCode);
        });
    } catch(err) {
        console.log(err);
    }
}

export default sendVerificationCodeEmail;