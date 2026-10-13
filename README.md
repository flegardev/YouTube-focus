# YouTube Focus

Focus-session calculations, a React timer hook, and distraction summary components.

## Scope

This repository currently contains TypeScript domain logic, hooks, and React components. It does not contain a complete application entry point or a verified hosted product. The build command checks/compiles TypeScript; it does not produce a deployable website. Previously advertised external demo links have been removed because ownership and operation could not be verified.

Source: https://github.com/flegardev/YouTube-focus

## Development and verification

Use Node.js 24 and the committed npm lockfile.

```sh
npm ci
npm audit --audit-level=high
npm run lint
npm run typecheck
npm test
npm run build
```

These checks passed locally on 2026-10-13. GitHub Actions repeats them on pull requests and changes to main. Tests cover domain behavior; they do not establish live authentication, persistence, or multi-user operation.

## Structure

- `src/services`: domain calculations and workflow behavior.
- `src/hooks`: React integration.
- `src/components`: reusable interface components.
- `src/types` and `src/utils`: types and formatting.

## Next useful milestone

Add a small application shell and browser tests before presenting this repository as a working hosted application. Keep demonstration data clearly labeled and avoid claims that exceed the implemented scope.
