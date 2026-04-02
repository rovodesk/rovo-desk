import { relations } from "drizzle-orm";

import {
	accessRequest,
	auditLog,
	invitation,
	membership,
	membershipRole,
	organization,
	permission,
	providerIdentity,
	role,
	rolePermission,
	team,
	teamMembership,
	user,
} from "./schemas";

/* =========================================================
 * USER
 * ========================================================= */

export const userRelations = relations(user, ({ many }) => ({
	memberships: many(membership),
	providerIdentities: many(providerIdentity),
	invitationsSent: many(invitation, {
		relationName: "invitedByUser",
	}),
	accessRequests: many(accessRequest),
	auditLogs: many(auditLog),
}));

/* =========================================================
 * ORGANIZATION
 * ========================================================= */

export const organizationRelations = relations(organization, ({ many }) => ({
	memberships: many(membership),
	teams: many(team),
	invitations: many(invitation),
	roles: many(role),
	accessRequests: many(accessRequest),
	auditLogs: many(auditLog),
}));

/* =========================================================
 * MEMBERSHIP
 * ========================================================= */

export const membershipRelations = relations(membership, ({ one, many }) => ({
	user: one(user, {
		fields: [membership.userId],
		references: [user.id],
	}),

	organization: one(organization, {
		fields: [membership.organizationId],
		references: [organization.id],
	}),

	invitedByUser: one(user, {
		fields: [membership.invitedByUserId],
		references: [user.id],
		relationName: "membershipInvitedByUser",
	}),

	teamMemberships: many(teamMembership),
	membershipRoles: many(membershipRole),
}));

/* =========================================================
 * TEAM
 * ========================================================= */

export const teamRelations = relations(team, ({ one, many }) => ({
	organization: one(organization, {
		fields: [team.organizationId],
		references: [organization.id],
	}),

	teamMemberships: many(teamMembership),
	invitations: many(invitation),
}));

/* =========================================================
 * TEAM MEMBERSHIP
 * ========================================================= */

export const teamMembershipRelations = relations(teamMembership, ({ one }) => ({
	team: one(team, {
		fields: [teamMembership.teamId],
		references: [team.id],
	}),

	membership: one(membership, {
		fields: [teamMembership.membershipId],
		references: [membership.id],
	}),
}));

/* =========================================================
 * INVITATION
 * ========================================================= */

export const invitationRelations = relations(invitation, ({ one }) => ({
	organization: one(organization, {
		fields: [invitation.organizationId],
		references: [organization.id],
	}),

	team: one(team, {
		fields: [invitation.teamId],
		references: [team.id],
	}),

	invitedByUser: one(user, {
		fields: [invitation.invitedByUserId],
		references: [user.id],
		relationName: "invitedByUser",
	}),
}));

/* =========================================================
 * ROLE
 * ========================================================= */

export const roleRelations = relations(role, ({ one, many }) => ({
	organization: one(organization, {
		fields: [role.organizationId],
		references: [organization.id],
	}),

	rolePermissions: many(rolePermission),
	membershipRoles: many(membershipRole),
}));

/* =========================================================
 * PERMISSION
 * ========================================================= */

export const permissionRelations = relations(permission, ({ many }) => ({
	rolePermissions: many(rolePermission),
}));

/* =========================================================
 * ROLE PERMISSION
 * ========================================================= */

export const rolePermissionRelations = relations(rolePermission, ({ one }) => ({
	role: one(role, {
		fields: [rolePermission.roleId],
		references: [role.id],
	}),

	permission: one(permission, {
		fields: [rolePermission.permissionId],
		references: [permission.id],
	}),
}));

/* =========================================================
 * MEMBERSHIP ROLE
 * ========================================================= */

export const membershipRoleRelations = relations(membershipRole, ({ one }) => ({
	membership: one(membership, {
		fields: [membershipRole.membershipId],
		references: [membership.id],
	}),

	role: one(role, {
		fields: [membershipRole.roleId],
		references: [role.id],
	}),
}));

/* =========================================================
 * PROVIDER IDENTITY
 * ========================================================= */

export const providerIdentityRelations = relations(
	providerIdentity,
	({ one }) => ({
		user: one(user, {
			fields: [providerIdentity.userId],
			references: [user.id],
		}),
	})
);

/* =========================================================
 * ACCESS REQUEST
 * ========================================================= */

export const accessRequestRelations = relations(accessRequest, ({ one }) => ({
	organization: one(organization, {
		fields: [accessRequest.organizationId],
		references: [organization.id],
	}),
}));

/* =========================================================
 * AUDIT LOG
 * ========================================================= */

export const auditLogRelations = relations(auditLog, ({ one }) => ({
	user: one(user, {
		fields: [auditLog.userId],
		references: [user.id],
	}),

	organization: one(organization, {
		fields: [auditLog.organizationId],
		references: [organization.id],
	}),
}));
