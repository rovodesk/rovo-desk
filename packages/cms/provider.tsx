import { generateUUID, slugify } from "@zero-heads-lab/shared/utils";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";
import {
	defaultActiveCollectionId,
	defaultCollections,
	defaultEntries,
} from "./default";
import type { CMSState, ContentEntry, SchemaField } from "./types";
import type { Collection } from "./types/collection";

function generateId() {
	return generateUUID();
}

export interface CMSContextType extends CMSState {
	// ───────── UI State ─────────

	setActiveCollection: (id: string | null) => void;
	setActiveEntry: (id: string | null) => void;
	setActiveField: (id: string | null) => void;

	setView: (view: CMSState["view"]) => void;

	// ───────── Collections ─────────

	addCollection: (name: string) => void;
	deleteCollection: (id: string) => void;

	// ───────── Schema Fields ─────────

	addField: (collectionId: string, field: Omit<SchemaField, "id">) => void;

	updateField: (
		collectionId: string,
		fieldId: string,
		updates: Partial<SchemaField>
	) => void;

	removeField: (collectionId: string, fieldId: string) => void;

	reorderFields: (
		collectionId: string,
		fromIndex: number,
		toIndex: number
	) => void;

	// ───────── Entries ─────────

	addEntry: (collectionId: string) => void;

	updateEntry: (entryId: string, updates: Partial<ContentEntry>) => void;

	deleteEntry: (entryId: string) => void;

	publishEntry: (entryId: string) => void;

	unpublishEntry: (entryId: string) => void;

	// ───────── Versions ─────────

	createVersion: (entryId: string) => void;

	restoreVersion: (entryId: string, versionId: string) => void;

	// ───────── Queries ─────────

	getActiveCollection: () => Collection | undefined;

	getActiveEntry: () => ContentEntry | undefined;

	getActiveField: () => SchemaField | undefined;

	getEntriesByCollection: (collectionId: string) => ContentEntry[];
}

const CMSContext = createContext<CMSContextType | null>(null);

export function CMSProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<CMSState>({
		collections: defaultCollections,

		entries: defaultEntries,

		versions: {},
		media: {},

		activeCollectionId: defaultActiveCollectionId,
		activeEntryId: null,
		activeFieldId: null,

		view: "schema",
		syncStatus: "synced",
	});

	const markSaved = useCallback(() => {
		setState((s) => ({ ...s, syncStatus: "saving" }));
		setTimeout(() => setState((s) => ({ ...s, syncStatus: "synced" })), 600);
	}, []);

	const setActiveCollection = useCallback((id: string | null) => {
		setState((s) => ({
			...s,
			activeCollectionId: id,
			activeEntryId: null,
			activeFieldId: null,
		}));
	}, []);

	const setActiveEntry = useCallback((id: string | null) => {
		setState((s) => ({ ...s, activeEntryId: id, activeFieldId: null }));
	}, []);

	const setActiveField = useCallback((id: string | null) => {
		setState((s) => ({ ...s, activeFieldId: id }));
	}, []);

	const setView = useCallback((view: CMSState["view"]) => {
		setState((s) => ({ ...s, view }));
	}, []);

	const addCollection = useCallback(
		(name: string) => {
			const col: Collection = {
				id: `col_${generateId()}`,
				name,
				slug: slugify(name),
				icon: "Folder",

				fields: [],

				timestamps: true,
				drafts: true,
				versions: true,

				createdAt: new Date(),
				updatedAt: new Date(),
			};

			setState((s) => ({
				...s,
				collections: { ...s.collections, [col.id]: col },
				activeCollectionId: col.id,
			}));

			markSaved();
		},
		[markSaved]
	);

	const deleteCollection = useCallback(
		(id: string) => {
			setState((s) => {
				const { [id]: _, ...rest } = s.collections;
				return {
					...s,
					collections: rest,
					activeCollectionId:
						s.activeCollectionId === id ? null : s.activeCollectionId,
				};
			});
			markSaved();
		},
		[markSaved]
	);

	const addField = useCallback(
		(collectionId: string, field: Omit<SchemaField, "id">) => {
			const newField: SchemaField = { ...field, id: `f_${generateId()}` };
			setState((s) => {
				const collection = s.collections[collectionId];
				if (!collection) return s;
				return {
					...s,
					collections: {
						...s.collections,
						[collectionId]: {
							...collection,
							fields: [...collection.fields, newField],
							updatedAt: new Date(),
						},
					},
					activeFieldId: newField.id,
				};
			});
			markSaved();
		},
		[markSaved]
	);

	const updateField = useCallback(
		(collectionId: string, fieldId: string, updates: Partial<SchemaField>) => {
			setState((s) => {
				const collection = s.collections[collectionId];
				if (!collection) return s;
				return {
					...s,
					collections: {
						...s.collections,
						[collectionId]: {
							...collection,
							fields: collection.fields.map((f) =>
								f.id === fieldId ? { ...f, ...updates } : f
							),
							updatedAt: new Date(),
						},
					},
				};
			});
			markSaved();
		},
		[markSaved]
	);

	const removeField = useCallback(
		(collectionId: string, fieldId: string) => {
			setState((s) => {
				const collection = s.collections[collectionId];
				if (!collection) return s;
				return {
					...s,
					collections: {
						...s.collections,
						[collectionId]: {
							...collection,
							fields: collection.fields.filter((f) => f.id !== fieldId),
							updatedAt: new Date(),
						},
					},
					activeFieldId: s.activeFieldId === fieldId ? null : s.activeFieldId,
				};
			});
			markSaved();
		},
		[markSaved]
	);

	const reorderFields = useCallback(
		(collectionId: string, fromIndex: number, toIndex: number) => {
			setState((s) => {
				const collection = s.collections[collectionId];
				if (!collection) return s;
				const fields = [...collection.fields];
				const [moved] = fields.splice(fromIndex, 1);
				if (moved) fields.splice(toIndex, 0, moved);
				return {
					...s,
					collections: {
						...s.collections,
						[collectionId]: {
							...collection,
							fields,
							updatedAt: new Date(),
						},
					},
				};
			});
			markSaved();
		},
		[markSaved]
	);
	const addEntry = useCallback(
		(collectionId: string) => {
			const entry: ContentEntry = {
				id: `e_${generateId()}`,
				collectionId,

				slug: undefined,

				data: {},

				status: "draft",

				system: {
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			};

			setState((s) => ({
				...s,
				entries: { ...s.entries, [entry.id]: entry },
				activeEntryId: entry.id,
				view: "content",
			}));

			markSaved();
		},
		[markSaved]
	);

	const updateEntry = useCallback(
		(entryId: string, updates: Partial<ContentEntry>) => {
			setState((s) => {
				const entry = s.entries[entryId];
				if (!entry) return s;
				return {
					...s,
					entries: {
						...s.entries,
						[entryId]: {
							...entry,
							...updates,
							system: {
								...entry.system,
								updatedAt: new Date(),
							},
						},
					},
				};
			});

			markSaved();
		},
		[markSaved]
	);

	const deleteEntry = useCallback(
		(entryId: string) => {
			setState((s) => {
				const { [entryId]: _, ...rest } = s.entries;
				return {
					...s,
					entries: rest,
					activeEntryId: s.activeEntryId === entryId ? null : s.activeEntryId,
				};
			});

			markSaved();
		},
		[markSaved]
	);

	const publishEntry = useCallback(
		(entryId: string) => {
			setState((s) => {
				const entry = s.entries[entryId];
				if (!entry) return s;
				return {
					...s,
					entries: {
						...s.entries,
						[entryId]: {
							...entry,
							status: "published",
							system: {
								...entry.system,
								updatedAt: new Date(),
								publishedAt: new Date(),
							},
						},
					},
				};
			});

			markSaved();
		},
		[markSaved]
	);

	const getActiveCollection = useCallback(() => {
		return state.activeCollectionId
			? state.collections[state.activeCollectionId]
			: undefined;
	}, [state.collections, state.activeCollectionId]);

	const getActiveEntry = useCallback(() => {
		return state.activeEntryId ? state.entries[state.activeEntryId] : undefined;
	}, [state.entries, state.activeEntryId]);

	const getActiveField = useCallback(() => {
		const col = getActiveCollection();
		return col?.fields.find((f) => f.id === state.activeFieldId);
	}, [getActiveCollection, state.activeFieldId]);

	const getEntriesByCollection = useCallback(
		(collectionId: string) => {
			return Object.values(state.entries).filter(
				(e) => e.collectionId === collectionId
			);
		},
		[state.entries]
	);

	const unpublishEntry = useCallback(
		(entryId: string) => {
			setState((s) => {
				const entry = s.entries[entryId];
				if (!entry) return s;
				return {
					...s,
					entries: {
						...s.entries,
						[entryId]: {
							...entry,
							status: "draft",
							system: {
								...entry.system,
								updatedAt: new Date(),
								publishedAt: undefined,
							},
						},
					},
				};
			});

			markSaved();
		},
		[markSaved]
	);

	const createVersion = useCallback(
		(entryId: string) => {
			setState((s) => {
				const entry = s.entries[entryId];
				if (!entry) return s;

				const versionId = `ver_${generateId()}`;
				const version = {
					id: versionId,
					entryId,
					data: entry.data,
					createdAt: new Date(),
				};

				return {
					...s,
					versions: { ...s.versions, [versionId]: version },
				};
			});

			markSaved();
		},
		[markSaved]
	);

	const restoreVersion = useCallback(
		(entryId: string, versionId: string) => {
			setState((s) => {
				const version = s.versions[versionId];
				const entry = s.entries[entryId];
				if (!(version && entry)) return s;

				return {
					...s,
					entries: {
						...s.entries,
						[entryId]: {
							...entry,
							data: version.data,
							system: {
								...entry.system,
								updatedAt: new Date(),
							},
						},
					},
				};
			});

			markSaved();
		},
		[markSaved]
	);

	const contextValue = {
		...state,
		setActiveCollection,
		setActiveEntry,
		setActiveField,
		setView,
		addCollection,
		deleteCollection,
		addField,
		updateField,
		removeField,
		reorderFields,
		addEntry,
		updateEntry,
		deleteEntry,
		publishEntry,
		unpublishEntry,
		createVersion,
		restoreVersion,
		getActiveCollection,
		getActiveEntry,
		getActiveField,
		getEntriesByCollection,
	};

	return (
		<CMSContext.Provider value={contextValue}>{children}</CMSContext.Provider>
	);
}

export function useCMS() {
	const ctx = useContext(CMSContext);
	if (!ctx) throw new Error("useCMS must be used within CMSProvider");
	return ctx;
}
