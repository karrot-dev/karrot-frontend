"use strict";

import gulp     from "gulp";
import webpack  from "webpack";
import path     from "path";
import rename   from "gulp-rename";
import template from "gulp-template";
import eslint   from "gulp-eslint";
import yargs    from "yargs";
import gutil    from "gulp-util";
import serve    from "browser-sync";
import del      from "del";
import proxy    from "http-proxy-middleware";
import runSequence          from "run-sequence";
import webpackDevMiddelware from "webpack-dev-middleware";
import webpackHotMiddelware from "webpack-hot-middleware";
import colorsSupported      from "supports-color";
import historyApiFallback   from "connect-history-api-fallback";

const BACKEND = process.env.BACKEND || "https://fstool.yunity.org/";

let root = "client";

// helper method for resolving paths
let resolveToApp = (glob = "") => {
  return path.join(root, "app", glob); // app/{glob}
};

let resolveToComponents = (glob = "") => {
  return path.join(root, "app/components", glob); // app/components/{glob}
};

// map of all paths
let paths = {
  js: resolveToComponents("**/*!(.spec.js).js"), // exclude spec files
  styl: resolveToApp("**/*.styl"), // stylesheets
  html: [
    resolveToApp("**/*.html"),
    path.join(root, "index.html")
  ],
  entry: [
    "babel-polyfill",
    path.join(__dirname, root, "app/app.js")
  ],
  output: root,
  blankTemplates: (temp) => {
    return path.join(__dirname, "generator", temp, "**/*.**");
  },
  dest: path.join(__dirname, "dist")
};

gulp.task("dist", (cb) => {
  runSequence("lint", "webpack", cb);
});

// use webpack.config.js to build modules
gulp.task("webpack", ["clean"], (cb) => {
  const config = require("./webpack.dist.config");
  config.entry.app = paths.entry;

  webpack(config, (err, stats) => {
    if (err)  {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[webpack]", stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: true
    }));

    cb();
  });
});

gulp.task("lint", () => {
  return gulp.src([
    "**/*.js",
    "!node_modules/**",
    "!dist/**",
    "!generator/**"
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task("serve", () => {
  const config = require("./webpack.dev.config");
  config.entry.app = [
    // this modules required to make HRM working
    // it responsible for all this webpack magic
    "webpack-hot-middleware/client?reload=true"
    // application entry point
  ].concat(paths.entry);

  let compiler = webpack(config);

  serve({
    port: process.env.PORT || 3000,
    open: false,
    server: { baseDir: root },
    middleware: [
      // to foodsaving-backend
      proxy("/api", {
        target: BACKEND,
        changeOrigin: true,
        onProxyReq: (proxyReq) => {
          if (/^https:/.test(BACKEND)) {
            // For secure backends we must set the referer to make django happy
            // https://github.com/django/django/blob/master/django/middleware/csrf.py#L226
            // If the backend tries to use this referer for anything useful it will break
            // as it is a blatant lie, but I don't think it does...
            proxyReq.setHeader("referer", BACKEND);
          }
        }
      }),

      historyApiFallback(),
      webpackDevMiddelware(compiler, {
        stats: {
          colors: colorsSupported,
          chunks: false,
          modules: false
        },
        publicPath: config.output.publicPath
      }),
      webpackHotMiddelware(compiler)
    ]
  });
});

gulp.task("watch", ["serve"]);

gulp.task("component", () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const name = yargs.argv.name || "componentGeneratorGulpTest";
  const temp = "component";
  const parentPath = yargs.argv.parent || "";
  const destPath = path.join(resolveToComponents(), parentPath, "_" + name);

  return gulp.src(paths.blankTemplates(temp))
    .pipe(template({
      name,
      upCaseName: cap(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace("temp", name);
    }))
    .pipe(gulp.dest(destPath));
});

gulp.task("page", () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const name = yargs.argv.name || "pageGeneratorGulpTest";
  const generator = "page";
  const parentPath = yargs.argv.parent || "";
  const destPath = path.join(resolveToComponents(), parentPath, name);

  return gulp.src(paths.blankTemplates(generator))
    .pipe(template({
      name,
      upCaseName: cap(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace("temp", name);
    }))
    .pipe(gulp.dest(destPath));
});

gulp.task("clean", (cb) => {
  del([paths.dest]).then((paths) => {
    gutil.log("[clean]", paths);
    cb();
  });
});

gulp.task("default", ["watch"]);
