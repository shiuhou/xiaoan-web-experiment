export function resolveBrowserExecutable(environment = process.env) {
  const executablePath = environment.CHROME_PATH?.trim();
  return executablePath || undefined;
}
