#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Creating dist directory..."
mkdir -p dist

echo "Building CSS..."
npx postcss src/styles.css -o dist/styles.css

echo "Copying CSS to public directory..."
cp dist/styles.css ./public/main.css

echo "Build completed successfully!"
