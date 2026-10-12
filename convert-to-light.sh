#!/bin/bash
# Convert dark theme Tailwind classes to light theme

find src -name "*.tsx" -type f -exec sed -i \
  -e 's/bg-slate-950/bg-white/g' \
  -e 's/bg-slate-900/bg-gray-50/g' \
  -e 's/bg-slate-800/bg-gray-100/g' \
  -e 's/bg-slate-700/bg-gray-200/g' \
  -e 's/text-slate-100/text-gray-900/g' \
  -e 's/text-slate-200/text-gray-800/g' \
  -e 's/text-slate-300/text-gray-700/g' \
  -e 's/text-slate-400/text-gray-600/g' \
  -e 's/text-slate-500/text-gray-500/g' \
  -e 's/border-slate-800/border-gray-200/g' \
  -e 's/border-slate-700/border-gray-300/g' \
  -e 's/text-white/text-gray-900/g' \
  -e 's/text-cyan-400/text-blue-600/g' \
  -e 's/text-cyan-300/text-blue-500/g' \
  -e 's/bg-cyan-500/bg-blue-600/g' \
  -e 's/bg-cyan-400/bg-blue-500/g' \
  -e 's/border-cyan-500/border-blue-500/g' \
  -e 's/shadow-cyan-500/shadow-blue-500/g' \
  {} +

echo "Light theme conversion complete!"
