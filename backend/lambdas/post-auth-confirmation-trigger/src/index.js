const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const sns = new SNSClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
	try {
		console.log("Event", event);
		const user = event.request.userAttributes;

		const message = {
			event: "USER_SIGNUP_CONFIRMED",
			userId: user.sub,
			email: user.email,
			timestamp: new Date().toISOString(),
		};

		await sns.send(
			new PublishCommand({
				TopicArn: process.env.SNS_TOPIC_ARN,
				Message: JSON.stringify(message),
				Subject: "User Signup Confirmed",
			})
		);

		console.log("SNS notification sent:", message);
		return event;
	} catch (err) {
		console.error("Error sending SNS:", err);
		throw err;
	}
};
