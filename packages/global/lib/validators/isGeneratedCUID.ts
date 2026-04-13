import { isCuid } from "@paralleldrive/cuid2";
import {
	registerDecorator,
	type ValidationOptions,
	ValidatorConstraint,
	type ValidatorConstraintInterface,
} from "class-validator";

function stripPrefix(value: string) {
	const index = value.indexOf("_");
	return index === -1 ? value : value.slice(index + 1);
}

@ValidatorConstraint({ name: "isGeneratedCuid", async: false })
export class IsGeneratedCuidConstraint implements ValidatorConstraintInterface {
	validate(value: unknown) {
		if (typeof value !== "string" || value.length === 0) {
			return false;
		}

		const raw = stripPrefix(value);
		return isCuid(raw);
	}

	defaultMessage() {
		return "($value) is not a valid generated CUID";
	}
}

export function IsGeneratedCUID(validationOptions?: ValidationOptions) {
	return (object: object, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsGeneratedCuidConstraint,
		});
	};
}
