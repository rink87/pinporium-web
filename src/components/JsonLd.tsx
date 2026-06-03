type JsonLdNode = Record<string, unknown>;

type Props = {
  data: JsonLdNode | JsonLdNode[];
};

const JsonLd: React.FC<Props> = ({ data }) => {
  const graph = Array.isArray(data) ? data : [data];
  const json =
    graph.length === 1
      ? JSON.stringify({ "@context": "https://schema.org", ...graph[0] })
      : JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
};

export default JsonLd;
