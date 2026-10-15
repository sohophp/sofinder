export class UploadNetworkError extends Error {
  constructor() { super("The upload failed because of a network error."); }
}

/** XHR exposes upload bytes while fetch only reports the completed response. */
export function postUpload(url: string, form: FormData, csrfToken: string, options: {
  signal?: AbortSignal;
  credentials?: RequestCredentials;
  onProgress?: (fraction: number) => void;
}): Promise<{ text: string; status: number; contentType: string }> {
  // XHR cannot omit same-origin cookies. Preserve explicitly anonymous SDK requests.
  if (options.credentials === "omit") {
    return fetch(url, { method: "POST", body: form, signal: options.signal, credentials: "omit",
      headers: { Accept: "application/json", "X-CSRF-TOKEN": csrfToken } }).then(async response => {
      options.onProgress?.(1);
      return { text: await response.text(), status: response.status, contentType: response.headers.get("Content-Type") || "" };
    }).catch(error => {
      if (error instanceof DOMException && error.name === "AbortError") throw error;
      throw new UploadNetworkError();
    });
  }
  return new Promise((resolve, reject) => {
    if (options.signal?.aborted) { reject(new DOMException("The upload was cancelled.", "AbortError")); return; }
    const xhr = new XMLHttpRequest();
    const cleanup = () => options.signal?.removeEventListener("abort", abort);
    const abort = () => xhr.abort();
    xhr.open("POST", url);
    xhr.withCredentials = options.credentials === "include";
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
    xhr.upload.onprogress = event => {
      if (event.lengthComputable && event.total > 0) options.onProgress?.(Math.min(1, event.loaded / event.total));
    };
    xhr.upload.onload = () => options.onProgress?.(1);
    xhr.onload = () => { cleanup(); resolve({ text: xhr.responseText, status: xhr.status, contentType: xhr.getResponseHeader("Content-Type") || "" }); };
    xhr.onerror = () => { cleanup(); reject(new UploadNetworkError()); };
    xhr.onabort = () => { cleanup(); reject(new DOMException("The upload was cancelled.", "AbortError")); };
    options.signal?.addEventListener("abort", abort, { once: true });
    try { xhr.send(form); } catch (error) { cleanup(); reject(error); }
  });
}

export const uploadPercentage = (bytes: number, total: number): number => Math.min(99, Math.max(0, Math.round(bytes / Math.max(1, total) * 100)));

/** Confirmed chunks can be sparse after an interruption; count their actual bytes. */
export function receivedUploadBytes(received: Set<number>, size: number, chunkSize: number): number {
  let bytes = 0;
  for (const index of received) bytes += Math.min(chunkSize, size - index * chunkSize);
  return bytes;
}

export function receivedUploadChunks(indexes: number[], total: number): Set<number> {
  const received = new Set(indexes.filter(index => Number.isInteger(index) && index >= 0 && index < total));
  // Re-send the final chunk if all bytes are stored but finalization was interrupted.
  if (received.size === total) received.delete(total - 1);
  return received;
}
