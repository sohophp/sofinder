/** Controllable browser transport: tests deliver real XHR lifecycle events. */
export class UploadRequest {
  static sent: UploadRequest[] = [];
  upload: { onprogress?: (event: Partial<ProgressEvent>) => void; onload?: () => void } = {};
  onload?: () => void;
  onerror?: () => void;
  onabort?: () => void;
  status = 0;
  responseText = "";
  withCredentials = false;
  method = "";
  url = "";
  body!: FormData;
  headers: Record<string, string> = {};
  open(method: string, url: string) { this.method = method; this.url = url; }
  setRequestHeader(name: string, value: string) { this.headers[name] = value; }
  getResponseHeader() { return "application/json"; }
  send(body: FormData) { this.body = body; UploadRequest.sent.push(this); }
  progress(loaded: number, total: number) { this.upload.onprogress?.({ loaded, total, lengthComputable: true }); }
  finishSending() { this.upload.onload?.(); }
  respond(data: unknown, status = 200) { this.status = status; this.responseText = JSON.stringify({ success: true, data }); this.onload?.(); }
  reject(code: string, status: number) { this.status = status; this.responseText = JSON.stringify({ success: false, error: { code, message: code } }); this.onload?.(); }
  fail() { this.onerror?.(); }
  abort() { this.onabort?.(); }
}
