export type BaseType = {
    createdAt: Date;
    updatedAt: Date;
};

export type UpdateEntityType<T> = Partial<
    Omit<T, "_id" | "createdAt" | "updatedAt">
>;
