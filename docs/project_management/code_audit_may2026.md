# AgroGuru Code Audit — May 2026

## Summary

A full-stack code audit was performed on 2 May 2026 covering project structure, security, code quality, frontend architecture, backend architecture, and DevOps practices.

## Key Findings

### Critical (9 issues)
- Hardcoded credentials (email, password, JWT secret) in source code
- Emergency master password bypass in login endpoint
- Nested `.git` repo inside `backend/`
- No `__init__.py` in backend subpackages
- 20+ dead one-off scripts in `frontend/src/`
- 253KB data file (`crop-list.js`) bloating the bundle
- Duplicate `SmartPriceHub.js` at 3-level nested path

### High (11 issues)
- 5 duplicate launcher scripts with hardcoded paths
- Backend writing to frontend `.env.local`
- `sys.path.append` hacks instead of proper packages
- Pydantic models defined but unused (raw `dict` in routers)
- Copy-pasted tier-sort logic across 3 routers
- Global mutable `db` variable
- Bare `except:` clauses silencing errors

### Medium (11 issues)
- No centralized API service layer in frontend
- No error boundaries
- No backend/frontend tests
- Inconsistent directory casing
- Deprecated `datetime.utcnow()` usage

## Proposed Structure

See full audit document for proposed restructured directory tree.

## Action Plan

| Phase | Scope | Effort |
|-------|-------|--------|
| Phase 1 | Security + Hygiene cleanup | ~1 hour |
| Phase 2 | Structural refactor | ~2-3 hours |
| Phase 3 | Quality + Documentation | ~2 hours |

## Status
- [x] Audit completed
- [ ] Phase 1 implementation
- [ ] Phase 2 implementation
- [ ] Phase 3 implementation
