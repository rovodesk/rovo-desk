// async countUserOrganizations(params: {
// 	userId: string;
// }): Promise<number | null> {
// 	return await this.tracer.withSpan(
// 		"auth.query.countUserOrganizations",
// 		async (span) => {
// 			span.setAttribute("auth.user_id", params.userId);

// 			const [count] = await this.db
// 				.select({
// 					count: sql<number>`count(*)`,
// 				})
// 				.from(userSchema)
// 				.leftJoin(memberSchema, eq(memberSchema.userId, userSchema.id))
// 				.leftJoin(
// 					organizationSchema,
// 					eq(memberSchema.organizationId, organizationSchema.id)
// 				)
// 				.where(eq(userSchema.id, params.userId))
// 				.limit(1);

// 			return count ?? null;
// 		},
// 		{
// 			"db.operation": "select",
// 			"db.table": "user,member,organization",
// 		}
// 	);
// }
