// core/api.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const { generateModules } = require("./module-generator");
const APIGuardian = require("./gardian/api-guardian");
const {
  parseSwaggerFile,
  extractUniqueTags,
} = require("./parsers/swaggerParser");

const app = express();
const port = process.env.PORT || 3001;

// تنظیم کراس اوریجین
app.use(cors());
app.use(express.json());

// تنظیم ذخیره‌سازی فایل‌های آپلود شده
const upload = multer({
  dest: "uploads/",
});

// در بخش روت‌های express اضافه کنید
app.post(
  "/api/guardian/compare-specs",
  upload.fields([
    { name: "oldSpec", maxCount: 1 },
    { name: "newSpec", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const oldSpecFile = req.files["oldSpec"][0].path;
      const newSpecFile = req.files["newSpec"][0].path;
      const reportLevel = req.body.reportLevel || "all";
      const outputFormat = req.body.outputFormat || "json";

      const guardian = new APIGuardian({ reportLevel, outputFormat });
      const report = guardian.compareSpecs(oldSpecFile, newSpecFile);

      res.json({ report });
    } catch (error) {
      console.error("Error in compare-specs:", error);
      res.status(500).json({
        error: "Failed to compare specifications",
        details: error.message,
      });
    }
  }
);

app.post(
  "/api/guardian/validate-spec",
  upload.single("specFile"),
  (req, res) => {
    try {
      const specFile = req.file.path;

      // اعتبارسنجی فایل
      const swagger = parseSwaggerFile(specFile);

      res.json({
        valid: true,
        endpoints: extractUniqueTags(swagger).length,
        message: "Specification file is valid",
      });
    } catch (error) {
      console.error("Error validating spec:", error);
      res.status(400).json({
        valid: false,
        error: "Invalid specification file",
        details: error.message,
      });
    }
  }
);

// API برای دریافت ساختار دایرکتوری
app.get("/api/files/:outputPath(*)", (req, res) => {
  try {
    const outputPath = req.params.outputPath;
    const fullPath = path.resolve(outputPath);

    console.log("Requested path:", outputPath);
    console.log("Full path:", fullPath);

    // بررسی امنیتی - اطمینان از اینکه مسیر فقط در پوشه‌های مجاز است
    if (!fullPath.startsWith(process.cwd())) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this path",
      });
    }

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        message: "Path not found",
      });
    }

    const stats = fs.statSync(fullPath);

    if (stats.isFile()) {
      // اگر فایل است، محتوای آن را برگردان
      const content = fs.readFileSync(fullPath, "utf8");
      const extension = path.extname(fullPath).substring(1);

      return res.json({
        success: true,
        type: "file",
        name: path.basename(fullPath),
        extension,
        content,
        size: stats.size,
        modified: stats.mtime,
      });
    }

    if (stats.isDirectory()) {
      // اگر دایرکتوری است، لیست محتوا را برگردان
      const items = fs.readdirSync(fullPath).map((item) => {
        const itemPath = path.join(fullPath, item);
        const itemStats = fs.statSync(itemPath);
        const isDirectory = itemStats.isDirectory();

        return {
          name: item,
          path: path.relative(process.cwd(), itemPath).replace(/\\/g, "/"),
          type: isDirectory ? "directory" : "file",
          extension: isDirectory ? null : path.extname(item).substring(1),
          size: itemStats.size,
          modified: itemStats.mtime,
        };
      });

      // مرتب‌سازی: اول پوشه‌ها، سپس فایل‌ها
      items.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === "directory" ? -1 : 1;
      });

      return res.json({
        success: true,
        type: "directory",
        name: path.basename(fullPath),
        path: path.relative(process.cwd(), fullPath).replace(/\\/g, "/"),
        items,
      });
    }

    res.status(400).json({
      success: false,
      message: "Unsupported file type",
    });
  } catch (error) {
    console.error("Error exploring files:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to explore files",
    });
  }
});

app.get("/api/download/:outputPath", (req, res) => {
  try {
    const outputPath = req.params.outputPath;
    const zipPath = `${outputPath}.zip`;

    // تنظیم headers برای دانلود فایل
    res.attachment(`${path.basename(outputPath)}.zip`);
    res.setHeader("Content-Type", "application/zip");

    const archive = archiver("zip", {
      zlib: { level: 9 }, // سطح فشرده‌سازی حداکثر
    });

    // تنظیم جریان خروجی
    archive.pipe(res);

    // اضافه کردن محتوای پوشه به آرشیو
    archive.directory(outputPath, false);

    // نهایی کردن آرشیو
    archive.finalize();
  } catch (error) {
    console.error("Error creating ZIP file:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create ZIP file",
    });
  }
});

// API برای تولید کد
app.post("/api/generate-code", upload.single("swaggerFile"), (req, res) => {
  try {
    console.log("Received file:", req.file);
    console.log("Received options:", req.body);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No swagger file uploaded",
      });
    }

    const outputDir = req.body.outputDir || "output";
    const createFolders = req.body.createFolders === "true";
    const folderStructure = req.body.folderStructure || "modules";

    // اطمینان از وجود مسیر خروجی
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // اجرای تولید کد
    generateModules(req.file.path, {
      outputDir,
      createFolders,
      folderStructure,
    });

    res.json({
      success: true,
      message: "Code generated successfully",
      outputPath: outputDir,
      fileInfo: req.file,
    });
  } catch (error) {
    console.error("Error in generate-code endpoint:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate code",
    });
  }
});

// Add this code to src/core/api.js right before the app.listen() call

// Import generateMockServer function
const generateMockServer = require("./server/index");

// API for generating mock server
app.post(
  "/api/generate-mock-server",
  upload.single("swaggerFile"),
  (req, res) => {
    try {
      console.log("Generating mock server from file:", req.file);

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No swagger file uploaded",
        });
      }

      // Generate the mock server
      generateMockServer(req.file.path);

      // Get some info about the generated mock server
      const dbPath = path.join(process.cwd(), "server", "db.json");
      const routesPath = path.join(process.cwd(), "server", "routes.json");

      // Count the number of endpoints by reading the routes.json file
      let endpointCount = 0;
      if (fs.existsSync(routesPath)) {
        const routes = JSON.parse(fs.readFileSync(routesPath, "utf8"));
        endpointCount = Object.keys(routes).length;
      }

      // Get sample endpoints for display
      const sampleEndpoints = [];
      if (fs.existsSync(routesPath)) {
        const routes = JSON.parse(fs.readFileSync(routesPath, "utf8"));
        // Get up to 5 sample endpoints
        const routeKeys = Object.keys(routes).slice(0, 5);
        routeKeys.forEach((route) => {
          let method = "GET";
          // Try to infer method from route path
          if (route.includes("POST")) method = "POST";
          else if (route.includes("PUT")) method = "PUT";
          else if (route.includes("DELETE")) method = "DELETE";

          sampleEndpoints.push({
            path: route,
            method,
            description: `${method} ${routes[route]}`,
          });
        });
      }

      res.json({
        success: true,
        message: "Mock server generated successfully",
        dbPath: "server/db.json",
        routesPath: "server/routes.json",
        endpointCount,
        port: 3004,
        command:
          "npx json-server --watch server/db.json --routes server/routes.json --port 3004",
        endpoints: sampleEndpoints,
      });
    } catch (error) {
      console.error("Error generating mock server:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to generate mock server",
      });
    }
  }
);

// API for checking if mock server is running
app.get("/api/mock-server/status", (req, res) => {
  try {
    // Simple ping to check if json-server is running
    fetch("http://localhost:3004/")
      .then((response) => {
        if (response.ok) {
          res.json({
            running: true,
            port: 3004,
            message: "Mock server is running",
          });
        } else {
          res.json({
            running: false,
            message: "Mock server is not responding properly",
          });
        }
      })
      .catch(() => {
        res.json({
          running: false,
          message: "Mock server is not running",
        });
      });
  } catch (error) {
    res.json({
      running: false,
      message: "Error checking mock server status",
    });
  }
});

// افزودن مسیری برای آزمودن وضعیت API
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    message: "API is running",
  });
});

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
  console.log(`Test API status: http://localhost:${port}/api/status`);
});
