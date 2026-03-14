import type {
	CognitoProfile,
	GithubProfile,
	GoogleProfile,
	SocialProviders,
} from "better-auth";
import { keys } from "./keys";

export const OauthProviders: SocialProviders = {
	github: {
		clientId: keys.GITHUB_CLIENT_ID,
		clientSecret: keys.GITHUB_CLIENT_SECRET,
		mapProfileToUser(profile: GithubProfile) {
			return {
				name: profile.name,
				image: profile.avatar_url,
			};
		},
	},
	google: {
		clientId: keys.GOOGLE_CLIENT_ID,
		clientSecret: keys.GOOGLE_CLIENT_SECRET,
		mapProfileToUser(profile: GoogleProfile) {
			return {
				name: `${profile.given_name} ${profile.family_name}`,
				image: profile.picture,
			};
		},
	},
	cognito: {
		clientId: keys.AWS_COGNITO_CLIENT_ID,
		clientSecret: keys.AWS_COGNITO_CLIENT_SECRET,
		domain: keys.AWS_COGNITO_DOMAIN,
		region: keys.AWS_REGION,
		userPoolId: keys.AWS_COGNITO_USER_POOL_ID,
		mapProfileToUser(profile: CognitoProfile) {
			return {
				id: profile.sub,
				name: profile.name,
				image: profile.picture,
				role: "admin",
			};
		},
		disableSignUp: true,
		disableImplicitSignUp: true,
	},
};
