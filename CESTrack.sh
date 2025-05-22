#!/bin/bash

#Install if node_modules does not exist
[ ! -d "node_modules" ] && npm install

#Fix security issues if package-lock.json exists
[ -f "package-lock.json" ] && npm audit fix

#Build if .next does not exist
[ ! -d ".next" ] && npm run build

npm start
