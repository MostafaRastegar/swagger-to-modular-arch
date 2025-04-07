// core/api.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const { generateModules } = require("./module-generator");

const app = express();
const port = process.env.PORT || 3001;

// تنظیم کراس اوریجین
app.use(cors());
app.use(express.json());

// تنظیم ذخیره‌سازی فایل‌های آپلود شده
const upload = multer({
  dest: "uploads/",
});

// core/api.js - بخش API مرور فایل‌ها را به روز کنید

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
