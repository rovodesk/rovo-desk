export async function validateRequest(request: Request) {
	return await request.json();
}
