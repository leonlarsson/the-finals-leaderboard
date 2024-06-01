export default (obj: any, path: string) =>
  path.split(".").reduce((acc, part) => acc && acc[part], obj);
