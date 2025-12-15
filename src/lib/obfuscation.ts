export async function obfuscate(text: string) {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded,
  );

  const exportedKey = await crypto.subtle.exportKey("raw", key);

  const valueBytes = new Uint8Array(iv.length + encrypted.byteLength);
  valueBytes.set(iv);
  valueBytes.set(new Uint8Array(encrypted), iv.length);

  return {
    value: toBase64(valueBytes),
    key: toBase64(new Uint8Array(exportedKey)),
  };
}

function toBase64(bytes: Uint8Array) {
  if (typeof window === "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(base64: string) {
  if (typeof window === "undefined") {
    return Uint8Array.from(Buffer.from(base64, "base64"));
  }

  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

export async function deobfuscate(value: string, keyBase64: string) {
  // Decode Base64
  const keyBytes = fromBase64(keyBase64);
  const valueBytes = fromBase64(value);

  // Extract IV (first 12 bytes) and Ciphertext
  const iv = valueBytes.slice(0, 12);
  const ciphertext = valueBytes.slice(12);

  // Import Key
  const key = await window.crypto.subtle.importKey(
    "raw",
    keyBytes,
    "AES-GCM",
    true,
    ["decrypt"],
  );

  // Decrypt
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );

  return new TextDecoder().decode(decryptedBuffer);
}

export async function setupObfuscatedLinks() {
  if (typeof window === "undefined") {
    throw new Error("setupObfuscatedLinks can only be run in the browser");
  }

  const elements = document.querySelectorAll<HTMLElement>("[data-ob]");
  for (const el of elements) {
    const targetAttr = el.getAttribute("data-ob");
    const keyStr = el.getAttribute("data-ob-key");
    if (!targetAttr || !keyStr) continue;

    // Clean up attributes
    el.removeAttribute("data-ob");
    el.removeAttribute("data-ob-key");

    // Get the encrypted value from the target attribute
    let encryptedValue = "";
    if (targetAttr === "innerText") {
      encryptedValue = el.innerText;
    } else {
      encryptedValue = el.getAttribute(targetAttr) || "";
    }

    if (!encryptedValue) continue;

    try {
      const decrypted = await deobfuscate(encryptedValue, keyStr);

      if (decrypted) {
        if (targetAttr === "innerText") {
          el.innerText = decrypted;
        } else {
          el.setAttribute(targetAttr, decrypted);
        }
      }
    } catch (e) {
      console.error("Failed to deobfuscate", e);
    }
  }
}
