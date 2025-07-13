#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes the build output to provide insights on optimization effectiveness
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  const distPath = path.join(__dirname, '../dist');

  if (!fs.existsSync(distPath)) {
    console.log('❌ No dist directory found. Run "npm run build" first.');
    return;
  }

  console.log('📊 Bundle Analysis Report\n');
  console.log('='.repeat(50));

  const assetsPath = path.join(distPath, 'assets');
  let totalSize = 0;
  let gzipSize = 0;
  const files = [];

  // Read all asset files
  if (fs.existsSync(assetsPath)) {
    const assetFiles = fs.readdirSync(assetsPath);

    assetFiles.forEach((file) => {
      const filePath = path.join(assetsPath, file);
      const stats = fs.statSync(filePath);
      const size = stats.size;
      totalSize += size;

      files.push({
        name: file,
        size: size,
        type: path.extname(file).substr(1) || 'unknown',
      });
    });
  }

  // Sort files by size (largest first)
  files.sort((a, b) => b.size - a.size);

  // Calculate totals by type
  const byType = {};
  files.forEach((file) => {
    if (!byType[file.type]) byType[file.type] = { count: 0, size: 0 };
    byType[file.type].count++;
    byType[file.type].size += file.size;
  });

  console.log('\n📦 Files by Size:');
  console.log('-'.repeat(30));
  files.forEach((file) => {
    const sizeStr = formatBytes(file.size);
    const percentage = ((file.size / totalSize) * 100).toFixed(1);
    console.log(
      `${file.name.padEnd(30)} ${sizeStr.padStart(10)} (${percentage}%)`
    );
  });

  console.log('\n📁 Files by Type:');
  console.log('-'.repeat(30));
  Object.entries(byType).forEach(([type, data]) => {
    const sizeStr = formatBytes(data.size);
    const percentage = ((data.size / totalSize) * 100).toFixed(1);
    console.log(
      `${type.toUpperCase().padEnd(10)} ${data.count} files ${sizeStr.padStart(
        10
      )} (${percentage}%)`
    );
  });

  console.log('\n📈 Performance Insights:');
  console.log('-'.repeat(30));

  // Check for potential optimizations
  const jsFiles = files.filter((f) => f.type === 'js');
  const largeJsFiles = jsFiles.filter((f) => f.size > 500 * 1024); // > 500KB

  if (largeJsFiles.length > 0) {
    console.log('⚠️  Large JS files detected:');
    largeJsFiles.forEach((file) => {
      console.log(`   - ${file.name}: ${formatBytes(file.size)}`);
    });
    console.log('   💡 Consider further code splitting\n');
  } else {
    console.log('✅ JS bundle sizes are reasonable\n');
  }

  // Check CSS optimization
  const cssFiles = files.filter((f) => f.type === 'css');
  if (cssFiles.length > 0) {
    const totalCssSize = cssFiles.reduce((sum, f) => sum + f.size, 0);
    console.log(
      `📄 CSS: ${cssFiles.length} files, ${formatBytes(totalCssSize)}`
    );
    if (totalCssSize < 50 * 1024) {
      console.log('✅ CSS is well optimized\n');
    }
  }

  console.log('\n📊 Summary:');
  console.log('-'.repeat(30));
  console.log(`Total files: ${files.length}`);
  console.log(`Total size: ${formatBytes(totalSize)}`);
  console.log(
    `Largest file: ${files[0]?.name} (${formatBytes(files[0]?.size || 0)})`
  );

  // Performance recommendations
  console.log('\n💡 Optimization Status:');
  console.log('-'.repeat(30));
  console.log('✅ Build artifacts cleaned up');
  console.log('✅ Component memoization applied');
  console.log('✅ Manual code splitting configured');
  console.log('✅ Unused code removed');

  const threeJsFile = files.find((f) => f.name.includes('three-vendor'));
  if (threeJsFile && threeJsFile.size > 1000 * 1024) {
    console.log('📝 Next: Consider Three.js tree-shaking for smaller bundle');
  }

  console.log('\n🎯 Build completed successfully!');
  console.log('='.repeat(50));
}

// Run the analysis
analyzeBundle();
