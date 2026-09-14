/**
 * `figma:asset/<file>` imports are rewritten to `src/figma-assets/<file>` by a
 * resolver plugin in `vite.config.ts`. Declaring the scheme here lets the
 * typechecker see them as image URLs rather than unresolved modules.
 */
declare module "figma:asset/*" {
  const src: string;
  export default src;
}
