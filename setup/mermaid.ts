import type { MermaidConfig } from 'mermaid'

export default function (): MermaidConfig {
  return {
    flowchart: {
      nodeSpacing: 15,
      rankSpacing: 25,
    },
  }
}
