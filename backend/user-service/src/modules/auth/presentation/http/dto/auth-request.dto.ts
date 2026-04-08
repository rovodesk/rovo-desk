import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AuthenticateWithCodeRequestDto {
	@ApiProperty({ example: "google" })
	provider!: string;

	@ApiProperty({ example: "authorization_code_here" })
	code!: string;

	@ApiProperty({ example: "http://localhost:3000/callback" })
	redirectUri!: string;

	@ApiPropertyOptional({ example: "code_verifier_for_pkce" })
	codeVerifier?: string;
}

export class AuthenticateWithPasswordRequestDto {
	@ApiProperty({ example: "user@example.com" })
	email!: string;

	@ApiProperty({ example: "password123" })
	password!: string;
}

export class TokenPairDto {
	@ApiProperty({ example: "eyJhbGc..." })
	accessToken!: string;

	@ApiPropertyOptional({ example: "eyJhbGc..." })
	refreshToken?: string;

	@ApiPropertyOptional({ example: "eyJhbGc..." })
	idToken?: string;

	@ApiProperty({ example: 900 })
	expiresIn!: number;

	@ApiProperty({ example: "Bearer" })
	tokenType!: string;
}

export class AuthenticationResponseDto {
	@ApiProperty({ type: TokenPairDto })
	tokens!: TokenPairDto;

	@ApiProperty({ example: "usr_abc123xyz" })
	userId!: string;

	@ApiProperty({ example: "user@example.com" })
	email!: string;

	@ApiProperty({ example: true })
	isNewUser!: boolean;
}
