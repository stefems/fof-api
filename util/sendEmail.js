// const mailchimpTx = require("mailchimp_transactional")(process.env.MAILCHIMP_TOKEN);

const sendEmail = async (person, code, payment) => {
	const msg = {
		to: 'kowalmax.s@gmail.com',
		from: 'contact@milkweedprovisions.com', // Change to your verified sender
		subject: 'Sending with SendGrid is Fun',
		text: 'and easy to do anywhere, even with Node.js',
		html: '<strong>and easy to do anywhere, even with Node.js</strong>',
	}
	// todo only send email if env var is set for past the date
	// try {
	// 	const emailResponse = await sgMail.send(msg)
	// 	return emailResponse
	// } catch (e) {
	// 	console.log(e)
	// 	throw new Error('sendgrid failed to send the email')
	// }
}

exports.sendEmail = sendEmail