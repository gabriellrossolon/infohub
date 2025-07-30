export const formatCpfOrCnpj = (value: string, type?: string): string => {
  const onlyNumbers = value.replace(/\D/g, "");

  const formatCpf = (cpf: string) => {
    const length = cpf.length;
    if (length <= 3) return cpf;
    if (length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    if (length <= 9)
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(
      6,
      9
    )}-${cpf.slice(9, 11)}`;
  };

  const formatCnpj = (cnpj: string) => {
    const length = cnpj.length;
    if (length <= 2) return cnpj;
    if (length <= 5) return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
    if (length <= 8)
      return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
    if (length <= 12)
      return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(
        5,
        8
      )}/${cnpj.slice(8)}`;
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(
      5,
      8
    )}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
  };

  if (type === "CPF") return formatCpf(onlyNumbers);
  if (type === "CNPJ") return formatCnpj(onlyNumbers);

  if (onlyNumbers.length <= 11) return formatCpf(onlyNumbers);
  return formatCnpj(onlyNumbers);
};

export function parseUtcString(dateString?: string | null): Date | null {
  if (!dateString) return null;
  return new Date(dateString.replace("Z", ""));
}
