import { Controls, Description, Primary, Source, Stories, Subtitle, Title, useOf } from "@storybook/addon-docs/blocks";

export interface ComponentSourceParameter {
  /** File name → file contents (imported with Vite's `?raw`). */
  files: Record<string, string>;
}

function languageFor(fileName: string): "tsx" | "css" {
  return fileName.endsWith(".css") ? "css" : "tsx";
}

/** Shows the implementation files registered in `parameters.componentSource`. */
function ComponentSource() {
  const resolved = useOf("meta", ["meta"]);
  const parameter = resolved.type === "meta" ? (resolved.preparedMeta.parameters.componentSource as ComponentSourceParameter | undefined) : undefined;
  if (!parameter) return null;
  const entries = Object.entries(parameter.files);
  return (
    <section>
      <h2 id="component-source">Component source</h2>
      <p>The implementation behind this component, straight from the repository. Copy these files to reuse the component without installing the package.</p>
      {entries.map(([name, code], index) => (
        <details key={name} open={index === 0} style={{ marginBottom: 16 }}>
          <summary style={{ cursor: "pointer", fontWeight: 600, marginBottom: 8 }}>
            <code>{name}</code>
          </summary>
          <Source code={code} language={languageFor(name)} dark />
        </details>
      ))}
    </section>
  );
}

/** Default docs page: the standard blocks plus the component source at the end. */
export function ComponentDocs() {
  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <Primary />
      <Controls />
      <Stories />
      <ComponentSource />
    </>
  );
}
