/**
 * Local ESLint rule: require stegaClean() when rendering Sanity content inside
 * JSX or Astro expression containers.
 *
 * Sanity's client (with stega enabled, which we use for Visual Editing) embeds
 * invisible metadata characters into string field values so the Studio overlay
 * can map clicks back to the source document. Those characters look fine in the
 * DOM but they leak into URLs, `tel:`/`mailto:` hrefs, slug routing, business
 * logic, copy-to-clipboard, etc. The fix is to pass the value through
 * `stegaClean()` from `@sanity/client/stega` before rendering.
 *
 * The rule reports any member-expression chain rooted in a configured Sanity
 * source identifier (e.g. `settings`, `page`, `cat`) that appears inside a
 * JSXExpressionContainer without being wrapped in a `stegaClean(...)` call.
 *
 * It only flags reads whose TypeScript type contains `string` — numeric and
 * object/array fields can never carry stega encoding, so they're skipped. This
 * requires the parser to expose typed parser services (configured in
 * eslint.config.js via `projectService: true`).
 *
 * It also deliberately ignores:
 *   - Method calls on the source (e.g. `categories.map(...)`)
 *   - Truthiness guards (e.g. `settings?.phone && <a/>`)
 *   - Inner member nodes of a longer chain (only the top of the chain is checked)
 *   - Reads of `.length` / `.size`
 *
 * Configure additional source identifiers via the `sources` option.
 */

import ts from "typescript";

const STRING_TYPE_FLAGS =
  ts.TypeFlags.String |
  ts.TypeFlags.StringLiteral |
  ts.TypeFlags.TemplateLiteral |
  ts.TypeFlags.StringMapping;

function typeContainsString(type) {
  if (!type) return false;
  if (typeof type.isUnion === "function" && type.isUnion()) {
    return type.types.some(typeContainsString);
  }
  if (typeof type.isIntersection === "function" && type.isIntersection()) {
    return type.types.some(typeContainsString);
  }
  return (type.flags & STRING_TYPE_FLAGS) !== 0;
}

const DEFAULT_SOURCES = [
  "settings",
  "page",
  "product",
  "products",
  "category",
  "categories",
  "categoryTemplatePage",
  "labels",
  "link",
  "links",
  "navLinks",
  "footerLinks",
  "cat",
  "item",
  "items",
];

function unwrapChain(node) {
  while (node && node.type === "ChainExpression") node = node.expression;
  return node;
}

function getRootIdentifier(node) {
  let cur = node;
  while (cur) {
    cur = unwrapChain(cur);
    if (!cur) return null;
    if (cur.type === "TSNonNullExpression") {
      cur = cur.expression;
      continue;
    }
    if (cur.type === "MemberExpression") {
      cur = cur.object;
      continue;
    }
    break;
  }
  return cur && cur.type === "Identifier" ? cur : null;
}

function isTopOfChain(node) {
  // Walk past a wrapping ChainExpression to find the "effective" parent.
  let effective = node;
  let parent = effective.parent;
  if (parent && parent.type === "ChainExpression") {
    effective = parent;
    parent = effective.parent;
  }
  if (!parent) return true;
  if (parent.type === "MemberExpression" && parent.object === effective) {
    return false;
  }
  return true;
}

function isMethodCallee(node) {
  let effective = node;
  let parent = effective.parent;
  if (parent && parent.type === "ChainExpression") {
    effective = parent;
    parent = effective.parent;
  }
  return (
    !!parent && parent.type === "CallExpression" && parent.callee === effective
  );
}

function isLogicalAndGuardLeft(node) {
  let effective = node;
  let parent = effective.parent;
  if (parent && parent.type === "ChainExpression") {
    effective = parent;
    parent = effective.parent;
  }
  return (
    !!parent &&
    parent.type === "LogicalExpression" &&
    parent.operator === "&&" &&
    parent.left === effective
  );
}

function isWrappedInStegaClean(node) {
  let cur = node.parent;
  while (cur) {
    if (
      cur.type === "CallExpression" &&
      cur.callee &&
      cur.callee.type === "Identifier" &&
      cur.callee.name === "stegaClean"
    ) {
      return true;
    }
    // Don't escape past the JSX expression container — a `stegaClean` wrapper
    // outside of the rendered expression doesn't sanitize this read.
    if (cur.type === "JSXExpressionContainer") return false;
    cur = cur.parent;
  }
  return false;
}

function isInsideJsxExpressionContainer(node) {
  let cur = node.parent;
  while (cur) {
    if (cur.type === "JSXExpressionContainer") return true;
    cur = cur.parent;
  }
  return false;
}

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require stegaClean() when rendering Sanity content inside JSX/Astro expression containers.",
    },
    schema: [
      {
        type: "object",
        properties: {
          sources: {
            type: "array",
            items: { type: "string" },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missing:
        "Sanity content `{{name}}` is rendered without stegaClean(). Wrap it in stegaClean(...) (from @sanity/client/stega) so stega-encoded characters don't leak into the DOM, URLs, or business logic.",
    },
  },
  create(context) {
    const opts = context.options[0] || {};
    const sources = new Set(opts.sources || DEFAULT_SOURCES);
    const sourceCode = context.sourceCode || context.getSourceCode();
    const services = sourceCode.parserServices || context.parserServices;
    // Without typed parser services we can't tell strings from numbers/arrays;
    // bail rather than spam false positives.
    if (!services || !services.program || !services.esTreeNodeToTSNodeMap) {
      return {};
    }
    const checker = services.program.getTypeChecker();

    return {
      MemberExpression(node) {
        if (!isTopOfChain(node)) return;
        if (isMethodCallee(node)) return;
        if (isLogicalAndGuardLeft(node)) return;

        // `.length` / `.size` always return numbers — stega never touches them.
        if (
          !node.computed &&
          node.property.type === "Identifier" &&
          (node.property.name === "length" || node.property.name === "size")
        ) {
          return;
        }

        const root = getRootIdentifier(node);
        if (!root || !sources.has(root.name)) return;

        if (!isInsideJsxExpressionContainer(node)) return;
        if (isWrappedInStegaClean(node)) return;

        const tsNode = services.esTreeNodeToTSNodeMap.get(node);
        if (!tsNode) return;
        const type = checker.getTypeAtLocation(tsNode);
        if (!typeContainsString(type)) return;

        context.report({
          node,
          messageId: "missing",
          data: { name: sourceCode.getText(node) },
        });
      },
    };
  },
};
