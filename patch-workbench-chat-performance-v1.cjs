const fs = require('fs');

const workbenchPath = 'src/components/DavidAppWorkbench.tsx';
let content = fs.readFileSync(workbenchPath, 'utf8');

if (content.includes('WORKBENCH_CHAT_PERFORMANCE_V1')) {
  console.log('[chat-performance-v1] already applied');
  process.exit(0);
}

content = content.replace(
  "const HISTORY_LIMIT = 30;",
  `const HISTORY_LIMIT = 30;\n// WORKBENCH_CHAT_PERFORMANCE_V1\n// Keep DAVID chat lightweight on iPhone / Studio preview. The UI does not need\n// to retain or resend an unbounded transcript on every message.\nconst CHAT_RENDER_LIMIT = 24;\nconst CHAT_CONTEXT_LIMIT = 8;\nconst CHAT_MESSAGE_CHAR_LIMIT = 6000;\n\nfunction trimChatMessage(message) {\n  const clean = String(message || '');\n  return clean.length > CHAT_MESSAGE_CHAR_LIMIT\n    ? clean.slice(-CHAT_MESSAGE_CHAR_LIMIT)\n    : clean;\n}\n\nfunction appendChatMessage(items, message) {\n  return [...items, { ...message, content: trimChatMessage(message.content) }].slice(-CHAT_RENDER_LIMIT);\n}`
);

content = content.replace(
  `    const apiMessages = automatic\n      ? [{ role: 'user', content: \`${'${userText}${integrationInstruction}'}\` }]\n      : [\n          ...messagesRef.current.map((message) => ({\n            role: message.role === 'david' ? 'model' : 'user',\n            content: message.content,\n          })),\n          { role: 'user', content: \`${'${userText}${integrationInstruction}'}\` },\n        ];`,
  `    const apiMessages = automatic\n      ? [{ role: 'user', content: trimChatMessage(\`${'${userText}${integrationInstruction}'}\`) }]\n      : [\n          ...messagesRef.current\n            .slice(-CHAT_CONTEXT_LIMIT)\n            .map((message) => ({\n              role: message.role === 'david' ? 'model' : 'user',\n              content: trimChatMessage(message.content),\n            })),\n          { role: 'user', content: trimChatMessage(\`${'${userText}${integrationInstruction}'}\`) },\n        ];`
);

content = content.replace(
  `        state: {\n          ...stateRef.current,\n          mainPrompt: currentPrompt,\n          globalLocks: lockPayload,\n          workbenchMode: 'single-writer',\n        },`,
  `        // Send the useful control state, not a recursively growing application snapshot.\n        state: {\n          concept: currentPrompt,\n          mainPrompt: currentPrompt,\n          target: stateRef.current?.target,\n          targetLength: stateRef.current?.targetLength,\n          openArtModel: stateRef.current?.openArtModel,\n          grokMode: stateRef.current?.grokMode,\n          entropyLevel: stateRef.current?.entropyLevel,\n          straitjacketLevel: stateRef.current?.straitjacketLevel,\n          commandMode: stateRef.current?.commandMode,\n          useSearch: stateRef.current?.useSearch,\n          slopConfig: stateRef.current?.slopConfig\n            ? {\n                mutationMode: stateRef.current.slopConfig.mutationMode,\n                selectedSeeds: stateRef.current.slopConfig.selectedSeeds || [],\n                selectedOperators: stateRef.current.slopConfig.selectedOperators || [],\n                selectedAttractors: stateRef.current.slopConfig.selectedAttractors || [],\n                selectedPressures: stateRef.current.slopConfig.selectedPressures || [],\n                protectedAnchors: stateRef.current.slopConfig.protectedAnchors || [],\n              }\n            : undefined,\n          globalLocks: lockPayload,\n          workbenchMode: 'single-writer',\n        },`
);

// Replace the common append patterns so the rendered transcript cannot grow forever.
content = content.replaceAll(
  "setMessages((items) => [...items, { role: 'user', content: clean }]);",
  "setMessages((items) => appendChatMessage(items, { role: 'user', content: clean }));"
);
content = content.replaceAll(
  "setMessages((items) => [\n        ...items,",
  "setMessages((items) => appendChatMessage(items,"
);

// The replacement above changes closing syntax on multiline append blocks. Normalize
// every affected block from `]);` to `));` where appendChatMessage is in use.
content = content.replace(/setMessages\(\(items\) => appendChatMessage\(items,([\s\S]*?)\n\s*\]\);/g, (_m, body) => {
  const cleaned = body.replace(/^\s*\n/, '\n');
  return `setMessages((items) => appendChatMessage(items,${cleaned}\n      ));`;
});

fs.writeFileSync(workbenchPath, content, 'utf8');
console.log('[chat-performance-v1] capped chat rendering/context and slimmed DAVID request state');
