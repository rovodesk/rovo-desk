import {
	registerDecorator,
	type ValidationOptions,
	ValidatorConstraint,
	type ValidatorConstraintInterface,
} from "class-validator";
import { version as uuidVersion, validate as validateUuid } from "uuid";

function stripPrefix(value: string) {
	const index = value.indexOf("_");
	return index === -1 ? value : value.slice(index + 1);
}

function isUuidV4(value: string) {
	return validateUuid(value) && uuidVersion(value) === 4;
}

@ValidatorConstraint({ name: "isGeneratedUUID", async: false })
export class IsGeneratedUUIDConstraint implements ValidatorConstraintInterface {
	validate(value: unknown) {
		if (typeof value !== "string" || value.length === 0) {
			return false;
		}

		return isUuidV4(stripPrefix(value));
	}

	defaultMessage() {
		return "($value) is not a valid generated UUID v4";
	}
}

export function IsGeneratedUUID(validationOptions?: ValidationOptions) {
	return (object: object, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsGeneratedUUIDConstraint,
		});
	};
}
