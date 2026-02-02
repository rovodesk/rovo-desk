type Product = {
	productId: string;
	slug: string;
};

const sandboxProducts: Product[] = [
	{
<<<<<<< HEAD
		productId: "ae409149-37cc-4328-99c2-6023bef27e14",
=======
		productId: "087c1d12-550e-4a6e-82ed-8b45dffa40c6",
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
		slug: "Basic",
	},
	{
		productId: "e64ff26b-d15e-4e86-8e09-b634a641fd3e",
		slug: "Pro",
	},
	{
		productId: "9262af38-8e6e-4746-9a55-22b3b8efb46d",
		slug: "Startup",
	},
	{
		productId: "6f8fcd68-ff69-42cd-93de-154308f747e5",
		slug: "Enterprise",
	},
];

const productionProducts: Product[] = [
	{
<<<<<<< HEAD
		productId: "ae409149-37cc-4328-99c2-6023bef27e14",
=======
		productId: "087c1d12-550e-4a6e-82ed-8b45dffa40c6",
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
		slug: "Basic",
	},
	{
		productId: "e64ff26b-d15e-4e86-8e09-b634a641fd3e",
		slug: "Pro",
	},
	{
		productId: "9262af38-8e6e-4746-9a55-22b3b8efb46d",
		slug: "Startup",
	},
	{
		productId: "6f8fcd68-ff69-42cd-93de-154308f747e5",
		slug: "Enterprise",
	},
];

export function getProducts(): Product[] {
	if (process.env.NODE_ENV === "production") {
		return productionProducts;
	}
	return sandboxProducts;
}
