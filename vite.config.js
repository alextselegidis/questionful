/* ----------------------------------------------------------------------------
 * Questionful - Questionnaires Made Simple
 *
 * @package     Questionful
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) Alex Tselegidis
 * @license     https://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        https://questionful.org
 * @since       v1.0.x
 * ---------------------------------------------------------------------------- */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "build",
        rollupOptions: {
            input: resolve(__dirname, "index.html"),
        },
    },
});
