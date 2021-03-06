import {Session} from "../Session";
import {PluginManager} from "../PluginManager";
import * as Path from "path";
import {homeDirectory, exists, readFile} from "../utils/Common";

async function withNvmPath(directory: string, callback: (path: string) => void) {
    const rcPath = Path.join(directory, ".nvmrc");

    if (await exists(rcPath)) {
        const version = (await readFile(rcPath)).trim();
        callback(Path.join(homeDirectory, ".nvm", "versions", "node", version, "bin"));
    }
}

PluginManager.registerEnvironmentObserver({
    currentWorkingDirectoryWillChange: async(session: Session) => {
        withNvmPath(session.directory, path => session.environment.path.remove(path));
    },
    currentWorkingDirectoryDidChange: async(session: Session, directory: string) => {
        withNvmPath(directory, path => session.environment.path.prepend(path));
    },
});
