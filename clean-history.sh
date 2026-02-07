#!/bin/bash
# Clean API key from git history

# Backup current branch
git branch backup-main

# Create new orphan branch (no history)
git checkout --orphan clean-main

# Add all files (they're already clean)
git add -A

# Create new initial commit
git commit -m "Initial commit: Harmoni OS V2 - Neuro Development Operating System"

# Force push to main (WARNING: This rewrites history!)
# git branch -D main
# git branch -m main
# git push -f origin main

echo "Clean branch created. To apply:"
echo "1. git branch -D main"
echo "2. git branch -m main"  
echo "3. git push -f origin main"

