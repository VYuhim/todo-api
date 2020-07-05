export interface IGetLink {
	method: 'GET';
	link: string;
}

export interface IUpdateLink {
	method: 'PATCH';
	link: string;
}

export interface IRemoveLink {
	method: 'DELETE';
	link: string;
}

export interface ICreateLink {
	method: 'POST';
	link: string;
}