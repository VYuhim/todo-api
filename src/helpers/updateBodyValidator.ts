export const updateBodyValidator = <T>(params: T): Partial<T> => {
	return Object.fromEntries(
		Object
			.entries(params)
			.filter(([_key, value]) => value !== undefined)
	) as Partial<T>;
}
