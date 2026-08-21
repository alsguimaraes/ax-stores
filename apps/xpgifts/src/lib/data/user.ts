export type User = {
	id: string;
	name: string;
	email: string;
	avatar: string;
};

// Mock "logged in" profile - replace with real session data once auth is implemented.
export function getCurrentUser(): User {
	return {
		id: "user_1",
		name: "Jamie Rivera",
		email: "jamie.rivera@example.com",
		avatar: "https://i.pravatar.cc/150?u=jamie-rivera",
	};
}
