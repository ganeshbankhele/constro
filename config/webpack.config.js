const webpackConfig = require('../node_modules/@ionic/app-scripts/config/webpack.config');
const ParallelUglifyPlugin = require('../node_modules/webpack-parallel-uglify-plugin');
const OPTIMIZE = process.env.IONIC_OPTIMIZE_JS;
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
module.exports = function () {
  let defaultConfig = useDefaultConfig;
  defaultConfig["prod"] = defaultConfig["dev"];
	return defaultConfig;
};
if (OPTIMIZE) {
    webpackConfig.prod.plugins.push(
        new ParallelUglifyPlugin({
            cacheDir: '.cache/',
            sourceMap: true,
            uglifyJS: {
                output: {
                    comments: false
                },
                mangle: true,
                compress: {

                    booleans: false,
                    collapse_vars: false,
                    comparisons: false,
                    hoist_funs: false,
                    hoist_props: false,
                    hoist_vars: false,
                    if_return: false,
                    inline: false,
                    join_vars: false,
                    keep_infinity: true,
                    loops: false,
                    negate_iife: false,
                    properties: false,
                    reduce_funcs: false,
                    reduce_vars: false,
                    sequences: false,
                    side_effects: false,
                    switches: false,
                    top_retain: false,
                    toplevel: false,
                    typeofs: false,
                    unused: false,
                    drop_console: true,
                    drop_debugger: true,
                    conditionals: true,
                    dead_code: true,
                    evaluate: true,
                    pure_getters: true
                }
            }
        })
    )
}