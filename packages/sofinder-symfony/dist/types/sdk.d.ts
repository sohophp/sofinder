import type { AssetReference, UploadConflictStrategy } from "./types";
export type UploadTaskStatus = "queued" | "uploading" | "processing" | "ready" | "failed" | "canceled";
export type UploadSource = "picker" | "input" | "paste" | "drop";
export type ConflictResolution = Exclude<UploadConflictStrategy, "ask"> | "cancel";
export interface SoFinderSdkErrorShape {
    code: string;
    message: string;
    retryable: boolean;
}
export declare class SoFinderSdkError extends Error {
    readonly code: string;
    readonly status: number;
    readonly retryable: boolean;
    constructor(code: string, message: string, status?: number, retryable?: boolean);
}
export interface UploadTaskSnapshot {
    id: string;
    source: UploadSource;
    status: UploadTaskStatus;
    progress: number;
    file: File;
    result: AssetReference | null;
    error: SoFinderSdkErrorShape | null;
}
export interface UploadTask extends UploadTaskSnapshot {
    readonly completion: Promise<AssetReference>;
    cancel(): void;
    retry(): Promise<AssetReference>;
    subscribe(listener: (task: UploadTaskSnapshot) => void): () => void;
}
export interface SoFinderClientOptions {
    apiBase: string;
    csrfToken: string | (() => Promise<string>);
    credentials?: RequestCredentials;
    chunkThreshold?: number;
    chunkSize?: number;
    onConflict?: (file: File) => ConflictResolution | Promise<ConflictResolution>;
    conflictLabels?: Partial<{
        title: string;
        hint: string;
        rename: string;
        overwrite: string;
        skip: string;
        cancel: string;
    }>;
}
export interface UploadRequest {
    file: File;
    resource: string;
    path?: string;
    source?: UploadSource;
    conflictStrategy?: UploadConflictStrategy;
}
export interface SoFinderClient {
    upload(request: UploadRequest): UploadTask;
}
export declare const createSoFinderClient: (options: SoFinderClientOptions) => SoFinderClient;
