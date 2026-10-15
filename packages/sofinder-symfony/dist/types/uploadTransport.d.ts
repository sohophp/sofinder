export declare class UploadNetworkError extends Error {
    constructor();
}
/** XHR exposes upload bytes while fetch only reports the completed response. */
export declare function postUpload(url: string, form: FormData, csrfToken: string, options: {
    signal?: AbortSignal;
    credentials?: RequestCredentials;
    onProgress?: (fraction: number) => void;
}): Promise<{
    text: string;
    status: number;
    contentType: string;
}>;
export declare const uploadPercentage: (bytes: number, total: number) => number;
/** Confirmed chunks can be sparse after an interruption; count their actual bytes. */
export declare function receivedUploadBytes(received: Set<number>, size: number, chunkSize: number): number;
export declare function receivedUploadChunks(indexes: number[], total: number): Set<number>;
