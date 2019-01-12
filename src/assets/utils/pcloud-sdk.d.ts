declare module "pcloud-sdk-js" {
	export interface ApiRequestOptions {
		method?: "get" | "post";
		responseType?: "text" | "json" | "blob";

		// Progress Callback that can be used for upload/download/text process
		onProgress?: (T: ProgressEvent) => void;

		// browser only, passes the XHR object to you in case you want to work with it
		xhr?: (xhr: XMLHttpRequest) => void;

		// get params
		params?: {};

		// files to upload
		files?: Array<UploadFile>;

		// post data
		data?: Object;

		apiServer?: string;
		apiProtocol?: string;
	}

	export interface UploadFile {
		name: string;
		file: string | File;
	}

	export interface ProgressEvent {
		direction: "upload" | "download";
		loaded: number;
		total: number;
	}

	interface UploadOptions {
		onBegin?: () => void;
		onProgress?: (T: { loaded: number; total: number }) => void;
		onFinish?: () => void;
	}

	export interface ApiMethodOptions extends ApiRequestOptions {
		apiServer?: string;
		apiProtocol?: string;
	}

	export interface Client {
		api: (method: string, options: ApiMethodOptions) => Promise<any>;
		setupProxy: () => Promise<boolean>;
		appshare: (
			folderid: number,
			userid: number,
			clientid: string,
			access: "view" | "edit"
		) => Promise<boolean>;
		createfolder: (name: string, parentfolderid?: number) => Promise<any>;
		deletefile: (fileid: number) => Promise<boolean>;
		deletefolder: (folderid: number) => Promise<boolean>;
		getfilelink: (fileid: number) => Promise<string>;
		upload: (
			file: Blob | File,
			folderid: number,
			options: UploadOptions
		) => Promise<any>;
	}

	export function APIRequest(
		url: string,
		options: ApiRequestOptions
	): Promise<string | {}>;

	export function APIMethod(
		method: string,
		options: ApiMethodOptions
	): Promise<any>;

	interface oauth {
		initOauthToken: (
			{
				client_id,
				redirect_uri,
				response_type,
				receiveToken
			}: {
				client_id: string;
				redirect_uri: string;
				response_type: "token" | "code";
				receiveToken: (token: string) => void;
			}
		) => void;
		initOauthPollToken: (
			{
				client_id,
				receiveToken,
				onError
			}: {
				client_id: string;
				receiveToken: () => void;
				onError: () => void;
			}
		) => void;
		popup: () => void;
		getTokenFromCode: (
			code: string,
			client_id: string,
			app_secret: string
		) => Promise<{ userid: string; access_token: string }>;
	}
	export const oauth: oauth;

	export function createClient(
		token: string,
		useProxy?: boolean,
		type?: "oauth" | "pcloud"
	): Client;
}
