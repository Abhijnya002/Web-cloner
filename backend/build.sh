#!/usr/bin/env bash

# Install Python dependencies
pip install -r requirements.txt

# Install Chromium for Playwright
playwright install chromium
