const GZIP_MAGIC_BYTE_0 = 0x1f;
const GZIP_MAGIC_BYTE_1 = 0x8b;

function requireCompressionStream(kind) {
  const ctor = kind === 'compress' ? globalThis.CompressionStream : globalThis.DecompressionStream;
  if (typeof ctor !== 'function') {
    throw new Error(`[compression] ${kind}ion stream is not supported in this runtime`);
  }
  return ctor;
}

async function transformBytes(bytes, kind) {
  const StreamCtor = requireCompressionStream(kind);
  const source = new Response(bytes).body;
  if (!source) {
    throw new Error('[compression] could not create source stream');
  }
  const stream = source.pipeThrough(new StreamCtor('gzip'));
  const output = await new Response(stream).arrayBuffer();
  return new Uint8Array(output);
}

/**
 * @param {Uint8Array} bytes
 * @returns {boolean}
 */
export function isGzipBytes(bytes) {
  return bytes instanceof Uint8Array
    && bytes.byteLength >= 2
    && bytes[0] === GZIP_MAGIC_BYTE_0
    && bytes[1] === GZIP_MAGIC_BYTE_1;
}

/**
 * @returns {boolean}
 */
export function supportsGzipCompression() {
  return typeof globalThis.CompressionStream === 'function'
    && typeof globalThis.DecompressionStream === 'function';
}

/**
 * @param {Uint8Array} bytes
 * @returns {Promise<Uint8Array>}
 */
export async function gzipBytes(bytes) {
  return transformBytes(bytes, 'compress');
}

/**
 * @param {Uint8Array} bytes
 * @returns {Promise<Uint8Array>}
 */
export async function gunzipBytes(bytes) {
  return transformBytes(bytes, 'decompress');
}
