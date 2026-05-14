import { afterEach, describe, expect, it, vi } from "vitest";

const pwaRegisterMock = vi.hoisted(() => ({
  registerSW: vi.fn(() => async () => {}),
}));

vi.mock("virtual:pwa-register", () => ({
  registerSW: pwaRegisterMock.registerSW,
}));

function installServiceWorkerContainer() {
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: {},
  });
}

async function importFreshPwaUpdate() {
  vi.resetModules();
  return import("./pwaUpdate");
}

describe("registerPWA", () => {
  afterEach(() => {
    delete (window as unknown as { hushDesktop?: unknown }).hushDesktop;
    delete (navigator as unknown as { serviceWorker?: unknown }).serviceWorker;
    pwaRegisterMock.registerSW.mockClear();
  });

  it("registers the Service Worker in a normal browser renderer", async () => {
    installServiceWorkerContainer();
    const { registerPWA } = await importFreshPwaUpdate();

    registerPWA();

    expect(pwaRegisterMock.registerSW).toHaveBeenCalledOnce();
  });

  it("does not register the Service Worker in the Electron desktop renderer", async () => {
    installServiceWorkerContainer();
    (window as unknown as { hushDesktop?: { isDesktop: boolean } }).hushDesktop = {
      isDesktop: true,
    };
    const { registerPWA } = await importFreshPwaUpdate();

    registerPWA();

    expect(pwaRegisterMock.registerSW).not.toHaveBeenCalled();
  });
});
