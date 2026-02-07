#!/bin/bash
# Remove API key from git history

# Create a backup branch first
git branch backup-before-cleanup

# Remove API key from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch apps/web/app/api/ai/summary/[studentId]/route.ts apps/web/app/api/ai/assistant/route.ts apps/web/SETUP-DATABASE.md 2>/dev/null || true" \
  --prune-empty --tag-name-filter cat -- --all

# Re-add files without API key
git filter-branch --force --tree-filter \
  "if [ -f 'apps/web/app/api/ai/summary/[studentId]/route.ts' ]; then
     sed -i 's/AIzaSyBxgxmd6r6nkWntA1D4kTIKnJFLaX2rX0g/your_gemini_api_key_here/g' 'apps/web/app/api/ai/summary/[studentId]/route.ts' 2>/dev/null || true
   fi
   if [ -f 'apps/web/app/api/ai/assistant/route.ts' ]; then
     sed -i 's/AIzaSyBxgxmd6r6nkWntA1D4kTIKnJFLaX2rX0g/your_gemini_api_key_here/g' 'apps/web/app/api/ai/assistant/route.ts' 2>/dev/null || true
   fi
   if [ -f 'apps/web/SETUP-DATABASE.md' ]; then
     sed -i 's/AIzaSyBxgxmd6r6nkWntA1D4kTIKnJFLaX2rX0g/your_gemini_api_key_here/g' 'apps/web/SETUP-DATABASE.md' 2>/dev/null || true
   fi" \
  --prune-empty --tag-name-filter cat -- --all

echo "API key removed from git history. Run: git push --force origin main"

