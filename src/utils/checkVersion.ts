import {
  getLocalStorage,
  LOCALSTORAGE_PREFIX,
  setLocalStorage,
} from './localStorage';
import packageJson from '../../package.json';

export const LOCALSTORAGE_PAGEVERSION = `${LOCALSTORAGE_PREFIX}-pageVersion`;

const version = packageJson.version;
console.log(`IQ96 web app version ${version}`);

export function checkVersion() {
  const storedVersion: string | null = getLocalStorage(
    LOCALSTORAGE_PAGEVERSION,
  );
  if (storedVersion && storedVersion !== version) {
    alert(
      `Der er en nyere version af siden (v${storedVersion} -> v${version}). Opdater ved at trykke OK`,
    );
    window.location.reload();
  }
  setLocalStorage(LOCALSTORAGE_PAGEVERSION, version);
}
