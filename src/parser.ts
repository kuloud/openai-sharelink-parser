import * as acorn from "acorn";
import * as walk from "acorn-walk";

export function extractRemixContext(text: string): string {
  // 1. 获取网页文本
  const doc = new DOMParser().parseFromString(text, "text/html");

  const scriptTag = Array.from(doc.querySelectorAll("script")).find((script) =>
    script.innerText.includes("window.__remixContext")
  );
  if (!scriptTag) {
    return "Not Found";
  }
  const code = scriptTag.innerText;
  console.log("[code]", code);

  // 2. 使用 acorn 解析代码
  const ast = acorn.parse(code, {
    ecmaVersion: "latest",
    sourceType: "script",
    locations: true,
  });

  let remixContext = null;

  // 3. 遍历 AST
  walk.simple(ast, {
    AssignmentExpression(node) {
      if (
        node.left.type === "MemberExpression" &&
        node.left.object.name === "window" &&
        node.left.property.name === "__remixContext"
      ) {
        // 4. 提取右侧的对象节点
        const valueNode = node.right;

        // 将 AST 节点转换为代码字符串
        const start = valueNode.start;
        const end = valueNode.end;
        const objectCode = code.slice(start, end);
        console.log(objectCode);
        remixContext = objectCode;
      }
    },
  });

  return remixContext ?? "Failed";
}
