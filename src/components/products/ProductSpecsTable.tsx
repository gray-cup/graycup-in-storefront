type ProductSpecsTableProps = {
  specs?: { label: string; value: string }[];
};

export function ProductSpecsTable({ specs }: ProductSpecsTableProps) {
  if (!specs || specs.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <tbody>
          {specs.map((spec, i) => (
            <tr
              key={spec.label}
              className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="px-4 py-2.5 font-medium text-gray-600 w-1/3">
                {spec.label}
              </td>
              <td className="px-4 py-2.5 text-gray-800">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
