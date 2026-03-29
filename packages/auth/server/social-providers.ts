import type {
	CognitoProfile,
	GithubProfile,
	GoogleProfile,
	SocialProviders,
} from "better-auth";
import type { AuthEnv } from "./keys";

export function getOauthProviders(env: AuthEnv): SocialProviders {
	return {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			mapProfileToUser(profile: GithubProfile) {
				return {
					name: profile.name,
					image: profile.avatar_url,
				};
			},
		},
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			mapProfileToUser(profile: GoogleProfile) {
				return {
					name: `${profile.given_name} ${profile.family_name}`,
					image: profile.picture,
				};
			},
		},
		cognito: {
			clientId: env.AWS_COGNITO_CLIENT_ID,
			clientSecret: env.AWS_COGNITO_CLIENT_SECRET,
			domain: env.AWS_COGNITO_DOMAIN,
			region: env.AWS_REGION,
			userPoolId: env.AWS_COGNITO_USER_POOL_ID,
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
}
